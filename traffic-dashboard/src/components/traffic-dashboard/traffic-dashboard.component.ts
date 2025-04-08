import {
  Component, OnInit, ChangeDetectionStrategy, inject, OnDestroy,
  AfterViewInit, // For view initialization callback
  ViewChild, ElementRef // For accessing template elements
} from '@angular/core';
import { AsyncPipe, NgFor, NgIf, DecimalPipe } from '@angular/common'; // Common directives and pipes
import { Observable, BehaviorSubject, EMPTY, combineLatest, Subject } from 'rxjs'; // RxJS essentials
import { catchError, tap, map, startWith, takeUntil, delay } from 'rxjs/operators'; // RxJS operators

// Import Chart.js (use Chart and registerables for v3+)
import { Chart, registerables, ChartConfiguration, ChartData } from 'chart.js';

import { TrafficService } from '../../services/traffic.service'; // Adjust path if needed
import { TrafficData } from '../../models/traffic-data.model'; // Adjust path if needed

// Register Chart.js components (do this once)
Chart.register(...registerables);

@Component({
  selector: 'app-traffic-dashboard',
  standalone: true, // Using standalone component feature
  imports: [
    NgIf,         // For conditional display
    NgFor,        // For looping through data
    AsyncPipe,    // For handling observables in the template
    DecimalPipe   // For the 'number' pipe
  ],
  templateUrl: './traffic-dashboard.component.html',
  styleUrls: ['./traffic-dashboard.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush // Optimize change detection
})
export class TrafficDashboardComponent implements OnInit, OnDestroy, AfterViewInit {

  // Get reference to the canvas element in the template
  @ViewChild('trafficChartCanvas') trafficChartCanvas!: ElementRef<HTMLCanvasElement>;

  // Inject services and initialize subjects/observables
  private trafficService = inject(TrafficService);
  private destroy$ = new Subject<void>(); // Used to unsubscribe observables on component destroy
  private chartInstance?: Chart; // Property to hold the chart instance

  // --- State Observables ---

  // Raw data stream directly from the service
  private rawTrafficData$!: Observable<TrafficData[]>;

  // Filter state - public because used in template binding [value]
  public thresholdSubject = new BehaviorSubject<number>(0); // Default threshold 0
  threshold$: Observable<number> = this.thresholdSubject.asObservable();

  // Derived state: Filtered data based on raw data and threshold
  filteredTrafficData$!: Observable<TrafficData[]>;

  // Loading and error states for UI feedback
  private loadingSubject = new BehaviorSubject<boolean>(true);
  isLoading$: Observable<boolean> = this.loadingSubject.asObservable();

  private errorSubject = new BehaviorSubject<string | null>(null);
  error$: Observable<string | null> = this.errorSubject.asObservable();


  // --- Lifecycle Hooks ---

  ngOnInit(): void {
    // Load data initially and set up filtering logic
    this.loadAndFilterTrafficData();
    // Subscribe to the filtered data stream to update the chart whenever it changes
    this.subscribeToFilteredDataForChart();
  }

  ngAfterViewInit(): void {
    // This hook confirms the component's view (including the canvas) is initialized.
    // @ViewChild queries are resolved before this hook.
    console.log('ngAfterViewInit fired. Canvas Ref available:', !!this.trafficChartCanvas);
  }

  ngOnDestroy(): void {
    // Clean up subscriptions and resources to prevent memory leaks
    this.destroy$.next(); // Signal subscribers to complete
    this.destroy$.complete();
    this.destroyChart(); // Explicitly destroy the Chart.js instance
  }

  // --- Data Handling Methods ---

  loadAndFilterTrafficData(): void {
    this.loadingSubject.next(true); // Set loading state
    this.errorSubject.next(null);   // Clear previous errors

    // 1. Define the raw data stream from the API
    this.rawTrafficData$ = this.trafficService.getTrafficData().pipe(
      tap(() => this.loadingSubject.next(false)), // Stop loading on success
      catchError(err => {
        console.error("Error loading traffic data:", err);
        this.errorSubject.next(err.message || 'Failed to load traffic data.');
        this.loadingSubject.next(false); // Stop loading on error
        return EMPTY; // Return an empty observable to complete gracefully after an error
      }),
      takeUntil(this.destroy$) // Ensure unsubscription when component is destroyed
    );

    // 2. Define the filtered data stream based on raw data and threshold
    this.filteredTrafficData$ = combineLatest([
      // Use startWith to provide an initial empty array, ensuring combineLatest emits immediately
      // and handles cases where the API call fails or is slow.
      this.rawTrafficData$.pipe(startWith<TrafficData[]>([])),
      this.threshold$ // Combine with the latest threshold value
    ]).pipe(
      map(([data, threshold]) => {
        // console.log(`Filtering data with threshold: ${threshold}`); // Debugging line
        if (!data) {
           return []; // Handle potential null/undefined data
        }
        // Apply the actual filter logic
        return data.filter(item => item.traffic >= threshold);
      }),
      takeUntil(this.destroy$) // Ensure unsubscription
    );
  }

  /**
   * Subscribes to the filtered data stream to trigger chart updates.
   */
  subscribeToFilteredDataForChart(): void {
    this.filteredTrafficData$
      .pipe(
         // Add a small delay (0ms) to allow the DOM to potentially stabilize after data changes,
         // helping prevent race conditions with chart rendering.
        delay(0),
        takeUntil(this.destroy$) // Ensure unsubscription
      )
      .subscribe(filteredData => {
        // Attempt to create or update the chart with the new data
        // The checks inside createOrUpdateChart handle canvas readiness and empty data.
        this.createOrUpdateChart(filteredData);
      });
  }

  // --- Charting Methods ---

  /**
   * Creates a new Chart.js chart instance or updates an existing one.
   * Includes dark theme color adjustments.
   * @param data The traffic data to display (already filtered).
   */
  createOrUpdateChart(data: TrafficData[]): void {
    // 1. Ensure the canvas element reference is valid
    if (!this.trafficChartCanvas?.nativeElement) {
      console.error('Chart canvas reference not found. Cannot create/update chart.');
      return; // Exit if canvas isn't available
    }
    const canvas = this.trafficChartCanvas.nativeElement;
    const ctx = canvas.getContext('2d');

    // 2. Ensure the canvas context is available
    if (!ctx) {
      console.error('Failed to get 2D context from canvas.');
      return; // Exit if context cannot be obtained
    }

    // 3. Handle empty data: Destroy old chart and don't draw a new one
    if (!data || data.length === 0) {
        // console.log('No data to display in chart. Destroying previous instance if any.');
        this.destroyChart(); // Clean up any existing chart
        return; // Exit function
    }

    // 4. Prepare data in the format Chart.js expects
    const labels = data.map(item => item.page_url);
    const trafficCounts = data.map(item => item.traffic);

    const chartData: ChartData = {
        labels: labels,
        datasets: [{
            label: 'Traffic Count',
            data: trafficCounts,
            // --- Dark Theme Colors ---
            backgroundColor: 'rgba(66, 165, 245, 0.7)', // Vibrant blue with transparency
            borderColor: 'rgba(66, 165, 245, 1)',      // Solid blue border
            hoverBackgroundColor: 'rgba(66, 165, 245, 0.9)', // More opaque on hover
            borderWidth: 1
        }]
    };

    // 5. Define chart configuration (type, data, options) with dark theme adjustments
    const config: ChartConfiguration = {
        type: 'bar', // Choose chart type ('bar', 'line', 'pie', etc.)
        data: chartData,
        options: {
            responsive: true, // Make chart resize with container
            maintainAspectRatio: false, // Allow custom aspect ratio via CSS height/width
            scales: { // Configure axes for dark theme
                y: {
                    beginAtZero: true, // Start Y axis at 0
                    title: {
                      display: true,
                      text: 'Traffic Count',
                      color: '#bdbdbd' // Light grey axis title
                    },
                    ticks: {
                        color: '#bdbdbd' // Light grey axis labels (ticks)
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)' // Subtle light grid lines
                    }
                },
                x: {
                    title: {
                      display: true,
                      text: 'Page URL',
                      color: '#bdbdbd' // Light grey axis title
                    },
                    ticks: {
                        color: '#bdbdbd' // Light grey axis labels (ticks)
                    },
                    grid: {
                        // Make vertical grid lines very subtle or disable if preferred
                        color: 'rgba(255, 255, 255, 0.05)'
                    }
                }
            },
            plugins: { // Configure plugins like legend and tooltips for dark theme
                legend: {
                    // Show legend only if there's more than one dataset
                    display: chartData.datasets.length > 1,
                    labels: {
                        color: '#bdbdbd' // Light grey legend text
                    }
                },
                tooltip: {
                    enabled: true,
                    backgroundColor: 'rgba(0, 0, 0, 0.8)', // Dark tooltip background
                    titleColor: '#ffffff', // White tooltip title
                    bodyColor: '#e0e0e0'   // Light grey tooltip body text
                }
            }
        }
    };

    // 6. Destroy any previous chart instance before creating a new one
    // console.log('Attempting to destroy previous chart instance...');
    this.destroyChart();

    // 7. Create the new chart instance
    try {
       // console.log('Creating new chart instance...');
       this.chartInstance = new Chart(ctx, config);
       // console.log('Chart created/updated successfully.');
    } catch (error) {
        console.error('Error creating chart:', error);
        this.destroyChart(); // Attempt cleanup if creation failed
    }
  }

  /**
   * Safely destroys the current Chart.js instance if it exists.
   */
  private destroyChart(): void {
     if (this.chartInstance) {
       this.chartInstance.destroy();
       this.chartInstance = undefined; // Clear the reference
      //  console.log('Previous chart instance destroyed.');
     }
  }

  // --- Event Handlers & Actions ---

  /**
   * Updates the threshold value when the filter input changes.
   * @param event The input event from the threshold input field.
   */
  onThresholdChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    // Use parseInt for whole numbers, or parseFloat if decimals are possible/needed
    const value = parseInt(inputElement.value, 10);
    // Update the subject, defaulting to 0 if input is invalid (NaN)
    this.thresholdSubject.next(isNaN(value) ? 0 : value);
  }

  /**
   * Initiates a reload of the traffic data.
   */
  retryLoad(): void {
    // Optionally reset filter on retry: this.thresholdSubject.next(0);
    this.loadAndFilterTrafficData();
  }
}

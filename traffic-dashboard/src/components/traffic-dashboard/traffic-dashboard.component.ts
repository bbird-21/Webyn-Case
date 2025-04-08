import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { AsyncPipe, DecimalPipe, NgFor, NgIf } from '@angular/common';
import { Observable, BehaviorSubject, EMPTY } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { TrafficService } from '../../services/traffic.service'; // Adjust path
import { TrafficData } from '../../models/traffic-data.model'; // Adjust path

@Component({
  selector: 'app-traffic-dashboard',
  standalone: true, // Using standalone component feature (common in v16+)
  imports: [
    NgIf,         // For conditional display (loading, error, data)
    NgFor,        // For looping through data in the table
    AsyncPipe,     // For handling observables directly in the template
    DecimalPipe // <--- Make 100% sure DecimalPipe is listed here
  ],
  templateUrl: './traffic-dashboard.component.html',
  styleUrls: ['./traffic-dashboard.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush // Good practice for performance
})
export class TrafficDashboardComponent implements OnInit {

  // Inject the service using the modern `inject` function
  private trafficService = inject(TrafficService);

  // Observable to hold the stream of traffic data
  trafficData$!: Observable<TrafficData[]>;

  // Subjects to manage loading and error states reactively
  private loadingSubject = new BehaviorSubject<boolean>(true);
  isLoading$ = this.loadingSubject.asObservable();

  private errorSubject = new BehaviorSubject<string | null>(null);
  error$ = this.errorSubject.asObservable();


  ngOnInit(): void {
    this.loadTrafficData();
  }

  loadTrafficData(): void {
    this.loadingSubject.next(true); // Start loading
    this.errorSubject.next(null);   // Clear previous errors

    this.trafficData$ = this.trafficService.getTrafficData().pipe(
      tap(() => this.loadingSubject.next(false)), // Stop loading on success
      catchError(err => {
        console.error("Error caught in component:", err);
        this.errorSubject.next(err.message || 'Failed to load traffic data.'); // Set error message
        this.loadingSubject.next(false); // Stop loading on error
        return EMPTY; // Return an empty observable to prevent downstream errors
                      // or complete the stream gracefully after an error.
                      // Alternatively, you could return of([]) to show an empty table.
      })
    );
  }

  // Optional: Add a retry mechanism
  retryLoad(): void {
    this.loadTrafficData();
  }
}

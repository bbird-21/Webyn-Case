import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TrafficDashboardComponent } from '../components/traffic-dashboard/traffic-dashboard.component'; // Import

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    // RouterOutlet,
    TrafficDashboardComponent // Add the import here
  ],
  templateUrl: './app.component.html',
  // styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'my-angular-app';
}

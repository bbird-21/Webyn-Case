import { Routes } from '@angular/router';
import { TrafficDashboardComponent } from '../components/traffic-dashboard/traffic-dashboard.component'; // <-- Import

export const routes: Routes = [
    {
        path: 'dashboard', // Or '' for the default route
        component: TrafficDashboardComponent // <-- Use the component here
    },
    // Add other routes here
    {
        path: '', // Example redirect to dashboard
        redirectTo: '/dashboard',
        pathMatch: 'full'
    }
    // { path: '**', component: PageNotFoundComponent }, // Optional: 404 route
];

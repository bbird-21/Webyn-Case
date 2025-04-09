import { Routes } from '@angular/router';
import { TrafficDashboardComponent } from '../components/traffic-dashboard/traffic-dashboard.component'; // <-- Import

export const routes: Routes = [
    {
        path: 'dashboard',
        component: TrafficDashboardComponent
    },
    {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full'
    }
    // { path: '**', component: PageNotFoundComponent },
];

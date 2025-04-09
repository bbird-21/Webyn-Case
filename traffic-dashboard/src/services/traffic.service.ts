import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { TrafficData } from '../models/traffic-data.model';

@Injectable({
  providedIn: 'root'
})
export class TrafficService {

  private apiUrl = '/api/traffic';

  constructor(private http: HttpClient) { }

  /**
   * Fetches traffic data from the backend API.
   * @returns An Observable array of TrafficData.
   */
  getTrafficData(): Observable<TrafficData[]> {
    console.log(`Fetching traffic data from: ${this.apiUrl}`); // For debugging
    return this.http.get<TrafficData[]>(this.apiUrl).pipe(
      tap(data => console.log('Received traffic data:', data)), // For debugging
      catchError(this.handleError) // Basic error handling
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Backend returned an unsuccessful response code
      errorMessage = `Server returned code: ${error.status}, error message is: ${error.message}`;
      if (error.error && typeof error.error === 'string') {
         errorMessage += `\nServer Error Details: ${error.error}`;
      } else if (error.error && typeof error.error === 'object') {
         errorMessage += `\nServer Error Details: ${JSON.stringify(error.error)}`;
      }
    }
    // Return an observable error
    console.error('Error fetching traffic data:', error);
    return throwError(() => new Error(errorMessage));
  }
}

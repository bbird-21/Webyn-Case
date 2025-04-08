import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { TrafficData } from '../models/traffic-data.model'; // Adjust path if needed

@Injectable({
  providedIn: 'root' // Provided globally, no need to add to AppModule providers
})
export class TrafficService {

  // IMPORTANT: Adjust this URL if your API is hosted elsewhere
  // or if you are using a proxy configuration.
  private apiUrl = '/api/traffic'; // Assumes same origin or proxy

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
      // The response body may contain clues as to what went wrong
      errorMessage = `Server returned code: ${error.status}, error message is: ${error.message}`;
      if (error.error && typeof error.error === 'string') {
         errorMessage += `\nServer Error Details: ${error.error}`;
      } else if (error.error && typeof error.error === 'object') {
         errorMessage += `\nServer Error Details: ${JSON.stringify(error.error)}`;
      }
    }
    console.error('Error fetching traffic data:', error); // Log the detailed error
    return throwError(() => new Error(errorMessage)); // Return an observable error
  }
}

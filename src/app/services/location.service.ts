import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  apiGeolocationSuccess = function (position: any, observer: any) {
    observer.next({
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    });
    observer.complete();
  };

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `,
        error.error
      );
    }
    // Return an observable with a user-facing error message.
    return throwError(
      () => new Error('Something bad happened; please try again later.')
    );
  }

  tryAPIGeolocation(observer: any) {
    this.http
      .post(
        `https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyDNbbM7qdeQrOXUN2Mhovv5_pS1LUg-2DM`,
        {}
      )
      .subscribe({
        next: (success: any) => {
          // console.log(success);
          let position = {
            coords: {
              latitude: success.location.lat,
              longitude: success.location.lng,
            },
          };
          this.apiGeolocationSuccess(position, observer);
        },
        error: (error) => {
          this.handleError(error);
        },
      });
  }

  browserGeolocationSuccess(position: any, observer: any) {
    // console.log(position);
    observer.next({
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    });
    observer.complete();
  }

  browserGeolocationFail(error: any, observer: any) {
    // console.log(error);
    switch (error.code) {
      case error.TIMEOUT:
        alert('Browser geolocation error !\n\nTimeout.');
        break;
      case error.PERMISSION_DENIED:
        this.tryAPIGeolocation(observer);
        break;
      case error.POSITION_UNAVAILABLE:
        alert('Browser geolocation error !\n\nPosition unavailable.');
        break;
    }
  }

  getPosition(): Observable<any> {
    return new Observable((observer: any) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.browserGeolocationSuccess(position, observer);
        },
        (error) => {
          this.browserGeolocationFail(error, observer);
        },
        { maximumAge: 50000, timeout: 20000, enableHighAccuracy: true }
      );
    });
  }

  constructor(private http: HttpClient) {}
}

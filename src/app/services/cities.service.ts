import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CitiesService {
  url = 'https://countriesnow.space/api/v0.1/countries/cities';

  getCities(country: string) {
    return this.http.post(this.url, { country });
  }

  constructor(private http: HttpClient) {}
}

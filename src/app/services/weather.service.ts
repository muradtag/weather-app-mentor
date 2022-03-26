import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  private apiKey = environment.wwoApiKey;
  private format = '&format=json';
  private includeLocation = '&includeLocation=yes';

  private baseUrl = `http://api.worldweatheronline.com/premium/v1/`;

  getWeather(location: string) {
    let url =
      this.baseUrl +
      'weather.ashx?key=' +
      this.apiKey +
      '&q=' +
      location +
      this.format +
      this.includeLocation +
      '&tp=1' +
      '&extra=isDayTime';

    return this.http.get(url);
  }

  getPastWeather(location: string) {
    let today = new Date().toISOString().slice(0, 10);
    let lastMonth: Date | string = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    lastMonth.setHours(0, 0, 0, 0);
    lastMonth = lastMonth.toISOString().slice(0, 10);

    // console.log(today, lastMonth);

    let url =
      this.baseUrl +
      'past-weather.ashx?key=' +
      this.apiKey +
      '&q=' +
      location +
      this.format +
      this.includeLocation +
      '&tp=24' +
      '&date=' +
      lastMonth +
      '&enddate=' +
      today;

    return this.http.get(url);
  }

  constructor(private http: HttpClient) {}
}

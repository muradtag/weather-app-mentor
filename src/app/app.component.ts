import { Component } from '@angular/core';
import { CitiesService } from './services/cities.service';
import { WeatherService } from './services/weather.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'weather-app';

  constructor(public cities: CitiesService, public weather: WeatherService) {
    // this.cities.getCities('egypt').subscribe((cities) => {
    //   console.log(cities);
    // });

    // this.weather.getWeather('197.55.119.224').subscribe((data) => {
    //   console.log(data);
    // });

    this.weather.getPastWeather('197.55.119.224').subscribe((data) => {
      console.log(data);
    });
  }
}

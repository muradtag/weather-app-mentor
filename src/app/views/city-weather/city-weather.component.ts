import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WeatherService } from 'src/app/services/weather.service';

@Component({
  selector: 'app-city-weather',
  templateUrl: './city-weather.component.html',
  styleUrls: ['./city-weather.component.css'],
})
export class CityWeatherComponent implements OnInit {
  weatherData: any;
  monthlyData: any;
  CurrentLoaded: Boolean = false;
  PastLoaded: Boolean = false;
  CurrentError: boolean = false;
  PastError: boolean = false;

  constructor(
    private weatherServ: WeatherService,
    private ac: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.ac.params.subscribe((params) => {
      let city = params['city'];
      let country = params['country'];
      this.weatherServ.getWeather(`${city},${country}`).subscribe({
        next: (data) => {
          this.weatherData = data;
          this.CurrentLoaded = true;
          // console.log(this.weatherData);
        },
        error: () => {
          this.CurrentError = true;
          this.CurrentLoaded = true;
        },
      });
      this.weatherServ.getPastWeather(`${city},${country}`).subscribe({
        next: (data) => {
          this.monthlyData = data;
          this.PastLoaded = true;
          // console.log(this.monthlyData);
        },
        error: () => {
          this.PastError = true;
          this.PastLoaded = true;
        },
      });
    });
  }
}

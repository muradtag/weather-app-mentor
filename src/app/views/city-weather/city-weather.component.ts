import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WeatherService } from 'src/app/services/weather.service';

@Component({
  selector: 'app-city-weather',
  templateUrl: './city-weather.component.html',
  styleUrls: ['./city-weather.component.css'],
})
export class CityWeatherComponent implements OnInit {
  weather: any;
  loaded: Boolean = false;

  constructor(
    private weatherServ: WeatherService,
    private ac: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // this.ac.params.pipe(
    // )
  }
}

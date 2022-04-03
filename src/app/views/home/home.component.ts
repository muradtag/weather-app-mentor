import { Component, OnInit } from '@angular/core';
import { WeatherService } from 'src/app/services/weather.service';
import { LocationService } from 'src/app/services/location.service';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  weatherData: any;
  locationValid: Boolean = false;
  country: string = '';

  constructor(
    private weatherServ: WeatherService,
    private location: LocationService
  ) {}

  ngOnInit(): void {
    this.location
      .getPosition()
      .pipe(
        // switchMap((pos) => this.weatherServ.getWeather(`manila`))
        switchMap((pos) => this.weatherServ.getWeather(`${pos.lat},${pos.lng}`))
      )
      .subscribe({
        next: (data) => {
          this.weatherData = data;
          this.locationValid = true;
          this.country = this.weatherData.data.nearest_area[0].country[0].value;
          // console.log(data);
        },
        error: (err) => console.log(err),
      });
  }
}

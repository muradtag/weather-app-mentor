import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrentWeatherComponent } from './current-weather/current-weather.component';
import { DailyWeatherComponent } from './daily-weather/daily-weather.component';
import { WeeklyWeatherComponent } from './weekly-weather/weekly-weather.component';
import { WeatherDetailsComponent } from './weather-details/weather-details.component';

@NgModule({
  declarations: [
    CurrentWeatherComponent,
    DailyWeatherComponent,
    WeeklyWeatherComponent,
    WeatherDetailsComponent,
  ],
  imports: [CommonModule],
  exports: [
    CurrentWeatherComponent,
    DailyWeatherComponent,
    WeeklyWeatherComponent,
    WeatherDetailsComponent,
  ],
})
export class WeatherModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { CityWeatherComponent } from './city-weather/city-weather.component';
import { WeatherModule } from '../weather/weather.module';
import { CitiesModule } from '../cities/cities.module';

@NgModule({
  declarations: [HomeComponent, CityWeatherComponent],
  imports: [CommonModule, WeatherModule, CitiesModule],
  exports: [HomeComponent, CityWeatherComponent],
})
export class ViewsModule {}

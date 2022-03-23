import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-current-weather',
  templateUrl: './current-weather.component.html',
  styleUrls: ['./current-weather.component.css'],
})
export class CurrentWeatherComponent implements OnInit {
  @Input() weatherData: any;

  isDayTime: string = '';
  currentTemp: string = '';
  humidity: string = '';
  maxTemp: string = '';
  minTemp: string = '';
  weatherDesc: string = '';
  weatherCode: string = '';
  imageSrc: string = '';
  areaName: string = '';
  country: string = '';
  date = new Date().toLocaleString('en-us', {
    weekday: 'short',
    month: 'long',
    day: '2-digit',
    hour12: true,
    hour: '2-digit',
    minute: '2-digit',
  });

  constructor() {}

  ngOnInit(): void {
    this.isDayTime = this.weatherData.data.current_condition[0].isDayTime;
    this.currentTemp = this.weatherData.data.current_condition[0].temp_C;
    this.humidity = this.weatherData.data.current_condition[0].humidity;
    this.weatherDesc =
      this.weatherData.data.current_condition[0].weatherDesc[0].value;
    this.weatherCode = this.weatherData.data.current_condition[0].weatherCode;
    this.maxTemp = this.weatherData.data.weather[0].maxtempC;
    this.minTemp = this.weatherData.data.weather[0].mintempC;
    this.areaName = this.weatherData.data.nearest_area[0].areaName[0].value;
    this.country = this.weatherData.data.nearest_area[0].country[0].value;

    if (this.weatherCode === '113')
      this.imageSrc =
        this.isDayTime === 'yes'
          ? './assets/images/weather-icons/113-1.png'
          : './assets/images/weather-icons/113-2.png';
    else if (this.weatherCode === '116')
      this.imageSrc =
        this.isDayTime === 'yes'
          ? './assets/images/weather-icons/116-1.png'
          : './assets/images/weather-icons/116-2.png';
    else this.imageSrc = `./assets/images/${this.weatherCode}.png`;

    // console.log(this.date);
  }
}

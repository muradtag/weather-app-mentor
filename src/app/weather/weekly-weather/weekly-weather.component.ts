import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-weekly-weather',
  templateUrl: './weekly-weather.component.html',
  styleUrls: ['./weekly-weather.component.css'],
})
export class WeeklyWeatherComponent implements OnInit {
  @Input() weatherData: any;

  weeklyWeather: any;

  getImageSrc(weatherCode: string, isDayTime: string): string {
    let imageSrc = './assets/images/weather-icons/113-1.png';

    if (weatherCode === '113')
      imageSrc =
        isDayTime === 'yes'
          ? './assets/images/weather-icons/113.png'
          : './assets/images/weather-icons/113-2.png';
    else if (weatherCode === '116')
      imageSrc =
        isDayTime === 'yes'
          ? './assets/images/weather-icons/116.png'
          : './assets/images/weather-icons/116-2.png';
    else imageSrc = `./assets/images/weather-icons/${weatherCode}.png`;

    return imageSrc;
  }

  getDay(date: string): string {
    let today = new Date().toISOString().slice(0, 10);
    let day = '';
    let days = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];

    if (date === today) day = 'Today';
    else day = days[new Date(date).getDay()];

    return day;
  }

  constructor() {}

  ngOnInit(): void {
    this.weeklyWeather = this.weatherData.data.weather.slice(0, 7);
    console.log(this.weeklyWeather);
    console.log(new Date('2022-03-01').getDay());
  }
}

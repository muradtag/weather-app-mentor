import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-daily-weather',
  templateUrl: './daily-weather.component.html',
  styleUrls: ['./daily-weather.component.css'],
})
export class DailyWeatherComponent implements OnInit {
  @Input() weatherData: any;

  hourlyData: any;

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

  getTime(index: number): string {
    let time = 0;
    let ampm = 'AM';

    if (index === 0) time = 12;
    else if (index < 13) time = index;
    else time = index - 12;

    if (index < 12) ampm = 'AM';
    else ampm = 'PM';

    return time + ampm;
  }

  constructor() {}

  ngOnInit(): void {
    this.hourlyData = this.weatherData.data.weather[0].hourly;
    // console.log('hourly', this.hourlyData);
  }
}

import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-weather-details',
  templateUrl: './weather-details.component.html',
  styleUrls: ['./weather-details.component.css'],
})
export class WeatherDetailsComponent implements OnInit {
  @Input() weatherData: any;
  data = [
    { imageSrc: 'wind.svg', title: 'Wind Speed', value: '', unit: 'Kmph' },
    {
      imageSrc: 'wind-direction.jpg',
      title: 'Wind Direction',
      value: '',
      unit: '',
    },
    {
      imageSrc: 'precipitation.svg',
      title: 'Precipitation',
      value: '',
      unit: 'mm',
    },
    { imageSrc: 'humidity.png', title: 'Humidity', value: '', unit: '%' },
    { imageSrc: 'visibility.webp', title: 'Visibility', value: '', unit: 'Km' },
    { imageSrc: 'uv.jpg', title: 'UV Index', value: '', unit: '' },
  ];

  constructor() {}

  ngOnInit(): void {
    this.data[0].value =
      this.weatherData.data.current_condition[0].windspeedKmph;
    this.data[1].value =
      this.weatherData.data.current_condition[0].winddir16Point;
    this.data[2].value = this.weatherData.data.current_condition[0].precipMM;
    this.data[3].value = this.weatherData.data.current_condition[0].humidity;
    this.data[4].value = this.weatherData.data.current_condition[0].visibility;
    this.data[5].value = this.weatherData.data.current_condition[0].uvIndex;
    // console.log(this.data);
  }
}

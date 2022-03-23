import { Component, Input, OnInit } from '@angular/core';
import { CitiesService } from 'src/app/services/cities.service';

@Component({
  selector: 'app-cities',
  templateUrl: './cities.component.html',
  styleUrls: ['./cities.component.css'],
})
export class CitiesComponent implements OnInit {
  @Input() country: string = '';
  cities: any;
  loaded: boolean = false;
  error: boolean = false;

  parseCity(city: string): string {
    const parsed = city
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .split(' ')
      .join('+');
    return parsed;
  }

  constructor(private citiesServ: CitiesService) {}

  ngOnInit(): void {
    this.citiesServ
      .getCities(
        this.country.toLowerCase() === 'united states of america'
          ? 'united states'
          : this.country.toLowerCase()
      )
      .subscribe({
        next: (cities: any) => {
          this.error = cities.error;
          this.cities = cities.data;
          this.cities.sort();
          this.loaded = true;
          // console.log(this.cities);
        },
        error: () => {
          this.error = true;
          this.loaded = true;
        },
      });
  }
}

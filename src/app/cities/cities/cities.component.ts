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

  constructor(private citiesServ: CitiesService) {}

  ngOnInit(): void {
    this.citiesServ
      .getCities(this.country.toLowerCase())
      .subscribe((cities: any) => {
        this.cities = cities.data;
        this.cities.sort();
        this.loaded = true;
        // console.log(this.cities);
      });
  }
}

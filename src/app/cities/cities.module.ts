import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CitiesComponent } from './cities/cities.component';

@NgModule({
  declarations: [CitiesComponent],
  imports: [CommonModule],
  exports: [CitiesComponent],
})
export class CitiesModule {}

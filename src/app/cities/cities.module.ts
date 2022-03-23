import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CitiesComponent } from './cities/cities.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [CitiesComponent],
  imports: [CommonModule, RouterModule],
  exports: [CitiesComponent],
})
export class CitiesModule {}

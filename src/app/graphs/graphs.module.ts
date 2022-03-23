import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorldMapComponent } from './world-map/world-map.component';
import { ForecastComponent } from './forecast/forecast.component';

@NgModule({
  declarations: [WorldMapComponent, ForecastComponent],
  imports: [CommonModule],
  exports: [WorldMapComponent, ForecastComponent],
})
export class GraphsModule {}

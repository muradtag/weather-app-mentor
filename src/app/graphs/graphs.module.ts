import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorldMapComponent } from './world-map/world-map.component';
import { ForecastComponent } from './forecast/forecast.component';
import { MonthlyForecastComponent } from './monthly-forecast/monthly-forecast.component';

@NgModule({
  declarations: [
    WorldMapComponent,
    ForecastComponent,
    MonthlyForecastComponent,
  ],
  imports: [CommonModule],
  exports: [WorldMapComponent, ForecastComponent, MonthlyForecastComponent],
})
export class GraphsModule {}

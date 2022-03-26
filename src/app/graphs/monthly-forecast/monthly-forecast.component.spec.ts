import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyForecastComponent } from './monthly-forecast.component';

describe('MonthlyForecastComponent', () => {
  let component: MonthlyForecastComponent;
  let fixture: ComponentFixture<MonthlyForecastComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonthlyForecastComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthlyForecastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

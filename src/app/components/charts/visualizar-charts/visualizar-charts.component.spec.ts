import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizarChartsComponent } from './visualizar-charts.component';

describe('VisualizarChartsComponent', () => {
  let component: VisualizarChartsComponent;
  let fixture: ComponentFixture<VisualizarChartsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VisualizarChartsComponent]
    });
    fixture = TestBed.createComponent(VisualizarChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

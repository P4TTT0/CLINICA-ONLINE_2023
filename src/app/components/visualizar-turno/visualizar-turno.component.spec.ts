import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizarTurnoComponent } from './visualizar-turno.component';

describe('VisualizarTurnoComponent', () => {
  let component: VisualizarTurnoComponent;
  let fixture: ComponentFixture<VisualizarTurnoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VisualizarTurnoComponent]
    });
    fixture = TestBed.createComponent(VisualizarTurnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

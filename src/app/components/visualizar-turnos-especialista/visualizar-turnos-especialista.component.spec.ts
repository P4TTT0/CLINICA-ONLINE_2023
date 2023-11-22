import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizarTurnosEspecialistaComponent } from './visualizar-turnos-especialista.component';

describe('VisualizarTurnosEspecialistaComponent', () => {
  let component: VisualizarTurnosEspecialistaComponent;
  let fixture: ComponentFixture<VisualizarTurnosEspecialistaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VisualizarTurnosEspecialistaComponent]
    });
    fixture = TestBed.createComponent(VisualizarTurnosEspecialistaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

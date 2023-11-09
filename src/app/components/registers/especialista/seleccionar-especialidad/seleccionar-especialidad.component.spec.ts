import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeleccionarEspecialidadComponent } from './seleccionar-especialidad.component';

describe('SeleccionarEspecialidadComponent', () => {
  let component: SeleccionarEspecialidadComponent;
  let fixture: ComponentFixture<SeleccionarEspecialidadComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SeleccionarEspecialidadComponent]
    });
    fixture = TestBed.createComponent(SeleccionarEspecialidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

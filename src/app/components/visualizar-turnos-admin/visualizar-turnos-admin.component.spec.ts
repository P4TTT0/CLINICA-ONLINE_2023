import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizarTurnosAdminComponent } from './visualizar-turnos-admin.component';

describe('VisualizarTurnosAdminComponent', () => {
  let component: VisualizarTurnosAdminComponent;
  let fixture: ComponentFixture<VisualizarTurnosAdminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VisualizarTurnosAdminComponent]
    });
    fixture = TestBed.createComponent(VisualizarTurnosAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

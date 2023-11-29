import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TurnosDiasComponent } from './turnos-dias.component';

describe('TurnosDiasComponent', () => {
  let component: TurnosDiasComponent;
  let fixture: ComponentFixture<TurnosDiasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TurnosDiasComponent]
    });
    fixture = TestBed.createComponent(TurnosDiasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

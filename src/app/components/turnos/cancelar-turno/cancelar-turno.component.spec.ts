import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelarTurnoComponent } from './cancelar-turno.component';

describe('CancelarTurnoComponent', () => {
  let component: CancelarTurnoComponent;
  let fixture: ComponentFixture<CancelarTurnoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CancelarTurnoComponent]
    });
    fixture = TestBed.createComponent(CancelarTurnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

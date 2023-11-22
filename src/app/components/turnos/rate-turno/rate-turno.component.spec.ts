import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RateTurnoComponent } from './rate-turno.component';

describe('RateTurnoComponent', () => {
  let component: RateTurnoComponent;
  let fixture: ComponentFixture<RateTurnoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RateTurnoComponent]
    });
    fixture = TestBed.createComponent(RateTurnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

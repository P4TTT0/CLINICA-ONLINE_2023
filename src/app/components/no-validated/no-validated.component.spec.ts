import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoValidatedComponent } from './no-validated.component';

describe('NoValidatedComponent', () => {
  let component: NoValidatedComponent;
  let fixture: ComponentFixture<NoValidatedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NoValidatedComponent]
    });
    fixture = TestBed.createComponent(NoValidatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUserValidationComponent } from './admin-user-validation.component';

describe('AdminUserValidationComponent', () => {
  let component: AdminUserValidationComponent;
  let fixture: ComponentFixture<AdminUserValidationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminUserValidationComponent]
    });
    fixture = TestBed.createComponent(AdminUserValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

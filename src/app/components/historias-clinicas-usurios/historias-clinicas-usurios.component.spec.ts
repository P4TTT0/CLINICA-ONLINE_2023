import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoriasClinicasUsuriosComponent } from './historias-clinicas-usurios.component';

describe('HistoriasClinicasUsuriosComponent', () => {
  let component: HistoriasClinicasUsuriosComponent;
  let fixture: ComponentFixture<HistoriasClinicasUsuriosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HistoriasClinicasUsuriosComponent]
    });
    fixture = TestBed.createComponent(HistoriasClinicasUsuriosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

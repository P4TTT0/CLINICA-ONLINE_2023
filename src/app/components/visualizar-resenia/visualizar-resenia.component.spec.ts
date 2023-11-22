import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizarReseniaComponent } from './visualizar-resenia.component';

describe('VisualizarReseniaComponent', () => {
  let component: VisualizarReseniaComponent;
  let fixture: ComponentFixture<VisualizarReseniaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VisualizarReseniaComponent]
    });
    fixture = TestBed.createComponent(VisualizarReseniaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

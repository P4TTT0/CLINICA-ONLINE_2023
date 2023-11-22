import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-visualizar-resenia',
  templateUrl: './visualizar-resenia.component.html',
  styleUrls: ['./visualizar-resenia.component.css']
})
export class VisualizarReseniaComponent {

  @Input() turno : any;
  @Output() close = new EventEmitter<boolean>();

  constructor() {}

  public onDismiss()
  {
    this.close.emit();
  }
}

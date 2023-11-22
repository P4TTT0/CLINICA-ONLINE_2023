import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-rechazar',
  templateUrl: './rechazar.component.html',
  styleUrls: ['./rechazar.component.css']
})
export class RechazarComponent {

  @Input() turno : any;
  @Output() close = new EventEmitter<boolean>();
  public text! : string;

  constructor(private data : DataService) {}

  public async onCancelClick()
  {
    let turnoFecha = 
    {
      day: this.turno.Dia,
      monthText: this.turno.Mes,
      year: this.turno['Año']
    }
    let idTurno = await this.data.getTurnoIdByDateTime(turnoFecha, this.turno.Horario) || '';
    this.data.updateEstadoTurno(idTurno, this.text, 'rechazado');
    this.close.emit();
  }

  public onDismiss()
  {
    this.close.emit();
  }

}

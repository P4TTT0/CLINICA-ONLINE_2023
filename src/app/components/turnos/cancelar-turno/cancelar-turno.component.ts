import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-cancelar-turno',
  templateUrl: './cancelar-turno.component.html',
  styleUrls: ['./cancelar-turno.component.css']
})
export class CancelarTurnoComponent {

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
    this.data.cancelTurno(idTurno, this.text);
    this.close.emit(true);
  }

  public onDismiss()
  {
    this.close.emit(false);
  }
}

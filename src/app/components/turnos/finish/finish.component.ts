import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-finish',
  templateUrl: './finish.component.html',
  styleUrls: ['./finish.component.css']
})
export class FinishComponent {

  @Input() turno : any;
  @Output() close = new EventEmitter<boolean>();
  public text! : string;

  constructor(private data : DataService) {}

  public async onFinishClick()
  {    
    let turnoFecha = 
    {
      day: this.turno.Dia,
      monthText: this.turno.Mes,
      year: this.turno['Año']
    }
    let idTurno = await this.data.getTurnoIdByDateTime(turnoFecha, this.turno.Horario) || '';
    this.data.updateEstadoTurno(idTurno, this.text, 'finalizado');
    this.close.emit();
  }

  public onDismiss()
  {
    this.close.emit();
  }
}

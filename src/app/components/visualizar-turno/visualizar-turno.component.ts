import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-visualizar-turno',
  templateUrl: './visualizar-turno.component.html',
  styleUrls: ['./visualizar-turno.component.css']
})
export class VisualizarTurnoComponent {
  public especialidades : any;
  public especialistas : any;

  public especialistaSeleccionado : any;
  public especialidadSeleccionada : any;

  public turnos : any;

  public turnosFiltrados : any;
  public viewCancel : boolean = false;

  public fechaTurno! : string

  constructor(private data : DataService, private auth : AuthService) {}

  async ngOnInit()
  {
    this.especialidades = await this.data.GetEspecialidades();
    await this.auth.reLogin();
    console.log(this.auth.userName);
    this.turnos = await this.data.getTurnosByUserName(this.auth.userName);
    this.turnosFiltrados = this.turnos;
    console.log(this.turnos);
  }
  
  public async onEspecialidadChange(especialidad : any)
  {
    this.especialistas = await this.data.GetEspecialistas(especialidad);
    this.turnosFiltrados = this.turnos.filter((turno: { Especialidad: any; }) => turno.Especialidad == especialidad);
  }

  public async onEspecialistaChange(especialista : any)
  {
    this.turnosFiltrados = this.turnos.filter((turno: { Especialista: any; Especialidad : any;}) => turno.Especialista == especialista && turno.Especialidad == this.especialidadSeleccionada);
  }

  public onCancelClick(turno : any)
  {
    this.viewCancel = true;
    this.fechaTurno = turno;
  }

  public async onCancelTurnoDismiss(cancel : boolean)
  {
    this.viewCancel = false;

    if(cancel)
    {
      this.turnos = await this.data.getTurnosByUserName(this.auth.userName);
      this.turnosFiltrados = this.turnos;
      if(this.especialidadSeleccionada != null)
      {
        this.turnosFiltrados = this.turnos.filter((turno: { Especialidad: any; }) => turno.Especialidad == this.especialidadSeleccionada);
  
        if(this.especialistaSeleccionado != null)
        {
          this.turnosFiltrados = this.turnos.filter((turno: { Especialista: any; Especialidad : any;}) => turno.Especialista == this.especialistaSeleccionado && turno.Especialidad == this.especialidadSeleccionada);
        }
      }
    }
  }
}

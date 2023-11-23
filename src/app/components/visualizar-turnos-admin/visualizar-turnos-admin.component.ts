import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-visualizar-turnos-admin',
  templateUrl: './visualizar-turnos-admin.component.html',
  styleUrls: ['./visualizar-turnos-admin.component.css']
})
export class VisualizarTurnosAdminComponent {
  public especialidades : any;
  public especialistas : any;

  public especialistaSeleccionado : any;
  public especialidadSeleccionada : any;
  public ratingSeleccionado : number = 0;

  public turnos : any;

  public turnosFiltrados : any;
  public viewCancel : boolean = false;
  public viewRate : boolean = false;
  public viewEncuesta : boolean = false;

  public fechaTurno! : string

  constructor(private data : DataService, private auth : AuthService) {}

  async ngOnInit()
  {
    this.especialidades = await this.data.GetEspecialidades();
    this.turnos = this.data.getTurnos().subscribe((x) =>
    {
      this.turnos = x;
      this.turnosFiltrados = this.turnos;
      if(this.especialidadSeleccionada != null)
      {
        this.turnosFiltrados = this.turnos.filter((turno: { Especialidad: any; }) => turno.Especialidad == this.especialidadSeleccionada);
  
        if(this.especialidadSeleccionada != null)
        {
          this.turnosFiltrados = this.turnos.filter((turno: { Especialista: any; Especialidad : any;}) => turno.Especialidad == this.especialidadSeleccionada && turno.Especialista == this.especialistaSeleccionado);
        }
      }
    });
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

  public onLimpiarFiltrosClick()
  {
    this.turnosFiltrados = this.turnos;
    this.especialidadSeleccionada = null;
    this.especialidadSeleccionada = null;
    this.especialidades = null;
  }

  public onCancelClick(turno : any)
  {
    this.viewCancel = true;
    this.viewRate = false;
    this.viewEncuesta = false;
    this.fechaTurno = turno;
  }

  public onRateTurnoClick(turno : any)
  {
    this.viewRate = true;
    this.viewEncuesta = false;
    this.viewCancel = false;
    this.fechaTurno = turno;
  }

  public onEncuestaClick(turno : any)
  {
    this.viewEncuesta = true;
    this.viewCancel = false;
    this.viewRate = false;
    this.fechaTurno = turno;
  }

  public async onCancelTurnoDismiss(cancel : boolean)
  {
    this.viewCancel = false;
  }

  public onRateTurnoDismiss()
  {
    this.viewRate = false;
  }

  public onEncuestaTurnoDismiss()
  {
    this.viewEncuesta = false;
  }
}

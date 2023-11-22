import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-visualizar-turnos-especialista',
  templateUrl: './visualizar-turnos-especialista.component.html',
  styleUrls: ['./visualizar-turnos-especialista.component.css']
})
export class VisualizarTurnosEspecialistaComponent implements OnInit{

  public especialidades : any;
  public pacientes : any;
  public turnos : any;
  public turnosFiltrados : any;

  public especialidadSeleccionada : any;
  public pacienteSeleccionado : any;
  public turnoSeleccionado : any;

  public viewCancel : boolean = false;
  public viewRechazar : boolean = false;
  public viewFinish : boolean = false;
  public viewMessage : boolean = false;

  constructor(private data : DataService, private auth : AuthService) {}

  async ngOnInit()
  {
    this.turnos = this.data.getTurnosByEspecialistaUserName('JoseFE').subscribe((x) =>
    {
      this.turnos = x;
      this.turnosFiltrados = this.turnos;
      if(this.especialidadSeleccionada != null)
      {
        this.turnosFiltrados = this.turnos.filter((turno: { Especialidad: any; }) => turno.Especialidad == this.especialidadSeleccionada);
  
        if(this.pacienteSeleccionado != null)
        {
          this.turnosFiltrados = this.turnos.filter((turno: { Paciente: any; Especialidad : any;}) => turno.Especialidad == this.especialidadSeleccionada && turno.Paciente == this.pacienteSeleccionado);
        }
      }
    });
    this.especialidades = await this.data.GetEspecialidadesByEspecialistaUserName('JoseFE');
    console.log(this.especialidades);
  }

  public onLimpiarFiltrosClick()
  {
    this.turnosFiltrados = this.turnos;
    this.especialidadSeleccionada = null;
    this.pacienteSeleccionado = null;
    this.pacientes = null;
  }

  public async onEspecialidadChange(especialidad : any)
  {
    this.pacientes = await this.data.GetPacientes('JoseFE', especialidad);
    console.log(this.pacientes);
    this.turnosFiltrados = this.turnos.filter((turno: { Especialidad: any; }) => turno.Especialidad == especialidad);
  }

  public async onPacienteChange(paciente : any)
  {
    this.turnosFiltrados = this.turnos.filter((turno: { Paciente: any; }) => turno.Paciente == paciente);
  }

  public onCancelClick(turno : any)
  {
    this.turnoSeleccionado = turno;
    this.viewCancel = true;
    this.viewRechazar = false;
    this.viewMessage = false;
    this.viewFinish = false;
  }

  public async onAcceptTurnoClick(turno : any)
  {
    let turnoFecha = 
    {
      day: turno.Dia,
      monthText: turno.Mes,
      year: turno['Año']
    }
    let idTurno = await this.data.getTurnoIdByDateTime(turnoFecha, turno.Horario) || '';
    console.log(idTurno);
    console.log(turnoFecha, turno.Horario);
    this.data.updateEstadoTurno(idTurno, "", 'esperando');
  }

  public async onRechazarTurnoClick(turno : any)
  {
    this.turnoSeleccionado = turno;
    this.viewRechazar = true;
    this.viewCancel = false;
    this.viewMessage = false;
    this.viewFinish = false;
  }

  public async onFinishTurnoClick(turno : any)
  {
    this.turnoSeleccionado = turno;
    this.viewFinish = true;
    this.viewRechazar = false;
    this.viewCancel = false;
    this.viewMessage = false;
  }

  public async onViewMessageClick(turno : any)
  {
    this.turnoSeleccionado = turno;
    this.viewMessage = true;
    this.viewFinish = false;
    this.viewRechazar = false;
    this.viewCancel = false;
  }

  public async onCancelTurnoDismiss()
  {
    this.viewCancel = false;
  }

  public async onRechazarTurnoDismiss()
  {
    this.viewRechazar = false;
  }

  public async onFinishTurnosDismiss()
  {
    this.viewFinish = false;
  }

  public async onReseniaTurnoDismiss()
  {
    this.viewMessage = false;
  }
}

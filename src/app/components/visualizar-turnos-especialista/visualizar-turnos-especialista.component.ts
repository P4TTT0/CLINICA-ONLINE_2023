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

  constructor(private data : DataService, private auth : AuthService) {}

  async ngOnInit()
  {
    this.turnos = await this.data.getTurnosByEspecialistaUserName('Josefa');
    this.turnosFiltrados = this.turnos;
    this.especialidades = await this.data.GetEspecialidadesByEspecialistaUserName('JoseFE');
    console.log(this.especialidades);
  }

  public async onEspecialidadChange(especialidad : any)
  {
    this.pacientes = await this.data.GetPacientes('Josefa', especialidad);
    console.log(this.pacientes);
    this.turnosFiltrados = this.turnos.filter((turno: { Especialidad: any; }) => turno.Especialidad == especialidad);
  }
}

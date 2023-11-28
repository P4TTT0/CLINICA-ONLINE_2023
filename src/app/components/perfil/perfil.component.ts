import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { FilesService } from 'src/app/services/files.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit{
  public user : any;
  public turnos : any;
  public isMananaSelected: boolean = false;
  public isTardeSelected: boolean = false;
  public especialidades : any;

  constructor(private data : DataService, public auth : AuthService, private file : FilesService) {}

  async ngOnInit() {
    await this.auth.reLogin();
    this.user = await this.data.getUserByUserName(this.auth.userName);
    this.especialidades = await this.data.GetEspecialidadesByPacienteUserName(this.auth.userName);
    this.isMananaSelected = this.user.HorarioMañana;
    this.isTardeSelected = this.user.HorarioTarde;
  }

  public onDownloadHistoriaClick(especialidad : string)
  {
    let turnos;
    this.data.getTurnosByUserUserName(this.auth.userName).subscribe((x) =>
      {
        turnos = x;
        turnos = turnos.filter((turno : {HistoriaClinica : any, Especialidad : any}) => turno.HistoriaClinica != null && turno.Especialidad == especialidad);
        let historiasArray = turnos.map((turno : any) =>
        {
          let datosHistoriaClinica: { [clave: string]: any } = {};
          for (let clave in turno.HistoriaClinica) {
            datosHistoriaClinica[clave] = turno.HistoriaClinica[clave];
          }

          return {
            Paciente: turno.Paciente,
            Especialista: turno.Especialista,
            Especialidad: turno.Especialidad,
            Dia: turno.Dia,
            Mes: turno.Mes,
            ['Año']: turno.Año,
            ...datosHistoriaClinica,
          }
        });
        this.file.downloadPDF(historiasArray);
      });
  }

  public async toggleSelection(time: string) 
  {
    if(time == 'tarde')
    {
      this.isTardeSelected = !this.isTardeSelected;
    }
    else
    {
      this.isMananaSelected = !this.isMananaSelected;
    }

    let hours = {
      HorarioMañana: this.isMananaSelected,
      HorarioTarde: this.isTardeSelected,
    }
    let userUID = await this.auth.getUserUid() || '';
    this.data.UpdateHoursEspecialist(userUID, hours);
  }

}

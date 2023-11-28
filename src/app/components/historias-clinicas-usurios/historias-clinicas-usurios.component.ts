import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { UserHistoriaClinicaComponent } from '../modals/user-historia-clinica/user-historia-clinica.component';
import { FilesService } from 'src/app/services/files.service';

@Component({
  selector: 'app-historias-clinicas-usurios',
  templateUrl: './historias-clinicas-usurios.component.html',
  styleUrls: ['./historias-clinicas-usurios.component.css']
})
export class HistoriasClinicasUsuriosComponent implements OnInit {

  public pacientes : any;

  public pacienteSeleccionado : any;

  modalRef: MdbModalRef<UserHistoriaClinicaComponent> | null = null;

  constructor(private data : DataService, private auth : AuthService, private modalService: MdbModalService, private file : FilesService) {}

  async ngOnInit() {
    await this.auth.reLogin();
    if(this.auth.rol == "Especialista")
      this.pacientes = await this.data.GetPacientesByEspecialistaUserName(this.auth.userName);
    else
      this.pacientes = await this.data.GetUsuarios();
    console.log(this.pacientes);
  }

  public onCardClick(pacienteInfo : any)
  {
    if(this.auth.rol == "Especialista")
    {
      this.modalRef = this.modalService.open(UserHistoriaClinicaComponent, {
        data: { paciente: pacienteInfo },
        modalClass: 'modal-xl'
      });
    }
    else
    {
      let turnos : any;
      this.data.getTurnosByUserUserName(pacienteInfo.UserName).subscribe((x) =>
      {
        turnos = x;
        turnos = turnos.filter((turno : {HistoriaClinica : any}) => turno.HistoriaClinica != null);
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
        })
        this.file.downloadArrayToXLSX(historiasArray);
      });
    }
  }
}

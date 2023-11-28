import { Component, OnInit } from '@angular/core';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-user-historia-clinica',
  templateUrl: './user-historia-clinica.component.html',
  styleUrls: ['./user-historia-clinica.component.css']
})
export class UserHistoriaClinicaComponent implements OnInit {

  public paciente : any;
  public turnos : any;
  public ultimosTurnos : any;

  constructor(public modalRef: MdbModalRef<UserHistoriaClinicaComponent>, private data : DataService, private auth : AuthService) {}

  ngOnInit() {
    this.data.getTurnosByUserUserName(this.paciente.UserName).subscribe((x) =>
    {
      this.turnos = x;
      this.turnos = this.turnos.filter((turno : {HistoriaClinica : any}) => turno.HistoriaClinica != null);
      this.ultimosTurnos = this.turnos.filter((turno : {Estad : string}) => turno.Estad == 'finalizado');
    });
  }
}

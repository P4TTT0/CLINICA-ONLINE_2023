import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { UserHistoriaClinicaComponent } from '../modals/user-historia-clinica/user-historia-clinica.component';

@Component({
  selector: 'app-historias-clinicas-usurios',
  templateUrl: './historias-clinicas-usurios.component.html',
  styleUrls: ['./historias-clinicas-usurios.component.css']
})
export class HistoriasClinicasUsuriosComponent implements OnInit {

  public pacientes : any;

  public pacienteSeleccionado : any;

  modalRef: MdbModalRef<UserHistoriaClinicaComponent> | null = null;

  constructor(private data : DataService, private auth : AuthService, private modalService: MdbModalService) {}

  async ngOnInit() {
    await this.auth.reLogin();
    this.pacientes = await this.data.GetPacientesByEspecialistaUserName(this.auth.userName);
    console.log(this.pacientes);
  }

  public onPacienteChange(paciente : any)
  {

  }

  public onCardClick(pacienteInfo : any)
  {
    this.modalRef = this.modalService.open(UserHistoriaClinicaComponent, {
      data: { paciente: pacienteInfo },
    });
  }
}

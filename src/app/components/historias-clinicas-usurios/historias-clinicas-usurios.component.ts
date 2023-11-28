import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-historias-clinicas-usurios',
  templateUrl: './historias-clinicas-usurios.component.html',
  styleUrls: ['./historias-clinicas-usurios.component.css']
})
export class HistoriasClinicasUsuriosComponent implements OnInit {

  public pacientes : any;

  public pacienteSeleccionado : any;

  constructor(private data : DataService, private auth : AuthService) {}

  async ngOnInit() {
    await this.auth.reLogin();
    this.pacientes = await this.data.GetPacientesByEspecialistaUserName(this.auth.userName);
    console.log(this.pacientes);
  }

  public onPacienteChange(paciente : any)
  {

  }
}

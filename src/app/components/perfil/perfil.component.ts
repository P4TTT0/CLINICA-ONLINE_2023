import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';

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

  constructor(private data : DataService, public auth : AuthService) {}

  async ngOnInit() {
    await this.auth.reLogin();
    this.user = await this.data.getUserByUserName(this.auth.userName);
    this.data.getTurnosByUserUserName(this.auth.userName).subscribe((x) =>
    {
      this.turnos = x;
      this.turnos = this.turnos.filter((turno : {HistoriaClinica : any}) => turno.HistoriaClinica != null);
    });
    console.log(this.turnos);
    this.isMananaSelected = this.user.HorarioMañana;
    this.isTardeSelected = this.user.HorarioTarde;
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

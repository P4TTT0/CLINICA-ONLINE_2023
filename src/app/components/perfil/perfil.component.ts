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
  public isMananaSelected: boolean = false;
  public isTardeSelected: boolean = false;
  public isNocheSelected: boolean = false;

  constructor(private data : DataService, public auth : AuthService) {}

  async ngOnInit() {
    await this.auth.reLogin();
    this.user = await this.data.getUserByUserName(this.auth.userName);
    this.isMananaSelected = this.user.HorarioMañana;
    this.isTardeSelected = this.user.HorarioTarde;
    this.isNocheSelected = this.user.HorarioNoche;
  }

  

  public async toggleSelection(time: string) 
  {
    switch (time) 
    {
      case 'tarde':
        this.isTardeSelected = !this.isTardeSelected;
        break;
      case 'noche':
        this.isNocheSelected = !this.isNocheSelected;
        break;
      default:
        this.isMananaSelected = !this.isMananaSelected;
        break;
    }

    let hours = {
      HorarioMañana: this.isMananaSelected,
      HorarioTarde: this.isTardeSelected,
      HorarioNoche: this.isNocheSelected,
    }
    let userUID = await this.auth.getUserUid() || '';
    this.data.UpdateHoursEspecialist(userUID, hours);
  }

}

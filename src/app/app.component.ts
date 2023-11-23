import { Component, OnInit } from '@angular/core';
import { LoadingService } from './services/loading.service';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(public loading : LoadingService, public auth : AuthService, private router : Router) {}
  
  async ngOnInit(){
    await this.auth.reLogin();
  }

  public async OnLogOutClick()
  {
    this.loading.show();
    setTimeout(async () => {
      this.loading.hide();
    }, 1000);
    this.auth.logOut();
    this.router.navigateByUrl('home');
  }

  public onProfileClick()
  {
    this.router.navigateByUrl('profile');
  }

  public onTurnosClick()
  {
    switch(this.auth.rol)
    {
      case 'Especialista':
        this.router.navigateByUrl('ver-turnos-especialista');
        break;
      case 'Admin':
        this.router.navigateByUrl('ver-turnos-admin');
        break;
      default:
        this.router.navigateByUrl('ver-turnos');
        break;
    }
  }
}

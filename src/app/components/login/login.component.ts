import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { LoadingService } from 'src/app/services/loading.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {
  public form : FormGroup;

  constructor(private router: Router, private formBuilder : FormBuilder, private auth : AuthService, private data : DataService, private loading : LoadingService) {
    this.form = this.formBuilder.group({
      email: ['',[ Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  public async OnLoginClick()
  {
    this.loading.show();
    if(this.form.controls['email'].valid && this.form.controls['password'].valid)
    {
      try{
        const credential = await this.auth.logIn(this.form.controls['email'].value, this.form.controls['password'].value);
        let userRol = await this.data.getUserRolByEmailOrUserName(this.form.controls['email'].value);
        if(userRol != "Admin")
        {
          if(credential?.user?.emailVerified == false)
          {
            Swal.fire(
              '¡ERROR!',
              '¡Usted no ha verificado su MAIL!',
              'error'
            );
            this.auth.logOut();
            this.loading.hide();
            return;
          }
          if(userRol == "Especialista")
          {
            this.auth.logueado = false;
          }
        }
        const userUid = credential?.user?.uid || '';
        const userName = await this.data.getUserNameByUID(userUid);
        Swal.fire(
          '¡EXITO!',
          '¡Inicio de sesion exitoso!',
          'success'
        );
        this.router.navigateByUrl('/home');
        console.log(this.auth.userName);
      }
      catch(error)
      {
        Swal.fire(
          '¡ERROR!',
          '¡Credenciales incorrectas!',
          'error'
        );
      }
    }
    else
    {
      Swal.fire(
        '¡ERROR!',
        '¡Errores en los campos!',
        'error'
      );
    }
    this.loading.hide();
  }

  public onFillFields(user : string, password : string)
  {
    this.form.controls['email'].setValue(user);
    this.form.controls['password'].setValue(password);
  }
}

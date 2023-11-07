import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { LoadingService } from 'src/app/services/loading.service';
import Swal from 'sweetalert2';
Swal

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent {
  public form : FormGroup;
  public tipo : string = "Usuario";

  constructor(private router: Router, private formBuilder : FormBuilder, private auth : AuthService, private data : DataService, private loading : LoadingService) {
    this.form = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      edad: ['', [Validators.required, Validators.min(18), Validators.max(100)]],
      dni: ['', [Validators.required, Validators.pattern('^[0-9]{1,9}$')]],
      obraSocial: ['', [Validators.required]],
      email: ['',
        [
          Validators.required,
          Validators.email
        ]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      user: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(15)]],
      Image
    });
  }

  async onRegisterClick()
  {
    this.loading.show();
    try
    {
      let userData = 
      {
        Email : this.form.controls['email'].value,
        JoinDate : undefined,
        Rol : 'Usuario',
        UserName : this.form.controls['user'].value,
        Validated : null,
        Nombre : this.form.controls['nombre'].value,
        Apellido : this.form.controls['apellido'].value,
      }
      const register = await this.auth.register(userData, this.form.controls['password'].value);
      if(!register)
      {
        Swal.fire(
          '¡ERROR!',
          '¡Nombre de usuario en uso!',
          'error'
        );
        this.loading.hide();
        return;
      }
    }
    catch(error)
    {
      Swal.fire(
        '¡ERROR!',
        '¡EMAIL en uso!',
        'error'
      );
      this.loading.hide();
      return;
    }

    let userUID = await this.auth.getUserUid() || '';

    if(this.tipo == 'Usuario')
    {
      this.data.SaveDNI(this.form.controls['dni'].value, userUID);
    }
    else
    {
      if(this.tipo == 'Especialista')
      {
        this.data.SaveEspecialidad(this.form.controls['especialidad'].value, userUID);
      }
    }
    this.loading.hide();
  }
}

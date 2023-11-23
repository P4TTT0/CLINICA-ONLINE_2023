import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { LoadingService } from 'src/app/services/loading.service';
import Swal from 'sweetalert2';
Swal

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  public form : FormGroup;
  public tipo! : string;
  public registrado : boolean = false;

  constructor(private router: Router, private formBuilder : FormBuilder, public auth : AuthService, private data : DataService, private loading : LoadingService) {
    this.form = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      edad: ['', [Validators.required, Validators.min(18), Validators.max(100)]],
      especialidad: ['Medico', Validators.required],
      dni: ['', [Validators.required, Validators.pattern('^[0-9]{1,9}$')]],
      email: ['',
        [
          Validators.required,
          Validators.email
        ]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      user: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(15)]],

    });
  }

  async onRegisterClick()
  {
    console.log(this.form.controls);
    this.loading.show();
    if(this.verificarEspecialidad())
    {
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

      this.registrado = true;
    }
    else
    {
      Swal.fire(
        '¡ERROR!',
        '¡No se pudo realizar el registro!',
        'error'
      );
    }
    this.loading.hide();
  }

  private verificarEspecialidad()
  {
    if(!this.form.controls['nombre'].valid || 
      !this.form.controls['apellido'].valid || 
      !this.form.controls['edad'].valid || 
      !this.form.controls['email'].valid || 
      !this.form.controls['password'].valid || 
      !this.form.controls['user'].valid)
    {
      return false;
    }

    if(this.tipo != 'Admin')
    {
      if(this.tipo == 'Usuario' && !this.form.controls['dni'].valid)
      {
        return false;
      }
      if(!this.form.controls['especialidad'].valid && !this.form.controls['dni'].valid)
      {
        return false;
      }
    }

    return true;
  }

  public recibirRegistro(registrado : boolean)
  {
    this.registrado = registrado;
  }

  public onOptionClick(option : string)
  {
    this.tipo = option;
  }
}

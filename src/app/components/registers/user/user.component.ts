import { Component, EventEmitter, Output } from '@angular/core';
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
  public touched : boolean = false;
  @Output() registrado = new EventEmitter<boolean>();

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
      ImageBase64: ['', [Validators.required]],
      ImageBase64Two: ['', [Validators.required]]
    });
  }

  async onRegisterClick()
  {
    this.touched = true;

    if(!this.form.valid)
    {
      Swal.fire(
        '¡ERROR!',
        '¡Errores en los campos!',
        'error'
      );
      return;
    }
    
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
        ObraSocial : this.form.controls['obraSocial'].value,
        Apellido : this.form.controls['apellido'].value,
        ImageBase64: this.form.controls['ImageBase64'].value,
        ImageBaseTwo64: this.form.controls['ImageBase64Two'].value,
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

    this.registrado.emit(true);

    this.loading.hide();
  }

  onImageSelected(event: any) 
  {
    const file = event.target.files[0];
    if (file) 
    {
      const reader = new FileReader();

      reader.onload = (e: any) => 
      {
        this.form.controls['ImageBase64'].setValue(e.target.result);
      };

      reader.readAsDataURL(file);
    }
  }

  onImageTwoSelected(event: any) 
  {
    const file = event.target.files[0];
    if (file) 
    {
      const reader = new FileReader();

      reader.onload = (e: any) => 
      {
        this.form.controls['ImageBase64Two'].setValue(e.target.result);
      };

      reader.readAsDataURL(file);
    }
  }

}

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { LoadingService } from 'src/app/services/loading.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  public form : FormGroup;
  public touched : boolean = false;

  constructor(private router: Router, private formBuilder : FormBuilder, private auth : AuthService, private data : DataService, private loading : LoadingService) {
    this.form = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      edad: ['', [Validators.required, Validators.min(18), Validators.max(100)]],
      dni: ['', [Validators.required, Validators.pattern('^[0-9]{1,9}$')]],
      email: ['',
        [
          Validators.required,
          Validators.email
        ]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      user: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(15)]],
      ImageBase64: ['', [Validators.required]],
    });
  }

  async onRegisterClick()
  {
    this.touched = true;
    this.loading.show();
    try
    {
      let userData = 
      {
        Email : this.form.controls['email'].value,
        JoinDate : undefined,
        Rol : 'Admin',
        UserName : this.form.controls['user'].value,
        Validated : null,
        Nombre : this.form.controls['nombre'].value,
        Apellido : this.form.controls['apellido'].value,
        ImageBase64: this.form.controls['ImageBase64'].value,
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
}

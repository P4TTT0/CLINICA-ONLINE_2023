import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { LoadingService } from 'src/app/services/loading.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-especialista',
  templateUrl: './especialista.component.html',
  styleUrls: ['./especialista.component.css']
})
export class EspecialistaComponent {
  public form : FormGroup;
  public touched : boolean = false;
  public siteKey : string = "6LdAdBkpAAAAAJ6liLDN4f1JpJ_-rd2EvBpEvCdu";
  
  @Output() registrado = new EventEmitter<boolean>();

  constructor(private router: Router, private formBuilder : FormBuilder, private auth : AuthService, private data : DataService, private loading : LoadingService) {
    this.form = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      edad: ['', [Validators.required, Validators.min(18), Validators.max(100)]],
      dni: ['', [Validators.required, Validators.pattern('^[0-9]{1,9}$')]],
      especialidad: ['Medico', [Validators.required]],
      recaptcha: ['', Validators.required],
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
          Rol : 'Especialista',
          UserName : this.form.controls['user'].value,
          Especialidad: this.form.controls['especialidad'].value,
          Validated : null,
          Nombre : this.form.controls['nombre'].value,
          Apellido : this.form.controls['apellido'].value,
          DNI: this.form.controls['dni'].value,
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

  public recibirEspecialidad(especialidad : string)
  {
    this.form.controls['especialidad'].setValue(especialidad);
  }

}

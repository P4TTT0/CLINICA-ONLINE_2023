import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-seleccionar-especialidad',
  templateUrl: './seleccionar-especialidad.component.html',
  styleUrls: ['./seleccionar-especialidad.component.css']
})
export class SeleccionarEspecialidadComponent 
{
  public especialidad : string = "Médico";
  public nuevaEspecialidad : string = "";
  public especialidades: string[] = ["Médico", "Kinesiólogo", "Odontólogo", "Pediatra"];
  public agregandoEspecialidad: boolean = false;
  @Output() especilidadSeleccionada = new EventEmitter<string>();

  constructor() {}

  mostrarInput() 
  {
    this.agregandoEspecialidad = true;
  }

  agregarEspecialidad() {
    if (this.nuevaEspecialidad.trim() != '' && this.especialidades.indexOf(this.nuevaEspecialidad) == -1) 
    {
      this.especialidades.push(this.nuevaEspecialidad);
      this.especialidad = this.nuevaEspecialidad;
      this.nuevaEspecialidad = '';
      this.agregandoEspecialidad = false; 
    }
  }

  cancelarAgregado() 
  {
    this.agregandoEspecialidad = false; 
    this.nuevaEspecialidad = ''; 
  }

  public enviarEspecialidad() {
    this.especilidadSeleccionada.emit(this.especialidad);
  }
}

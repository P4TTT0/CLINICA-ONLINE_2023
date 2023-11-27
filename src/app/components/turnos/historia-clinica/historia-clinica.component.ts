import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-historia-clinica',
  templateUrl: './historia-clinica.component.html',
  styleUrls: ['./historia-clinica.component.css']
})
export class HistoriaClinicaComponent {

  @Input() turno : any;
  @Output() close = new EventEmitter<boolean>();

  public altura! : number;
  public peso! : number;
  public temperatura! : number;
  public presion! : number

  campos: { clave: string; valor: string }[] = [];

  constructor (private data : DataService) {}

  public agregarCampo() {
    this.campos.push({ clave: '', valor: '' });
  }

  public onDismiss()
  {
    this.close.emit();
  }

  public async onSubirHistoriaClinica()
  {
    let historiaClinica : any = {
      Altura: this.altura,
      Peso: this.peso,
      Temperatura: this.temperatura,
      Presion: this.presion,
      Paciente: this.turno.Paciente,
      Dia: this.turno.Dia,
      Mes: this.turno.Mes,
      Año: this.turno.Año,
      Especialidad: this.turno.Especialidad,
      Especialista: this.turno.Especialista,
    }

    for (let i = 0; i < this.campos.length; i++) {
      const clave = (document.getElementById(`clave${i}`) as HTMLInputElement).value;
      const valor = (document.getElementById(`valor${i}`) as HTMLInputElement).value;

      if (clave && valor) {
        historiaClinica[clave] = valor;
      }
    }

    await this.data.SaveHistoriaClinicaByUserName(historiaClinica);
    
    this.close.emit();
  }
}

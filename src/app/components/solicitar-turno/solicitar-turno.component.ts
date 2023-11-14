import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { LoadingService } from 'src/app/services/loading.service';
import Swal from 'sweetalert2';
Swal

@Component({
  selector: 'app-solicitar-turno',
  templateUrl: './solicitar-turno.component.html',
  styleUrls: ['./solicitar-turno.component.css']
})
export class SolicitarTurnoComponent implements OnInit {
  
  public especialidades : any;
  public especialistas : any;
  public especialidadSeleccionada! : string;
  public especialistaSeleccionado! : any;
  public daysArray : any[] = [];
  public allTimes : any[] = [];
  public filteredTimes : any;
  public daySeleccionado! : any;
  public horaSeleccionada! : any;

  constructor(private data : DataService, private auth : AuthService, private loading : LoadingService, private router : Router) {}

  async ngOnInit() 
  {
    this.especialidades = await this.data.GetEspecialidades();
  }
  
  public async onEspecialidadChange()
  {
    this.especialistas = await this.data.GetEspecialistas(this.especialidadSeleccionada);
  }
  
  public async onEspecialistaChange()
  {
    this.daysArray = [];
    const today = new Date();
    let todayInfo =  await this.getDayInfo(today)
    this.daysArray.push(todayInfo);
    for (let i = 1; i <= 15; i++) {
      const nextDay = new Date();
      nextDay.setDate(today.getDate() + i);
      let dayInfo = await this.getDayInfo(nextDay)
      this.daysArray.push(dayInfo);
    }
  }
  
  public async onDayChange(day : any)
  {
    this.loading.show();
    this.horaSeleccionada = null;
    this.filteredTimes = await this.generateTimeArray(this.especialidadSeleccionada, this.especialistaSeleccionado, day.day, day.monthText, day.year);
    this.loading.hide();
  }

  public async getDayInfo(date : Date) 
  {
    const day = date.getDate();
    const month = date.getMonth() + 1; 
    const year = date.getFullYear();
  
    const monthNames = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    const monthName = monthNames[date.getMonth()]; 
  
    return {
      day: day,
      month: month,
      year: year,
      monthText: monthName,
      ocupado: false
    };
  }

  public onSolicitarTurnoClick()
  {
    try
    {
      let turno = {
        Paciente: this.auth.userName,
        Especialidad: this.especialidadSeleccionada,
        Especialista: this.especialistaSeleccionado.Nombre, 
        Año: this.daySeleccionado.year,
        Mes: this.daySeleccionado.monthText,
        Dia: this.daySeleccionado.day,
        Horario: this.horaSeleccionada,
        Estad: 'esperando',
      }
      this.data.SaveTurno(turno);
      Swal.fire(
        '¡EXITO!',
        '¡Turno cargado con exito!',
        'success'
      );
      this.router.navigateByUrl('home');
    }
    catch(error)
    {
      Swal.fire(
        '¡ERROR!',
        '¡No hemos podido cargar su turno, intente más tarde!',
        'error'
      );
    }
  }

  public async generateTimeArray(especialidad : string, especialista : any, day : any, month : any, year : any) {
    const times = [];
  
    for (let hour = 8; hour <= 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  
        const isAvailable =
          (especialista.HorarioMañana && hour >= 8 && hour <= 12) ||
          (especialista.HorarioTarde && ((hour === 12 && minute >= 30) || (hour > 12 && hour < 18) || (hour === 18 && minute <= 30))) ||
          (especialista.HorarioNoche && (hour >= 19 || (hour === 18 && minute >= 30)));
  
        if (isAvailable) {
          const isOccupied = await this.data.IsHourOcuppied(especialidad, especialista.Nombre, day, month, year, time);
          const timeObject = {
            time: time,
            checked: isOccupied,
          };
          times.push(timeObject);
        }
      }
    }
    return times;
  }
}

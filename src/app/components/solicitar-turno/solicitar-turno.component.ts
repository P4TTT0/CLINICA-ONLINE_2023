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
  
  public async onEspecialistaChange(especialista : any)
  {
    this.daysArray = [];
    let diasAGenerar = 15;
    for (let i = 0; i < diasAGenerar; i++) {
      const today = new Date();
      const nextDay = new Date();
      nextDay.setDate(today.getDate() + i);
      console.log(!(especialista.HorarioTarde && especialista.HorarioMañana == false && nextDay.getDay() == 6));
      if(nextDay.getDay() != 0 && !(especialista.HorarioTarde && especialista.HorarioMañana == false && nextDay.getDay() == 6))
      {
        let dayInfo = await this.getDayInfo(nextDay)
        this.daysArray.push(dayInfo);
      }
      else
      {
        diasAGenerar++;
      }
    }
  }
  
  public async onDayChange(day : any)
  {
    this.loading.show();
    this.horaSeleccionada = null;
    this.filteredTimes = await this.generateTimeArray(this.especialidadSeleccionada, this.especialistaSeleccionado, day);
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
      dayText: date.toDateString().split(' ')[0],
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
        Especialista: this.especialistaSeleccionado.UserName, 
        Año: this.daySeleccionado.year,
        Mes: this.daySeleccionado.monthText,
        Dia: this.daySeleccionado.day,
        Horario: this.horaSeleccionada,
        Estad: 'pendiente',
        FechaCompleta: new Date(this.daySeleccionado.year, this.daySeleccionado.month - 1, this.daySeleccionado.day),
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

  public async generateTimeArray(especialidad : string, especialista : any, date : any) {
    const times = [];
    
    for (let hour = 8; hour <= 19; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;

        let isAvailable : any;

        if(date.dayText == 'Sat')
        {
          isAvailable = (especialista.HorarioMañana && hour >= 8 && hour <= 13);
        }
        else
        {
          isAvailable =
            (especialista.HorarioMañana && hour >= 8 && hour <= 13) ||
            (especialista.HorarioTarde && ((hour > 13 && hour < 19) || (hour === 18 && minute <= 30)));
        }
  
        if (isAvailable) {
          const isOccupied = await this.data.IsHourOcuppied(especialidad, especialista.Nombre, date.day, date.monthText, date.year, time);
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

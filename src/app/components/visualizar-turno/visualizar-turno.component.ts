import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { NgbRatingConfig, NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-visualizar-turno',
  templateUrl: './visualizar-turno.component.html',
  styleUrls: ['./visualizar-turno.component.css']
})
export class VisualizarTurnoComponent {
  public especialidades : any;
  public especialistas : any;

  public especialistaSeleccionado : any;
  public especialidadSeleccionada : any;
  public ratingSeleccionado : number = 0;

  public turnos : any;

  public turnosFiltrados : any;
  public viewCancel : boolean = false;
  public viewRate : boolean = false;
  public viewEncuesta : boolean = false;
  public viewMessage : boolean = false;

  public inputFiltro : any;

  public fechaTurno! : string

  constructor(private data : DataService, private auth : AuthService, private config : NgbRatingConfig) 
  {
    config.max = 5;
  }

  async ngOnInit()
  {
    this.especialidades = await this.data.GetEspecialidades();
    await this.auth.reLogin();
    this.data.getTurnosByUserUserName(this.auth.userName).subscribe((x) =>
    {
      this.turnos = x;
      this.turnosFiltrados = this.turnos;
    });
  }
  
  public async onEspecialidadChange(especialidad : any)
  {
    this.especialistas = await this.data.GetEspecialistas(especialidad);
    this.turnosFiltrados = this.turnos.filter((turno: { Especialidad: any; }) => turno.Especialidad == especialidad);
  }

  public filtrarTurnos()
  {
    this.turnosFiltrados = this.turnos.filter((turno : any) =>
      Object.values(turno).some((valor: any) => {
        if (typeof valor === 'string' || valor instanceof String) 
        {
          return valor.toLowerCase().includes(this.inputFiltro.toLowerCase());
        }
        else
        {
          if(typeof valor === 'number')
          {
            return valor.toString().toLowerCase().includes(this.inputFiltro.toLowerCase());
          }
          else 
          {
            if (typeof valor === 'object' && valor !== null) 
            {
              return Object.values(valor).some((valorAnidado: any) =>
                typeof valorAnidado === 'string' && valorAnidado.toLowerCase().includes(this.inputFiltro.toLowerCase())
              );
            }
          }
        }
        
        return false;
      })
    );
  }

  public async onEspecialistaChange(especialista : any)
  {
    this.turnosFiltrados = this.turnos.filter((turno: { Especialista: any; Especialidad : any;}) => turno.Especialista == especialista && turno.Especialidad == this.especialidadSeleccionada);
  }

  public onCancelClick(turno : any)
  {
    this.viewCancel = true;
    this.viewRate = false;
    this.viewEncuesta = false;
    this.fechaTurno = turno;
  }

  public onLimpiarFiltrosClick()
  {
    this.turnosFiltrados = this.turnos;
    this.especialidadSeleccionada = null;
    this.especialistaSeleccionado = null;
    this.especialistas = null;
  }

  public onRateTurnoClick(turno : any)
  {
    this.viewRate = true;
    this.viewEncuesta = false;
    this.viewCancel = false;
    this.viewMessage = false;
    this.fechaTurno = turno;
  }

  public onEncuestaClick(turno : any)
  {
    this.viewEncuesta = true;
    this.viewCancel = false;
    this.viewRate = false;
    this.viewMessage = false;
    this.fechaTurno = turno;
  }

  public onReseniaClick(turno : any)
  {
    this.viewMessage = true;
    this.viewEncuesta = false;
    this.viewCancel = false;
    this.viewRate = false;
    this.fechaTurno = turno;
  }

  public async onCancelTurnoDismiss()
  {
    this.viewCancel = false;
  }

  public onRateTurnoDismiss()
  {
    this.viewRate = false;
  }

  public onEncuestaTurnoDismiss()
  {
    this.viewEncuesta = false;
  }

  public onReseniaTurnoDismiss()
  {
    this.viewMessage = false;
  }
}

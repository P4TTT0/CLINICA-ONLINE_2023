import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-rate-turno',
  templateUrl: './rate-turno.component.html',
  styleUrls: ['./rate-turno.component.css']
})
export class RateTurnoComponent implements OnInit{
  @Input() turno : any;
  @Output() close = new EventEmitter<boolean>();
  public text! : string;
  public rating! : number;

  constructor(private data : DataService) {}

  ngOnInit(): void {
    this.text = "";
    this.rating = 0;
  }
  
  public onDismiss()
  {
    this.close.emit();
  }

  public async onEnviarRateClick()
  { 
    let date = 
    {
      day: this.turno.Dia,
      monthText: this.turno.Mes,
      year: this.turno.Año
    }
    let turnoId = await this.data.getTurnoIdByDateTime(date, this.turno.Horario);
    await this.data.updateRatingTurnoByTurnoId(turnoId, this.rating.toString(), this.text);
    this.close.emit();
  }
}

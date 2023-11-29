import { Component, OnInit } from '@angular/core';
import { EChartsOption } from 'echarts';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-turnos-especialistas',
  templateUrl: './turnos-especialistas.component.html',
  styleUrls: ['./turnos-especialistas.component.css']
})
export class TurnosEspecialistasComponent implements OnInit {
  public fechaDesde! : Date;
  public fechaHasta! : Date;
  public option! : EChartsOption;
  public estado : boolean = false;

  constructor(private data : DataService) {}

  async ngOnInit() 
  {
    
  }

  public async onDateChange()
  {
    if(this.fechaDesde && this.fechaHasta)
    {
      let x = await this.data.getTurnosToChartEspecialista(this.fechaDesde, this.fechaHasta, this.estado);
      const especialista = x.map(item => item.Especialista);
      const cantidades = x.map(item => item.CantidadTurnos);
      this.option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: especialista,
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: 'Cantidad de turnos',
            type: 'bar',
            barWidth: '60%',
            data: cantidades,
          }
        ]
      };
    }

  }
}

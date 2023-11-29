import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { EChartsOption } from 'echarts';

@Component({
  selector: 'app-turnos-especialidad',
  templateUrl: './turnos-especialidad.component.html',
  styleUrls: ['./turnos-especialidad.component.css']
})
export class TurnosEspecialidadComponent implements OnInit
{
  public option! : EChartsOption;

  constructor(private data : DataService) {}

  async ngOnInit(){
    this.data.getTurnosToChart().subscribe((x) =>
    {
      console.log(x);
      const especialidades = x.map(item => item.Especialidad);
      const cantidades = x.map(item => item.count);

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
            data: especialidades,
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
            data: cantidades
          }
        ]
      };
    });
  }
}

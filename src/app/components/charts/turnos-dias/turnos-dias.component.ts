import { Component, OnInit } from '@angular/core';
import { EChartsOption } from 'echarts';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-turnos-dias',
  templateUrl: './turnos-dias.component.html',
  styleUrls: ['./turnos-dias.component.css']
})
export class TurnosDiasComponent implements OnInit {

  public option! : EChartsOption;
  public meses : string[] = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  public mesSeleccionado! : string;

  constructor(private data : DataService) {}

  async ngOnInit() {
  }

  public async onMesChange(mes : string)
  {
    let x = await this.data.getTurnosToChartByMes(mes);
    const dias = x.map(item => item.Dia);
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
          data: dias,
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
          name: 'Direct',
          type: 'bar',
          barWidth: '60%',
          data: cantidades
        }
      ]
    };
  }
}

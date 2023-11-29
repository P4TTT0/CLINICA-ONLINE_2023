import { Component, OnInit } from '@angular/core';
import { EChartsOption } from 'echarts';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.css']
})
export class LogsComponent implements OnInit{

  public option! : EChartsOption;
  public users : any;
  public fechaSeleccionada! : string;
  public countsTotales! : number;

  constructor(private data : DataService) {}
  
  async ngOnInit()
  {
    let days = await this.data.getDaysToLog();
    let counts = await this.data.getCountsToLog();
    this.option = {
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: days,
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: counts,
          type: 'line',
          areaStyle: {}
        }
      ]
    };

    this.countsTotales = counts.reduce((acumulador, numero) => acumulador + numero, 0);
  }

  async onChartClick(event: any) {
    if (event.name) {
      this.fechaSeleccionada = event.name;
      this.users = await this.data.getLogs(this.fechaSeleccionada);
      console.log(this.users);
    }
  }
}

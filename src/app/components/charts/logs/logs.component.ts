import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { EChartsOption } from 'echarts';
import { DataService } from 'src/app/services/data.service';
import html2canvas from 'html2canvas';
import { FilesService } from 'src/app/services/files.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.css']
})
export class LogsComponent implements OnInit{
  @ViewChild('chartContainer') chartContainer! : ElementRef;

  public option! : EChartsOption;
  public users : any;
  public fechaSeleccionada! : string;
  public countsTotales! : number;

  constructor(private data : DataService, private file : FilesService, private datePipe : DatePipe) {}
  
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

    let chart = document.getElementById('chart');
    if (event.name) {
      this.fechaSeleccionada = event.name;
      this.users = await this.data.getLogs(this.fechaSeleccionada);
      console.log(this.users);
    }
  }

  public onPdfDownload()
  {
    let image : string = "";
    html2canvas(this.chartContainer.nativeElement).then((canvas: { toDataURL: (arg0: string) => any; }) => {
    image = canvas.toDataURL('image/png');
    let fecha = this.datePipe.transform(new Date(), 'dd/MM/yyyy');
    this.file.downloadPdfChart('Grafico de logs', 'logs_' + fecha, image);
    });
  }
}

import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { EChartsOption } from 'echarts';
import html2canvas from 'html2canvas';
import { FilesService } from 'src/app/services/files.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-turnos-especialidad',
  templateUrl: './turnos-especialidad.component.html',
  styleUrls: ['./turnos-especialidad.component.css']
})
export class TurnosEspecialidadComponent implements OnInit
{
  public option! : EChartsOption;
  @ViewChild('chartContainer') chartContainer! : ElementRef;

  constructor(private data : DataService, private file : FilesService, private datePipe : DatePipe) {}

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

  public onPdfDownload()
  {
    let image : string = "";
    html2canvas(this.chartContainer.nativeElement).then((canvas: { toDataURL: (arg0: string) => any; }) => {
    image = canvas.toDataURL('image/png');
    let fecha = this.datePipe.transform(new Date(), 'dd/MM/yyyy');
    this.file.downloadPdfChart('Grafico de logs', 'turnos-especialidad_' + fecha, image);
    });
  }
}

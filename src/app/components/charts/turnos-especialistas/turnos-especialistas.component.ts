import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { EChartsOption } from 'echarts';
import html2canvas from 'html2canvas';
import { DataService } from 'src/app/services/data.service';
import { FilesService } from 'src/app/services/files.service';

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
  @ViewChild('chartContainer') chartContainer! : ElementRef;

  constructor(private data : DataService, private file : FilesService, private datePipe : DatePipe) {}

  async ngOnInit() 
  {
    
  }

  public async onDateChange()
  {
    if(this.fechaDesde && this.fechaHasta)
    {

      if (this.fechaDesde > this.fechaHasta) {
        this.fechaHasta = this.fechaDesde;
      }
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

  public onPdfDownload()
  {
    let image : string = "";
    html2canvas(this.chartContainer.nativeElement).then((canvas: { toDataURL: (arg0: string) => any; }) => {
    image = canvas.toDataURL('image/png');
    let fecha = this.datePipe.transform(new Date(), 'dd/MM/yyyy');
    this.file.downloadPdfChart('Grafico de logs', 'turnos-especialista_' + fecha, image);
    });
  }
}

import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { EChartsOption } from 'echarts';
import html2canvas from 'html2canvas';
import { DataService } from 'src/app/services/data.service';
import { FilesService } from 'src/app/services/files.service';

@Component({
  selector: 'app-turnos-dias',
  templateUrl: './turnos-dias.component.html',
  styleUrls: ['./turnos-dias.component.css']
})
export class TurnosDiasComponent implements OnInit {
  @ViewChild('chartContainer') chartContainer! : ElementRef;
  public option! : EChartsOption;
  public meses : string[] = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  public mesSeleccionado! : string;

  constructor(private data : DataService, private datePipe : DatePipe, private file : FilesService) {}

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

  public onPdfDownload()
  {
    let image : string = "";
    html2canvas(this.chartContainer.nativeElement).then((canvas: { toDataURL: (arg0: string) => any; }) => {
    image = canvas.toDataURL('image/png');
    let fecha = this.datePipe.transform(new Date(), 'dd/MM/yyyy');
    this.file.downloadPdfChart('Grafico de logs', 'turnos-dias_' + fecha, image);
    });
  }
}

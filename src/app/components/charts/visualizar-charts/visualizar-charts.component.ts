import { Component } from '@angular/core';
import { slideInUp } from 'src/app/animations';

@Component({
  selector: 'app-visualizar-charts',
  templateUrl: './visualizar-charts.component.html',
  styleUrls: ['./visualizar-charts.component.css'],
  animations: [slideInUp]
})
export class VisualizarChartsComponent {

  public tipo! : string;

  public onOptionClick(option : string)
  {
    this.tipo = option;
  }
}

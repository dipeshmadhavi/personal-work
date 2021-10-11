import { Component } from '@angular/core';
import * as Highcharts from 'highcharts';
import { SeriesOptionsType } from 'highcharts';
import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public Highcharts = Highcharts
  public title = 'charts';
  public populationData: number[] = []
  public areaData1: number[] = []
  public areaData2: number[] = []
  public area2Options: object = {};
  public area1Options: object = {};
  public populationsOptions: object = {};
  public isLoaded: boolean = false;

  constructor(private readonly appService: AppService) {
  }


  async ngOnInit() {
    const result = await this.appService.getGraphData().toPromise();
    this.populationData = result.populationData;
    this.areaData1 = result.areaData1;
    this.areaData2 = result.areaData2;


    this.populationsOptions = {
      chart: {
        type: 'column',
        height: 300,
        width: 500
      },
      title: { text: '' },
      xAxis: {
      },
      yAxis: {
        title: {
          text: ''
        },
        min: 0,
      },

      series: <SeriesOptionsType[]>[{
        name: 'Population',
        data: this.populationData,
      }
      ],
    }

    this.area1Options = {
      chart: {
        type: 'area',
        height: 200,
        width: 300,

      },
      colors: ['#f55fbc'],
      title: { text: `${this.areaData1.length}` },
      subtitle: { text: 'increase and decrease sales per day' },
      xAxis: {
        labels: {
          enabled: false
        },
        min: 0,
      },
      yAxis: {
        title: {
          text: ''
        },
        labels: {
          enabled: false
        }

      },
      series: <SeriesOptionsType[]>[{
        name: '',
        data: this.areaData1
      }]
    }

    this.area2Options = {
      chart: {
        type: 'area',
        height: 200,
        width: 300,

      },
      colors: ['#be81f0'],
      title: { text: `${this.areaData2.length}` },
      subtitle: { text: 'increase and decrease orders per day' },
      xAxis: {
        labels: {
          enabled: false
        },
        min: 0,
      },
      yAxis: {
        title: {
          text: ''
        },
        labels: {
          enabled: false
        }

      },
      tooltip: {
      },
      plotOptions: {
      },
      series: <SeriesOptionsType[]>[{
        name: '',
        data: this.areaData2
      }]
    }
    this.isLoaded = true
  }




}

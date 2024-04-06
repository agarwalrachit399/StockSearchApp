import { Component } from '@angular/core';
import Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import { Subscription } from 'rxjs';
import { Company, espEarningDesc } from '../../types';
import { SharingServiceService } from '../services/sharing-service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-esp-earning',
  standalone: true,
  imports: [HighchartsChartModule,CommonModule],
  templateUrl: './esp-earning.component.html',
  styleUrl: './esp-earning.component.css'
})
export class EspEarningComponent {
  private subscription: Subscription;
  Data!: Company
  espObj : espEarningDesc[] = []
  actual: number[]=[]
  estimate: number[]=[]
  period: string[]=[]
  surprise: number[]=[]

  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {}
  isLoaded: Boolean = false
 constructor(private SharingService : SharingServiceService) {
  this.subscription = this.SharingService.data$.subscribe(data => {
    this.Data = data;
    this.espObj = this.replaceNullsWithZero(this.Data.epsearning)
    this.actual = this.espObj.map(obj=>obj.actual)
    this.estimate = this.espObj.map(obj=>obj.estimate)
    this.period = this.espObj.map(obj=> obj.period + "<br>Surprise:" + String(obj.surprise))
    this.surprise = this.espObj.map(obj=>obj.surprise)
    this.chartOptions = {
      chart: {
        backgroundColor: '#f6f6f6',
     },
      title: {
        text: 'Historical EPS Surprise',
        align: 'center'
    },
    yAxis: {
      title: {
          text: 'Quaterly EPS'
      },
      opposite: false
  },
  xAxis: {
    categories: this.period,
    labels : {
      style: {
        textOverflow: 'wrap',
        textAlign: 'center'
      },
      useHTML:true,
      align: 'center',
      distance : 22
    }
  },
  plotOptions: {
    series: {
        marker: {
            enabled: true
        },
        lineWidth: 2
    }
},
legend: {
  enabled: true
},
      series: [{
        name: 'Actual',
        data: this.actual,
        type: 'spline'
      },
      {
        name: 'Estimate',
        data: this.estimate,
        type: 'spline'
      }]
    }
    this.isLoaded = true
  })
}

public replaceNullsWithZero(arr: espEarningDesc[]) {
  return arr.map(obj => {
    let newObj: espEarningDesc = { actual: obj.actual || 0, estimate: obj.estimate || 0, period: obj.period, quarter:obj.quarter || 0, surprise:obj.surprise||0,
    surprisePercent:obj.surprisePercent||0,symbol:obj.symbol,year:obj.year||0 };
    return newObj;
  });
}

}

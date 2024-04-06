import { Component } from '@angular/core';
import Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import { Subscription } from 'rxjs';
import { Company, recommendDesc } from '../../types';
import { SharingServiceService } from '../services/sharing-service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rectrend',
  standalone: true,
  imports: [HighchartsChartModule,CommonModule],
  templateUrl: './rectrend.component.html',
  styleUrl: './rectrend.component.css'
})
export class RectrendComponent {
  private subscription: Subscription;
  Data!: Company
  recommendObj : recommendDesc[] = []
  strongBuy: number[] =[]
  buy: number[] =[]
  hold: number[] =[]
  sell: number[] =[]
  strongSell: number[] =[]
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options={}
  isLoaded: Boolean = false
 constructor(private SharingService : SharingServiceService ) {
  this.subscription = this.SharingService.data$.subscribe(data => {
    this.Data = data;
    this.recommendObj = this.Data.recommendation
    this.buy = this.recommendObj.map(obj=>obj.buy)
    this.strongBuy = this.recommendObj.map(obj=>obj.strongBuy)
    this.hold = this.recommendObj.map(obj=>obj.hold)
    this.sell = this.recommendObj.map(obj=>obj.sell)
    this.strongSell = this.recommendObj.map(obj=>obj.strongSell)
    this.isLoaded=true
    this.chartOptions = {
      chart: {
        type: 'column',
        backgroundColor: '#f6f6f6'
    },
    title: {
        text: 'Recommendation Trends',
        align: 'center'
    },
    xAxis: {
        categories: ['2024-03', '2024-02', '2024-01', '2023-12']
    },
    yAxis: {
        min: 0,
        title: {
            text: '#Analysis'
        },
        stackLabels: {
            enabled: false
        }
    },
    plotOptions: {
        column: {
            stacking: 'normal',
            dataLabels: {
                enabled: true
            }
        }
    },
    series: [{
        name: 'strongBuy',
        data: this.strongBuy,
        type:'column',
        color: '#196334'
    }, {
        name: 'buy',
        data: this.buy,
        type:'column',
        color: '#25af51'
    }, {
        name: 'hold',
        data: this.hold,
        type:'column',
        color: '#b17e28'
    },
    {
      name: 'sell',
      data: this.sell,
      type:'column',
      color: '#f15053'
  },
  {
    name: 'strongSell',
    data: this.strongSell,
    type:'column',
    color: '#752b2c'
}]
}})}}

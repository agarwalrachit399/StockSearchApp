import { Component } from '@angular/core';
import { HighchartsChartModule } from 'highcharts-angular';
import { Subscription } from 'rxjs';
import { Company, hourPrice } from '../../types';
import { CommonModule } from '@angular/common';
import { SharingServiceService } from '../services/sharing-service.service';
import * as Highcharts from 'highcharts/highstock';
import Indicators from 'highcharts/indicators/indicators'
import vbp from 'highcharts/indicators/volume-by-price'
Indicators(Highcharts)
vbp(Highcharts)

@Component({
  selector: 'app-ohlc-chart',
  standalone: true,
  imports: [HighchartsChartModule,CommonModule],
  templateUrl: './ohlc-chart.component.html',
  styleUrl: './ohlc-chart.component.css'
})
export class OhlcChartComponent{
  private subscription: Subscription;
  isHighcharts = typeof Highcharts === 'object';
  Data!: Company
  priceObj : hourPrice[] = []
  ohlc: [number,number,number,number,number][] = []
  volume: [number,number][]=[]
  price: [number,number][]=[]
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {}
  isLoaded: Boolean = false
  
 constructor(private SharingService : SharingServiceService) {
  this.subscription = this.SharingService.data$.subscribe(data => {
    this.Data = data;
    this.priceObj = this.Data.charting.results
    this.ohlc = this.priceObj.map(obj=>[obj.t,obj.o,obj.h,obj.l,obj.c])
    this.volume = this.priceObj.map(obj=>[obj.t,obj.v])
    this.price = this.priceObj.map(obj=>[obj.t,obj.c])
    this.chartOptions = {
      rangeSelector: {
        selected: 2
    },

    title: {
        text: `${this.Data.company.ticker} Historical` 
    },

    subtitle: {
        text: 'With SMA and Volume by Price technical indicators'
    },

    yAxis: [{
        startOnTick: false,
        endOnTick: false,
        labels: {
            align: 'right',
            x: -3
        },
        title: {
            text: 'OHLC'
        },
        height: '60%',
        lineWidth: 2,
        resize: {
            enabled: true
        }
    }, {
        labels: {
            align: 'right',
            x: -3
        },
        title: {
            text: 'Volume'
        },
        top: '65%',
        height: '35%',
        offset: 0,
        lineWidth: 2
    }],

    tooltip: {
        split: true
    },

    series: [{
      type: 'candlestick',
      name: 'AAPL',
      id: 'aapl',
      zIndex: 2,
      data: this.ohlc
  }, {
      type: 'column',
      name: 'Volume',
      id: 'volume',
      data: this.volume,
      yAxis: 1
  }, {
      type: 'vbp',
      linkedTo: 'aapl',
      params: {
          volumeSeriesID: 'volume'
      },
      dataLabels: {
          enabled: false
      },
      zoneLines: {
          enabled: false
      }
  }, {
      type: 'sma',
      linkedTo: 'aapl',
      zIndex: 1,
      marker: {
          enabled: false
      }
  }]
    }
    this.isLoaded = true
  })
}
}

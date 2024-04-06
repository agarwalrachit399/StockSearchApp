import { Component } from '@angular/core';
import Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import { Subscription } from 'rxjs';
import { Company, StockQuote, hourPrice } from '../../types';
import { SharingServiceService } from '../services/sharing-service.service';
import { CommonModule } from '@angular/common';
import { QuoteshareService } from '../services/quoteshare.service';

@Component({
  selector: 'app-hourlyprice',
  standalone: true,
  imports: [HighchartsChartModule,CommonModule],
  templateUrl: './hourlyprice.component.html',
  styleUrl: './hourlyprice.component.css'
})
export class HourlypriceComponent{

  private subscription : Subscription
  Data!: Company
  priceObj : hourPrice[] = []
  price: [number,number][] = []
  stockData!: StockQuote
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {}
  isLoaded: Boolean = false
 constructor(private SharingService : SharingServiceService,
  private StockShare : QuoteshareService,
  ) {
    this.subscription  =this.StockShare.data$.subscribe(data => {
    this.stockData = data;
   }) 
  this.subscription = this.SharingService.data$.subscribe(data => {
    this.Data = data;
    this.priceObj = this.Data.hourlyPrice.results
    this.price = this.priceObj.map(obj=>[obj.t,obj.c])
  })


  this.chartOptions = {
    
    chart: {
      backgroundColor: '#f6f6f6',
   },
    title: {
      text: `${this.Data.company.ticker}  Hourly Price Variation`,
      align: 'center',
      style:{
        color: '#808080'
      }
  },
  yAxis: {
    title: {
        text: ''
    },
    opposite: true
},
xAxis: {
  type: 'datetime',
},
plotOptions: {
  series: {
      marker: {
          enabled: false
      },
      lineWidth: 2
  }
},
legend: {
enabled: false
},
    series: [{
      data: this.price,
      type: 'line',
      color: this.stockData.stock.d>0?'green':'red'
    }]
  }
  this.isLoaded = true
}

}

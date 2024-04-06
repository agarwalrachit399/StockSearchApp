import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { Company, SentimentDesc } from '../../types';
import { SharingServiceService } from '../services/sharing-service.service';
import { RectrendComponent } from '../rectrend/rectrend.component';
import { EspEarningComponent } from '../esp-earning/esp-earning.component';

@Component({
  selector: 'app-sentiment',
  standalone: true,
  imports: [RectrendComponent,EspEarningComponent],
  templateUrl: './sentiment.component.html',
  styleUrl: './sentiment.component.css'
})
export class SentimentComponent {
  private subscription: Subscription;
  Data!: Company
  sentiment : SentimentDesc[] = []
  totalMspr : number = 0
  positiveMspr: number=0
  negativeMspr: number=0
  totalChange : number = 0
  positiveChange: number=0
  negativeChange: number=0
  name: String=''

 constructor(private SharingService : SharingServiceService) {
  this.subscription = this.SharingService.data$.subscribe(data => {
    this.Data = data;
    this.sentiment = this.Data.sentiment.data
    this.name = this.Data.sentiment.symbol
    this.totalMspr = this.sentiment.reduce((acc,obj)=>acc+obj.mspr,0)
    this.positiveMspr = this.sentiment.reduce((acc,obj)=>{
      if (obj.mspr > 0) {
          acc += obj.mspr;
      }
      return acc;
  }, 0);
    this.negativeMspr = this.sentiment.reduce((acc,obj)=>{
      if (obj.mspr < 0) {
          acc += obj.mspr;
      }
      return acc;
  }, 0);

  this.totalChange = this.sentiment.reduce((acc,obj)=>acc+obj.change,0)
    this.positiveChange = this.sentiment.reduce((acc,obj)=>{
      if (obj.change > 0) {
          acc += obj.change;
      }
      return acc;
  }, 0);
    this.negativeChange = this.sentiment.reduce((acc,obj)=>{
      if (obj.change < 0) {
          acc += obj.change;
      }
      return acc;
  }, 0);
  })
}
public roundToTwoDecimalPlaces(value:number) {
  // Check if the value is an integer
  if (value % 1 === 0) {
      // If it's an integer, return it as is
      return value;
  } else {
      // If it's not an integer, round it to two decimal places
      return parseFloat(value.toFixed(2));
  }
}


}

import { Component,Input } from '@angular/core';
import {MatTabsModule} from '@angular/material/tabs';
import { SummaryComponent } from '../summary/summary.component';
import { NewsComponent } from '../news/news.component';
import { CommonModule } from '@angular/common';
import { SentimentComponent } from '../sentiment/sentiment.component';
import { OhlcChartComponent } from '../ohlc-chart/ohlc-chart.component';

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [MatTabsModule,SummaryComponent,NewsComponent,CommonModule,SentimentComponent,OhlcChartComponent],
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.css'
})
export class TabsComponent {

}

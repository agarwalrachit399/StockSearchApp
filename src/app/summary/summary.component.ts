import { Component, Input } from '@angular/core';
import { Company, CompanyDesc, HistoryDesc, StockQuote } from '../../types';
import { Subscription, forkJoin, tap } from 'rxjs';
import { SharingServiceService } from '../services/sharing-service.service';
import { HourlypriceComponent } from '../hourlyprice/hourlyprice.component';
import { NgFor } from '@angular/common';
import { CompanyService } from '../services/company.service';
import { Router, RouterLink } from '@angular/router';
import { QuoteshareService } from '../services/quoteshare.service';
import { RefreshService } from '../services/refresh.service';
import { IsAvailService } from '../services/is-avail.service';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [HourlypriceComponent,NgFor,RouterLink],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.css'
})
export class SummaryComponent {

  private subscription: Subscription;
  Data!: Company
  peers : string[]=[]
  stockData! : StockQuote
  name: string=''
 constructor(private SharingService : SharingServiceService,
  private companyService: CompanyService,
  private StockShare : QuoteshareService,
  private QuoteService : RefreshService,
  private router: Router,
  private IsAvial : IsAvailService) {
  this.subscription = this.StockShare.data$.subscribe((data=> {
    this.stockData = data
  }))
  this.subscription = this.SharingService.data$.subscribe(data => {
    this.Data = data;
    this.peers = [...new Set(this.Data.peers)]
    this.peers = this.peers.filter(item => !item.includes('.'))
  });
  }

  submitForm(name:string) {
    this.router.navigate(['/']); // Navigate to home route first
    this.IsAvial.updateSpinner(true)
    this.name = name
    // Fetch data from QuoteService and CompanyService
    forkJoin([
      this.QuoteService.getRefresh('/quote', { name: name }),
      this.companyService.getCompany('/company', { name: name })
    ]).pipe(
      tap(([stock, company]) => {
        this.StockShare.sendData(stock); // Send stock data
        this.SharingService.sendData(company); // Send company data
        this.IsAvial.updateRefresh(name)
      })
    ).subscribe(() => {
      // Once all data is fetched and processed, navigate to /search route
      this.router.navigate(['/search', name]);
      this.IsAvial.updateSpinner(false)
    });
    
    
  }

}

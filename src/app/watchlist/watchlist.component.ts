import { Component, OnInit } from '@angular/core';
import { WatchList } from '../../types';
import { WatchshareService } from '../services/watchshare.service';
import { Observable, forkJoin, take, tap, timer } from 'rxjs';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { WatchlistService } from '../services/watchlist.service';
import { Router } from '@angular/router';
import { CompanyService } from '../services/company.service';
import { SharingServiceService } from '../services/sharing-service.service';
import { IsAvailService } from '../services/is-avail.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { QuoteshareService } from '../services/quoteshare.service';
import { RefreshService } from '../services/refresh.service';

@Component({
  selector: 'app-watchlist',
  standalone: true,
  imports: [NgFor,CommonModule,NgIf,MatProgressSpinnerModule],
  templateUrl: './watchlist.component.html',
  styleUrl: './watchlist.component.css'
})
export class WatchlistComponent implements OnInit {
  Data! : WatchList[]
  Empty: boolean = true
  isLoadingData : boolean = true
  name : string =''
  constructor( private watchlistshare : WatchshareService,
    private WatchListService : WatchlistService,
    private companyService : CompanyService,
    private SharingService : SharingServiceService,
    private IsAvail : IsAvailService,
    private router: Router,
    private StockShare : QuoteshareService,
    private QuoteService : RefreshService){
   this.watchlistshare.data$.subscribe(data=>{
      this.Data=data
      if (this.Data.length>0){this.Empty= false}
      
    });

  }

  ngOnInit() {
    timer(100).pipe(take(1)).subscribe(() => {
      this.loadData();
    });
  }

  loadData() {
    this.WatchListService.getWatchList('/watchlist').subscribe((watchlist) => {
      this.Data = watchlist;
      this.Empty = this.Data.length === 0;
      if (this.Empty) {
        this.isLoadingData=false
        return
      }
      else{
      this.updateStockPriceAndSendData();}
    });
  }

  updateStockPriceAndSendData() {
    const requests: Observable<any>[] = [];

    this.Data.forEach((watch) => {
      requests.push(
        this.QuoteService.getRefresh('/quote', { name: watch.ticker })
      );
    });

    forkJoin(requests).subscribe(
      (responses) => {
        
        responses.forEach((stockdata, index) => {
          this.Data[index].price = stockdata.stock.c;
          this.Data[index].change = stockdata.stock.dp;
          this.Data[index].percent = stockdata.stock.pc;
        });

        this.watchlistshare.sendData(this.Data);

        this.isLoadingData = false;
      },
      (error) => {
        console.error('Error updating stock prices:', error);
        this.isLoadingData = false;
      }
    );
  }


  removestock(ticker:String,event:Event){
  this.WatchListService.deleteWatchList(`/delete/${ticker}`).subscribe({
    next: (data) => {
      this.WatchListService.getWatchList('/watchlist').subscribe((watchlist) => {
        if (watchlist.length == 0) {
          this.Empty = true;
        }
        this.watchlistshare.sendData(watchlist);

        this.router.navigate(['/watchlist']);
      });
    },
    error: (error) => {
      console.log(error);
    }
  });

  event.stopPropagation();

}

navigateTo(ticker:string){
  this.router.navigate(['/']); 
  this.IsAvail.updateSpinner(true)
    this.name = ticker
    forkJoin([
      this.QuoteService.getRefresh('/quote', { name: ticker }),
      this.companyService.getCompany('/company', { name: ticker })
    ]).pipe(
      tap(([stock, company]) => {
        this.StockShare.sendData(stock); 
        this.SharingService.sendData(company); 
        this.IsAvail.updateRefresh(ticker)
      })
    ).subscribe(() => {
      this.router.navigate(['/search', ticker]);
      this.IsAvail.updateSpinner(false)
    });
}


parseFloat(x:string){
  return parseFloat(x)
}
}

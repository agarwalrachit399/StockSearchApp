import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { WatchlistService } from '../services/watchlist.service';
import { SharingServiceService } from '../services/sharing-service.service';
import { WatchshareService } from '../services/watchshare.service';
import { Company } from '../../types';
import { PortfolioService } from '../services/portfolio.service';
import { PortfolioShareService } from '../services/portfolio-share.service';
import { BalanceshareService } from '../services/balanceshare.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, NgClass],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  Data!: Company
  navhome: string = '/'
  subscription : any
  homeroute: boolean = true
  watchroute: boolean = false
  portroute: boolean = false
  constructor(
    //private subscription : Subscription,
    private watchshareservice : WatchshareService,
    private watchlistservice: WatchlistService,
    private SharingService : SharingServiceService,
    private PortfolioService : PortfolioService,
    private PortfolioShareService : PortfolioShareService,
    private BalanceShare : BalanceshareService,
  ) {
    this.subscription = this.SharingService.data$.subscribe(data => {
      this.Data = data
      if (Object.keys(data).length != 0){
      this.navhome = `/search/${this.Data.company.ticker}`}
      this.home()
    });
  }

    home(){
      this.watchroute=false
      this.homeroute=true
      this.portroute=false 
    }
    getStock() {
     this.watchroute=true
     this.homeroute=false
     this.portroute=false 
   
    this.watchlistservice.getWatchList('/watchlist').subscribe((watchlist) => {
    
      this.watchshareservice.sendData(watchlist)
    })
  }

  getPortfolio(){
    this.watchroute=false
    this.portroute=true
    this.homeroute=false
   
    this.PortfolioService.getPortfolioAll('/portfolio/all').subscribe((portfolio)=> {
      this.PortfolioShareService.sendData(portfolio)
    })
    this.PortfolioService.getBalance('/portfolio/money').subscribe((balance)=>{
        this.BalanceShare.sendData(balance)
    })
  }

}

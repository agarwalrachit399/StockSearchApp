import { Component, EventEmitter, Input, OnInit, Output, ViewChild, inject } from '@angular/core';
import { Company, Money, Portfolio, StockQuote, WatchList } from '../../types';
import { SharingServiceService } from '../services/sharing-service.service';
import { Subject, Subscription, interval, switchMap, takeUntil } from 'rxjs';
import { CommonModule, NgClass, NgFor, NgIf, NgStyle } from '@angular/common';
import { WatchlistService } from '../services/watchlist.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PortfolioService } from '../services/portfolio.service';
import { PortfolioShareService } from '../services/portfolio-share.service';
import { BalanceshareService } from '../services/balanceshare.service';
import { QuoteshareService } from '../services/quoteshare.service';
import { CompanyService } from '../services/company.service';
import { NgbdAlertSelfclosing } from '../alert-selfclosing/alert-selfclosing.component';
import { IsAvailService } from '../services/is-avail.service';
import { AlertComponent } from '../alert/alert.component';



@Component({
	selector: 'app-transcation-modal',
	standalone: true,
  imports: [CommonModule,NgFor,NgIf],
	templateUrl: './transaction-modal.component.html',
  styleUrl: './transaction-modal.component.css'
})
export class NewsModalComponent {
	activeModal = inject(NgbActiveModal);
  TotalPrice: number = 0.00
  quantity : number=0
  total_cost: number=0.00
  avg_cost : number=0.00
  money! :  Money
  isbuyDone : boolean = false
  issellDone: boolean = false
  isDeleted: boolean = false
  new_quantity: number = 0
  current_input: number = 0
  @Input() ticker: string ='';
	@Input() price:  number= 0.00;
  @Input() name : string ='';
  @Input() balance: number = 0.00;
  @Input() action : string='';
  @Input () portfolio!: Portfolio;
  @Output() isBuyDoneEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() isSellDoneEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();
  // @Input() headline: string ='';
  // @Input() summary: string ='';
  // @Input() link: string ='';

  constructor(private PortfolioService: PortfolioService,
    private isAvail : IsAvailService,
    private BalanceShare : BalanceshareService){
  }

  isInteger(value: any){
    return Number.isInteger(value);
  }

  onInput(event: Event){
    const InputVal = (event.target as HTMLInputElement).value;
    this.TotalPrice = this.price * Number(InputVal)
    this.current_input = Number(InputVal) 
    if (this.action=='Buy') {
    //this.balance = this.balance -  this.TotalPrice
    
    this.new_quantity = Number(InputVal) + this.portfolio.quantity
    this.total_cost = this.TotalPrice + this.portfolio.total_cost
    this.avg_cost = this.total_cost/this.new_quantity}
    else if (this.action=='Sell') {
      //this.balance = this.balance + this.TotalPrice 
      this.new_quantity = this.portfolio.quantity - Number(InputVal)
      this.total_cost = this.portfolio.total_cost - (this.portfolio.avg_cost * Number(InputVal))
      this.avg_cost = this.total_cost/this.new_quantity
    }
  }

  buystock(ticker:string){
    this.portfolio = {
      _id: ticker,
      name: this.name,
      price: this.price,
      total_cost: this.total_cost,
      quantity: this.new_quantity,
      avg_cost: this.avg_cost,
      market_val: this.price * this.new_quantity,
      change : this.price - parseFloat(this.avg_cost.toFixed(2))
    }
    if (this.action=='Buy'){
      this.balance = this.balance - this.TotalPrice
      this.isbuyDone = true
    }
    else if (this.action=='Sell'){
      this.balance = this.balance + this.TotalPrice
      this.issellDone = true
      if (this.new_quantity==0){
        this.isDeleted =true
        this.PortfolioService.deletePortfolio(`/portfolio/delete/${ticker}`).subscribe({
    next: (data)=> console.log(data),
    error: (error)=> console.log(error)
  });  
  this.isAvail.updateIsAvail(false)
      }
    }
    this.money = {
      _id: 'money',
      balance: this.balance
    }
    this.BalanceShare.sendData(this.money)
    this.isBuyDoneEmitter.emit(this.isbuyDone);
    this.isSellDoneEmitter.emit(this.issellDone);
    
    this.PortfolioService.editBalance(`/portfolio/update/money`,this.money).subscribe({
      next: (data)=> console.log(data),
      error: (error)=> console.log(error)
    })
    if (!this.isDeleted){
    this.PortfolioService.editPortfolio(`/portfolio/update/${ticker}`,this.portfolio).subscribe({
      next: (data)=> console.log(data),
      error: (error)=> console.log(error)
    });
    this.isAvail.updateIsAvail(true)}

    this.isDeleted=false
  
  }
}



@Component({
  selector: 'app-companydesc',
  standalone: true,
  imports: [NgStyle,NgIf,NgClass, NgbdAlertSelfclosing,CommonModule,AlertComponent],
  templateUrl: './companydesc.component.html',
  styleUrl: './companydesc.component.css'
})
export class CompanydescComponent implements OnInit{
  private subscription: Subscription;
  private modalService = inject(NgbModal);
  private subscriptions: Subscription[] = [];
  destroy$: Subject<void> = new Subject<void>();
  watchaction : boolean = false
  messagewatch:string = ''
  actionwatch: string = ''
  buymessage : string = ''
  sellmessage: string=''
  message : string = ''
  isDone : boolean= false
  isSellDone : boolean=false
  isBuyDone : boolean=false
  Data!: Company
  stockData! : StockQuote
  isStarred: boolean = false;
  iconClass: string = 'bi bi-star h4'
  action: string = ""
  buyAction: string =''
  sellAction: string = ''
  balance : number=0.00
  portfolio: Portfolio = {
    _id: "",
    name: "",
    price: 0,
    market_val: 0,
    change:0,
    avg_cost: 0,
    total_cost: 0,
    quantity: 0,

  }
  historyDate? : Date
 currentDate?: Date
 marketDate?: string
 currentTime?: string
 marketStatus: string = 'is Open'
 isSellAvail : boolean = false
  watchListData !: WatchList
 constructor(private SharingService : SharingServiceService,
  private CompanyService : CompanyService,
  private WatchListService : WatchlistService,
  private PortfolioService: PortfolioService,
  private PortfolioSharingService : PortfolioShareService,
  private BalanceShare : BalanceshareService,
  private IsAvail : IsAvailService,
  private StockShare: QuoteshareService,
  ) {
   this.subscription = this.BalanceShare.data$.subscribe(data=> {
    this.balance = data.balance
   }) 
   this.subscription=  this.IsAvail.isSellAvail$.subscribe(isAvail=> {
    this.isSellAvail=isAvail
   })
   this.subscription = this.IsAvail.isStarAvail$.subscribe(isStar=> {
    this.isStarred = isStar
    if(this.isStarred) {
      this.iconClass='bi bi-star-fill h4 icon-clicked'
    }
   })
  
  this.subscriptions.push(this.StockShare.data$.pipe(
    switchMap(stockData => {
      // Assign received stockData to this.stockData
      this.stockData = stockData;
      // Return the SharingService.data$ observable
      return this.SharingService.data$;
    })
  ).subscribe(data => {
    // Once SharingService.data$ emits data, assign it to this.Data and create watchListData
    this.Data = data;
    this.watchListData = {
      ticker: this.Data.company.ticker,
      name: this.Data.company.name,
      price: this.stockData.stock.c,
      change: this.stockData.stock.d,
      percent: this.stockData.stock.dp
    };
  }));
  
  }
 
ngOnInit(){
this.historyDate = new Date(this.stockData.stock.t * 1000)

this.currentDate = new Date()

this.marketDate = `${this.historyDate.toISOString().split('T')[0]} ${String(this.historyDate.getHours()).padStart(2, '0')}:${String(this.historyDate.getMinutes()).padStart(2, '0')}:${String(this.historyDate.getSeconds()).padStart(2, '0')}`
this.currentTime = `${this.currentDate.getFullYear()}-${String(this.currentDate.getMonth() + 1).padStart(2, '0')}-${String(this.currentDate.getDate()).padStart(2, '0')} ${String(this.currentDate.getHours()).padStart(2, '0')}:${String(this.currentDate.getMinutes()).padStart(2, '0')}:${String(this.currentDate.getSeconds()).padStart(2, '0')}`;
if ((this.currentDate.valueOf() - this.historyDate.valueOf())/1000 >300){
this.marketStatus = `Closed on ${this.marketDate}`
}
interval(15000) 
    .pipe(
      takeUntil(this.destroy$)
    )
    .subscribe(() => {
      this.currentDate = new Date()
      this.currentTime =  `${this.currentDate.getFullYear()}-${String(this.currentDate.getMonth() + 1).padStart(2, '0')}-${String(this.currentDate.getDate()).padStart(2, '0')} ${String(this.currentDate.getHours()).padStart(2, '0')}:${String(this.currentDate.getMinutes()).padStart(2, '0')}:${String(this.currentDate.getSeconds()).padStart(2, '0')}`;
    });
}

ngOnDestroy() {
  this.destroy$.next();
  this.destroy$.complete();
}

toggleStar(ticker: string){
  this.watchaction = true
  setTimeout(() => {
    this.watchaction = false;
  }, 5000);
  this.isStarred = !this.isStarred;
  this.IsAvail.updateIsStarAvail(this.isStarred)
  if (this.isStarred) {
    this.messagewatch = `${ticker} added to Watchlist.`
    this.actionwatch = "Buy"
    this.iconClass='bi bi-star-fill h4 icon-clicked'
  this.WatchListService.addWatchList('/watchlist/save',this.watchListData).subscribe({
    next: (data)=> console.log(data),
    error: (error)=> console.log(error)
  })
}
else {
    this.messagewatch = `${ticker} removed from Watchlist.`
    this.actionwatch = "Sell"
  this.iconClass = 'bi bi-star h4'
  this.WatchListService.deleteWatchList(`/delete/${ticker}`).subscribe({
    next: (data)=> console.log(data),
    error: (error)=> console.log(error)
  })
}
}

open(ticker: string , action: string){
  if(action=='Buy'){
    this.buymessage = `${this.Data.company.ticker} bought successfully`
    this.buyAction=action
  }
  else if(action=='Sell') {
    this.sellmessage = `${this.Data.company.ticker} sold successfully`
    this.sellAction=action
  }
  this.PortfolioService.getPortfolio(`/portfolio/${ticker}`).subscribe(data =>{
    const modalRef = this.modalService.open(NewsModalComponent);
    modalRef.componentInstance.ticker = this.Data.company.ticker
  modalRef.componentInstance.price = this.stockData.stock.c
  modalRef.componentInstance.name = this.Data.company.name
  modalRef.componentInstance.balance = this.balance
  modalRef.componentInstance.action = action
    if(data!=null){
      this.PortfolioSharingService.sendData(data)
      this.portfolio = data
      modalRef.componentInstance.portfolio = this.portfolio
    }
    else {
      modalRef.componentInstance.portfolio = this.portfolio
    } 
    modalRef.componentInstance.isBuyDoneEmitter.subscribe((isDone : boolean)=> {
      this.isBuyDone = isDone
      setTimeout(() => {
        this.isBuyDone = false;
      }, 5000);
    })
    modalRef.componentInstance.isSellDoneEmitter.subscribe((isDone : boolean)=> {
      this.isSellDone = isDone
      setTimeout(() => {
        this.isSellDone = false;
      }, 5000);
    })
  })

  
}
}

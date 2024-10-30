import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { switchMap } from 'rxjs';
import { Money, Portfolio } from '../../types';
import { PortfolioService } from '../services/portfolio.service';
import { PortfolioShareService } from '../services/portfolio-share.service'
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BalanceshareService } from '../services/balanceshare.service';
import { NgbdAlertSelfclosing } from '../alert-selfclosing/alert-selfclosing.component';
import { IsAvailService } from '../services/is-avail.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RefreshService } from '../services/refresh.service';


@Component({
	selector: 'app-transcation-modal',
	standalone: true,
  imports: [CommonModule,NgFor],
	templateUrl: './port-trans.component.html',
  styleUrl: './port-trans.component.css'
})
export class NewsModalComponent {
	activeModal = inject(NgbActiveModal);
  TotalPrice: number = 0.00
  portfolio!: Portfolio
  money!: Money
  isbuyDone : boolean = false
  issellDone : boolean = false
  new_quantity: number=0
  current_input : number=0
  @Input() ticker: string ='';
	@Input() price:  number= 0.00;
  @Input() name : string ='';
  @Input() avg_cost:  number= 0.00;
  @Input() change:  number= 0.00;
  @Input() market_val:  number= 0.00;
  @Input() quantity:  number= 0.00;
  @Input() total_cost:  number= 0.00;
  @Input() Balance : number=0.00;
  @Input() action:  string = '';
  @Output() isBuyDoneEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() isSellDoneEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();


  constructor(private PortfolioService: PortfolioService,
    private PortfolioShareService: PortfolioShareService,
    private BalanceShare: BalanceshareService,
    private IsAvail : IsAvailService,
    private QuoteService: RefreshService){
  }

  onInput(event: Event){
    const InputVal = (event.target as HTMLInputElement).value;
    this.TotalPrice = this.price * Number(InputVal)
    this.current_input = Number(InputVal)
    if (this.action=='Buy'){
      this.new_quantity = Number(InputVal) + this.quantity
    }
    else if (this.action=='Sell'){
      this.new_quantity = this.quantity - Number(InputVal)
      this.total_cost = this.total_cost - (this.avg_cost * Number(InputVal))
    }
    
  }

  isInteger(value: any){
    return Number.isInteger(value);
  }

   buystock(ticker:string){

    // this.fetchnewprice(ticker)
    if (this.action=='Buy') {
      this.isbuyDone=true
      this.Balance = this.Balance -  this.TotalPrice 
    this.total_cost = this.TotalPrice + this.total_cost
    this.avg_cost = this.total_cost/this.new_quantity}
    else if (this.action=='Sell') {
      this.issellDone=true
      this.Balance = this.Balance +  this.TotalPrice 
      // this.total_cost = this.total_cost - this.TotalPrice 
      this.avg_cost = this.total_cost/this.new_quantity
    }
    this.portfolio = {
      _id: ticker,
      name: this.name,
      price: this.price,
      total_cost: this.total_cost,
      quantity: this.new_quantity,
      avg_cost: this.avg_cost,
      market_val: this.price * this.new_quantity,
      change : this.price- parseFloat(this.avg_cost.toFixed(2))
    }

    this.money = {
      _id: 'money',
      balance: this.Balance
    }
    this.isBuyDoneEmitter.emit(this.isbuyDone);
    this.isSellDoneEmitter.emit(this.issellDone);
    this.PortfolioService.editBalance(`/portfolio/update/money`, this.money).pipe(
  switchMap(() => {
    if(this.action=='Sell' && this.portfolio.quantity==0){
      this.IsAvail.updateIsAvail(false)
      return this.PortfolioService.deletePortfolio(`/portfolio/delete/${ticker}`)
    }
    else {
   
    return this.PortfolioService.editPortfolio(`/portfolio/update/${ticker}`, this.portfolio);}
  }),
  switchMap(() => {
   
    return this.PortfolioService.getPortfolioAll('/portfolio/all');
  }),
  switchMap((portfolio) => {
    this.PortfolioShareService.sendData(portfolio);
    // Now fetch balance
    return this.PortfolioService.getBalance('/portfolio/money');
  })
).subscribe((balance) => {
 
  this.BalanceShare.sendData(balance);
}, (error) => {
  
  console.log(error);
});
  }

}






@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [NgFor,CommonModule,NgIf,NgbdAlertSelfclosing,MatProgressSpinnerModule],
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.css'
})
export class PortfolioComponent {

  // private subscription : Subscription
  private modalService = inject(NgbModal);
  Data! : Portfolio[]
  Empty: boolean = true
  Balance : number=0.00
  isDone: boolean = false
  isBuyDone: boolean = false
  isSellDone: boolean = false
  message: string =''
  buymessage: string =''
  sellmessage: string =''
  action: string =''
  buyaction: string =''
  sellaction: string =''
  isLoadingData : boolean = true
  dataFetched: boolean=false
  constructor( private PortfolioShare : PortfolioShareService,
    private BalanceShare : BalanceshareService,
    private QuoteService : RefreshService){
  }

  ngOnInit() {
    
      this.BalanceShare.data$.subscribe((data)=> {
        console.log("Debugging",data)
        
        this.Balance = data.balance
      })
      this.loadData();
  }
  
  
  updatePrice(){
    if (Object.keys(this.Data).length != 0 && !this.dataFetched){
    this.Data.forEach((watch)=> {
      this.QuoteService.getRefresh('http://localhost:3000/quote', { name: watch._id }).subscribe((stockdata)=> {
       watch.price = stockdata.stock.c
       watch.change = parseFloat(watch.price.toFixed(2)) - parseFloat(watch.avg_cost.toFixed(2))
       watch.market_val = watch.price * watch.quantity
       this.dataFetched = true
      })  
    })}
    this.isLoadingData=false

  }

  loadData(){
    this.PortfolioShare.data$.subscribe((data)=> {
      this.Data = data;
      if(this.Data.length>0){
        this.Empty = false;
        this.updatePrice()
      }
      else {
        this.Empty = true;
        this.isLoadingData=false
        return;
      }
    })
  }

  parseFloat(x:string){
    return parseFloat(x)
  }

  open(ticker: string , name: string, price: number, avg_cost:number, change:number,market_val:number,quantity:number,total_cost:number, action: string){
  
    if(action=='Buy'){
      this.buymessage = `${ticker} bought successfully`
      this.buyaction = action
    }
    else if(action=='Sell') {
      this.sellmessage = `${ticker} sold successfully`
      this.sellaction=action
    }
      const modalRef = this.modalService.open(NewsModalComponent);
      modalRef.componentInstance.ticker = ticker
    modalRef.componentInstance.price = price
    modalRef.componentInstance.name = name
    modalRef.componentInstance.avg_cost = avg_cost
    modalRef.componentInstance.change = change
    modalRef.componentInstance.market_val = market_val
    modalRef.componentInstance.quantity = quantity
    modalRef.componentInstance.total_cost = total_cost
    modalRef.componentInstance.Balance = this.Balance
    modalRef.componentInstance.action = action
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
  }

  
}

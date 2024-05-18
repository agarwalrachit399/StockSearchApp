import { Component, Input } from '@angular/core';
import { CompanyService } from '../services/company.service';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule,ReactiveFormsModule } from '@angular/forms';
import { AutoComplete } from '../../types';
import { CompanydescComponent } from '../companydesc/companydesc.component';
import { TabsComponent } from '../tabs/tabs.component';
import { Router } from '@angular/router';
import { SharingServiceService } from '../services/sharing-service.service';
import { AutocompService } from '../services/autocomp.service';
import {AsyncPipe} from '@angular/common';
import {MatAutocompleteModule, MatAutocompleteSelectedEvent, MatAutocompleteTrigger} from '@angular/material/autocomplete';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { Observable,  forkJoin, of, tap } from 'rxjs';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { RefreshService } from '../services/refresh.service';
import { PortfolioService } from '../services/portfolio.service';
import { BalanceshareService } from '../services/balanceshare.service';
import { QuoteshareService } from '../services/quoteshare.service';
import { NgbdAlertSelfclosing } from '../alert-selfclosing/alert-selfclosing.component';
import { IsAvailService } from '../services/is-avail.service';
import { WatchlistService } from '../services/watchlist.service';
import { FormvalService } from '../services/formval.service';

@Component({
  selector: 'app-searchform',
  standalone: true,
  imports: [CommonModule,FormsModule,CompanydescComponent,TabsComponent, MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    AsyncPipe, MatProgressSpinnerModule, NgbdAlertSelfclosing],
  templateUrl: './searchform.component.html',
  styleUrl: './searchform.component.css'
})
export class SearchformComponent {
  @Input() name!: string;
  textInput = document.getElementById('stock')
  AutoData: AutoComplete[]=[]
  options : string[] |null =[]
  myControl = new FormControl('');
  filteredOptions!: Observable<string[]>;
  notick: Boolean=false
  alert_text: string = 'Please enter a valid ticker'
  isSellAvail : boolean = false
  isStarred : boolean = false
  isLoading: boolean=false;
  isLoadingData: boolean = false
  isRefreshEnabled: boolean = false
  constructor (
    private SharingService : SharingServiceService,
    private router: Router,
    private companyService: CompanyService,
    private autoService : AutocompService,
    private PortfolioService : PortfolioService,
    private BalanceShare : BalanceshareService,
    private IsAvail : IsAvailService,
    private WatchListService : WatchlistService,
    private QuoteService : RefreshService,
    private QuoteShare : QuoteshareService,
    private FormValShare : FormvalService,
  ) { 
    this.IsAvail.isLoad$.subscribe((load)=> {
      this.isLoadingData = load
    })
  }
    
    
  submitForm(autoTrigger: MatAutocompleteTrigger) {
    if (this.name == undefined)
    {this.notick=true
    return}
    this.name = this.name.toUpperCase()
    autoTrigger.closePanel()
    this.IsAvail.updateSpinner(true)

    this.PortfolioService.getBalance('/portfolio/money').subscribe((balance)=>{
        this.BalanceShare.sendData(balance)
    })
    this.PortfolioService.getPortfolio(`/portfolio/${this.name}`).subscribe((portfolio)=> {
      if (portfolio!=null)
      {
        this.isSellAvail=true
      }
      this.IsAvail.updateIsAvail(this.isSellAvail)
    })

    this.WatchListService.getWatchListOne(`/watchlist/${this.name}`).subscribe((watchlist)=> {
      if (watchlist!=null)
      {
        this.isStarred = true
      }
      this.IsAvail.updateIsStarAvail(this.isStarred)
    })
    this.QuoteService.getRefresh('/quote',{name: this.name}).subscribe((stock)=> {
      this.QuoteShare.sendData(stock)
    })
    this.companyService.getCompany('/company',{name: this.name}).subscribe((company) => {
      if (Object.keys(company.company).length == 0)
      {this.isLoadingData = false
        // setTimeout(() => {
        // }, 50);
        this.alert_text="No data found. Please Enter a Valid Ticker"
      this.notick=true
        this.options=[]
    return}
      
      
    
      this.SharingService.sendData(company)
      this.IsAvail.updateRefresh(this.name)
      this.autoRefresh()
      
      this.router.navigate(['/search',this.name]);
      this.IsAvail.updateSpinner(false)
    })
  }

  submitForm2(auto:string) {
    
    this.IsAvail.updateSpinner(true)
    this.IsAvail.updateRefresh(auto)
    forkJoin([
      this.QuoteService.getRefresh('/quote', { name: auto}),
      this.companyService.getCompany('/company', { name: auto }),
      this.WatchListService.getWatchListOne(`/watchlist/${auto}`),
      this.PortfolioService.getPortfolio(`/portfolio/${auto}`)
    ]).pipe(
      tap(([stock, company, watch, port]) => {
        console.log("Debugging is back",watch)
        if(watch!=null)
          {
            this.IsAvail.updateIsStarAvail(true)
          }
          else{
            this.IsAvail.updateIsStarAvail(false)
          }
         if(port!=null)
          {
            this.IsAvail.updateIsAvail(true)
          }
          else{
            this.IsAvail.updateIsAvail(false)
          } 
        this.QuoteShare.sendData(stock); 
        this.SharingService.sendData(company); 
        this.isRefreshEnabled=true
        this.autoRefresh(); 
      })
    ).subscribe(() => {
      this.router.navigate(['/search', auto]);
      this.IsAvail.updateSpinner(false)
    });
    
  }

  resetForm(){
    this.name = ''
    this.notick=false
    this.router.navigateByUrl('/')
    this.IsAvail.updateRefresh('')
    
  }
  
  auto(InputVal: string){
    this.isLoading=true
    this.autoService.getAuto('/tick',{name: InputVal}).subscribe((autoData) => {
      this.isLoading=false
    
      this.AutoData= autoData.autocomplete.filter(obj=> obj.type==='Common Stock' && !obj.symbol.includes('.'))
      if (this.AutoData.length==0)
      {
        this.options=[]
        this.filteredOptions = of(this.options)
      //   this.alert_text="No data found. Please Enter a Valid Ticker"
      // this.notick=true

    return
      }
      
      this.options = this.AutoData.map(obj=> `${obj.symbol} | ${obj.description}`)
      this.filteredOptions = of(this.options);
    })
  }


  onInput(event:Event){
    const InputVal = (event.target as HTMLInputElement).value;
    this.FormValShare.setSearchValue(InputVal);
    this.auto(InputVal)

  }

  onOptionSelected(event: MatAutocompleteSelectedEvent) {
    const selectedOption = event.option.viewValue; // Get the selected option value
    const symbol = selectedOption.split('|')[0].trim()
    this.name = symbol
    this.submitForm2(symbol) // Call your function with the selected option value
  }

  formatOption(option:any):string{
    if (option == undefined) {
      return ""
    }
    const symbol = (option.split("|")[0].trim())
 return  symbol
  }

  autoRefresh() {
    setInterval(() => {
      this.IsAvail.isRefresh$.subscribe((name)=>{
          if(name==''){
            return
          }
          this.QuoteService.getRefresh('/quote',{name: name}).subscribe((stockData) => {
            this.QuoteShare.sendData(stockData)
          })}
          )
    }, 15000);
  }

  
}

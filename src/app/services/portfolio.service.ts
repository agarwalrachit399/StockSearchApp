import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { Money, Portfolio, QueryParams } from '../../types';

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {

  constructor(private apiService: ApiService) { }


  getPortfolioAll = (url:string): Observable<Portfolio[]> => {
    return this.apiService.get(url,{
      responseType: 'json',
    })
  };

  getPortfolio = (url:string): Observable<Portfolio> => {
    return this.apiService.get(url,{
      responseType: 'json',
    })
  };

  editPortfolio = (url:string,body:Portfolio): Observable<Portfolio> => {
    return this.apiService.put(url,body,{})
  };

  editBalance = (url:string,body:Money): Observable<Money> => {
    return this.apiService.put2(url,body,{})
  };


  getBalance = (url:string): Observable<Money> => {
    return this.apiService.get(url,{
      responseType: 'json',
    })
  };

  deletePortfolio = (url:string) : Observable<any> => {
    return this.apiService.delete(url, {});
  }
}



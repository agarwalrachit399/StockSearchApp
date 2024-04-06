import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { StockQuote } from '../../types';

@Injectable({
  providedIn: 'root'
})
export class QuoteshareService {
  private dataSubject = new BehaviorSubject<StockQuote>({} as StockQuote);
  public data$ = this.dataSubject.asObservable();

  constructor() { }

  sendData(data: any) {
    this.dataSubject.next(data);
  }
}

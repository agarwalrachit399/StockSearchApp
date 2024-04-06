import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Portfolio } from '../../types';

@Injectable({
  providedIn: 'root'
})
export class PortfolioShareService {
  private dataSubject = new BehaviorSubject<Portfolio[]>({} as Portfolio[]);
  public data$ = this.dataSubject.asObservable();

  constructor() { }

  sendData(data: any) {
    this.dataSubject.next(data);
  }
}

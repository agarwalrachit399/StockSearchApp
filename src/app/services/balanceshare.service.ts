import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Money } from '../../types';

@Injectable({
  providedIn: 'root'
})
export class BalanceshareService {
  private dataSubject = new BehaviorSubject<Money>({} as Money);
  public data$ = this.dataSubject.asObservable();

  constructor() { }

  sendData(data: any) {
    this.dataSubject.next(data);
  }
}

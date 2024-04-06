import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { hourlyData } from '../../types';

@Injectable({
  providedIn: 'root'
})
export class HourlyshareService {

  private dataSubject = new BehaviorSubject<hourlyData>({} as hourlyData);
  public data$ = this.dataSubject.asObservable();

  constructor() { }

  sendData(data: any) {
    this.dataSubject.next(data);
  }
}

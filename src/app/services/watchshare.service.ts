import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { WatchList } from '../../types';

@Injectable({
  providedIn: 'root'
})
export class WatchshareService {
  private dataSubject = new BehaviorSubject<WatchList[]>({} as WatchList[]);
  public data$ = this.dataSubject.asObservable();

  constructor() { }

  sendData(data: any) {
    this.dataSubject.next(data);
  }
}

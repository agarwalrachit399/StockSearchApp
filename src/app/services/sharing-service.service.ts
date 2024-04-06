import { Injectable } from '@angular/core';
import { Company } from '../../types';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharingServiceService {
  private dataSubject = new BehaviorSubject<Company>({} as Company);
  public data$ = this.dataSubject.asObservable();

  constructor() { }

  sendData(data: any) {
    this.dataSubject.next(data);
  }
}

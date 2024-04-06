import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IsAvailService {

  private isAvailSubject = new BehaviorSubject<boolean>(false);
  private isAvailSubject2 = new BehaviorSubject<boolean>(false);  
  private isLoading = new BehaviorSubject<boolean>(false);
  private refreshEnable = new BehaviorSubject<string>(''); 
  isSellAvail$: Observable<boolean> = this.isAvailSubject.asObservable();
  isStarAvail$: Observable<boolean> = this.isAvailSubject2.asObservable();
  isLoad$: Observable<boolean> = this.isLoading.asObservable();
  isRefresh$: Observable<string> = this.refreshEnable.asObservable();

  constructor() { }

  updateIsAvail(isSellAvail: boolean) {
    this.isAvailSubject.next(isSellAvail);
  }

  updateIsStarAvail(isStarAvail: boolean) {
    this.isAvailSubject2.next(isStarAvail);
  }
  updateSpinner(isLoading:boolean){
    this.isLoading.next(isLoading)
  }
  updateRefresh(isRefresh:string){
    this.refreshEnable.next(isRefresh)
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormvalService {

  private searchValueSubject = new BehaviorSubject<string>('');
  searchValue$ = this.searchValueSubject.asObservable();

  constructor() {}

  setSearchValue(value: string) {
    this.searchValueSubject.next(value);
  }
}

import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { QueryParams, StockQuote } from '../../types';
import { Observable, interval, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RefreshService {

  constructor(private apiService: ApiService) {}

  getRefresh(url: string, params: QueryParams): Observable<StockQuote> {
    return this.apiService.get<StockQuote>(url, {
          params,
          responseType: 'json',
        })
  }
}



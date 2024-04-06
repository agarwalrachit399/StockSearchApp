import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { QueryParams, WatchList } from '../../types';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WatchlistService {

  constructor(private apiService: ApiService) {}

    
    getWatchList = (url:string): Observable<WatchList[]> => {
      return this.apiService.get(url,{
        responseType: 'json',
      })
    };

    getWatchListOne = (url:string): Observable<WatchList> => {
      return this.apiService.get(url,{
        responseType: 'json',
      })
    };

    addWatchList = (url: string,body:WatchList): Observable<WatchList>=> {
      return this.apiService.post(url,body,{});
    }

    deleteWatchList = (url:string) : Observable<any> => {
      return this.apiService.delete(url, {});
    }
}

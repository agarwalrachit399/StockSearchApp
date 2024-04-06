import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { AutoData, QueryParams } from '../../types';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AutocompService {

    constructor(private apiService: ApiService) {}

    getAuto = (url:string,params:QueryParams): Observable<AutoData> => {
      return this.apiService.get(url,{
        params,
        responseType: 'json',
      })
    }
  }

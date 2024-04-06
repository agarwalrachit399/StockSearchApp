import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { Company, QueryParams, hourlyData } from '../../types';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  constructor(private apiService: ApiService) {}

    getCompany = (url:string,params:QueryParams): Observable<Company> => {
      return this.apiService.get(url,{
        params,
        responseType: 'json',
      })
    };

    getHourlyData = (url:string,params:QueryParams): Observable<hourlyData> => {
      return this.apiService.get(url,{
        params,
        responseType: 'json',
      })
    };
}

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environment/enviroment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  baseUrl: string = environment.api.apiUrl;


  get(endpoint: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${endpoint}`);
  }
  partiallyGet(endpoint: string, queryParams?: HttpParams): Observable<any> {
    const options = {
      params: queryParams
    };
    debugger;
    return this.http.get(`${this.baseUrl}/${endpoint}`, options);
  }
  post(endpoint: string, data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/${endpoint}`, data);
  }
  put(endpoint: string, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${endpoint}`, data);
  }
  delete(endpoint: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${endpoint}`);
  }
  partiallyUpdate(endpoint: string, id: number, data: any): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${endpoint}/${id}`, data);
  }
}


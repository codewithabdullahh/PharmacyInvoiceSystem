import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { Company, Customer, Product } from '../Model/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private apiService: ApiService) { }

  getAllCompany(): Observable<any> {
    return this.apiService.get(`Product/getAllCompany`);
  }
  updateCompany(data: Company): Observable<any> {
    debugger;
    var body = {
      ...data
    };
    return this.apiService.put(`Product/updateCompany/${data.companyId}`, body);
  }
  addCompany(data: Company): Observable<any> {
    debugger;
    var body = {
      ...data
    };
    return this.apiService.post(`Product/insertCompany`, body);
  }
  getAllCustomer(): Observable<any> {
    return this.apiService.get(`Product/getAllCustomer`);
  }
  updateCustomer(data: Customer): Observable<any> {
    debugger;
    var body = {
      ...data
    };
    return this.apiService.put(`Product/updateCustomer/${data.customerId}`, body);
  }
  addCustomer(data: Customer): Observable<any> {
    debugger;
    var body = {
      ...data
    };
    return this.apiService.post(`Product/insertCustomer`, body);
  }
  getAllProduct(): Observable<any> {
    return this.apiService.get(`Product/getAllProduct`);
  }
  updateProduct(data: Product): Observable<any> {
    debugger;
    var body = {
      ...data
    };
    return this.apiService.put(`Product/updateProduct/${data.productId}`, body);
  }
  addProduct(data: Product): Observable<any> {
    debugger;
    var body = {
      ...data
    };
    return this.apiService.post(`Product/insertProduct`, body);
  }
}

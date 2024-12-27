import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Company, Customer, Product } from '../Model/product';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  private dataCompanySubject = new BehaviorSubject<Company[]>([]);
  getDataCompany(): Company[] {
    return this.dataCompanySubject.value;
  }
  setDataCompany(data: Company[]): void {
    this.dataCompanySubject.next(data);
  }
  hasDataCompany(): boolean {
    const value = this.dataCompanySubject.value;
    return value !== null && value.length > 0;
  }
  private dataCustomerSubject = new BehaviorSubject<Customer[]>([]);
  getDataCustomer(): Customer[] {
    return this.dataCustomerSubject.value;
  }
  setDataCustomer(data: Customer[]): void {
    this.dataCustomerSubject.next(data);
  }
  hasDataCustomer(): boolean {
    const value = this.dataCustomerSubject.value;
    return value !== null && value.length > 0;
  }

  private dataProductSubject = new BehaviorSubject<Product[]>([]);
  getDataProduct(): Product[] {
    return this.dataProductSubject.value;
  }
  setDataProduct(data: Product[]): void {
    this.dataProductSubject.next(data);
  }
  hasDataProduct(): boolean {
    const value = this.dataProductSubject.value;
    return value !== null && value.length > 0;
  }
}

import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(private apiService: ApiService) { }

  addReport(data: any): Observable<any> {
    debugger;
    var body = {
      ...data
    };
    return this.apiService.post(`Product/insertBill`, body);
  }
  updateReport(data: any): Observable<any> {
    debugger;
    var body = {
      ...data
    }
    return this.apiService.put(`Product/updateBill/${data.reportId}/${data.customerId}`, body);
  }
  getEditReportData(reportId: any, customerId: any): Observable<any> {
    debugger;
    return this.apiService.get(`Product/getEditReport/${reportId}/${customerId}`);
  }
  getReportForSearch(data: any, pageNo: number, pageSize: number) {
    debugger;
    let params = new HttpParams()
      .set('PageNo', pageNo)
      .set('PageSize', pageSize)
      .set('CustomerCode', data.customerCode)
      .set('CustomerName', data.customerName)
      .set('IssueDate', data.issueDate)

    return this.apiService.partiallyGet('Product/getSearchReport', params);
  }
  getReportData(reportId: string | null, customerId: string | null): Observable<any> {
    return this.apiService.get(`Product/getReportData/${reportId}/${customerId}`);
  }
}

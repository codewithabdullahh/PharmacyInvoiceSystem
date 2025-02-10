import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchReportComponent } from './search-report/search-report.component';
import { AddEditReportComponent } from './add-edit-report/add-edit-report.component';
import { ViewReportComponent } from './view-report/view-report.component';

const routes: Routes = [
  { path: 'searchBill', component: SearchReportComponent },
  { path: 'addEditBill/:reportId/:customerId', component: AddEditReportComponent },
  { path: 'viewBill/:reportId/:customerId', component: ViewReportComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportRoutingModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportRoutingModule } from './report-routing.module';
import { SearchReportComponent } from './search-report/search-report.component';
import { AddEditReportComponent } from './add-edit-report/add-edit-report.component';
import { ViewReportComponent } from './view-report/view-report.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';
import { SetupSearchPipe } from './setup-search.pipe';


@NgModule({
  declarations: [
    SearchReportComponent,
    AddEditReportComponent,
    ViewReportComponent,
    SetupSearchPipe,
  ],
  imports: [
    CommonModule,
    ReportRoutingModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgxPaginationModule,
    FormsModule,
  ]
})
export class ReportModule { }

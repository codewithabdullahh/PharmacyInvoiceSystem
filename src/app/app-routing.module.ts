import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompanyComponent } from './company/company.component';
import { ProductComponent } from './product/product.component';
import { CustomerComponent } from './customer/customer.component';
import { LayoutComponent } from './layout/layout.component';
import { ViewBillComponent } from './view-bill/view-bill.component';

const routes: Routes = [
  {
    path: 'main', component: LayoutComponent, children: [
      { path: "company", component: CompanyComponent },
      { path: "product", component: ProductComponent },
      { path: "customer", component: CustomerComponent },
      { path: '', loadChildren: () => import('./report/report.module').then(m => m.ReportModule) }
    ]
  },
  { path: "viewBill/:reportId/:customerId", component: ViewBillComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

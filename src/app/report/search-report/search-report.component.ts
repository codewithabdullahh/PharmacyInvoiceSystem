import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ReportService } from '../../Services/report.service';
import { finalize } from 'rxjs';
import { NotificationService } from '../../Services/notification.service';
import { ReportSearch } from '../../Model/report';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-report',
  templateUrl: './search-report.component.html',
  styleUrl: './search-report.component.css'
})
export class SearchReportComponent {

  isSearching: boolean = false;
  searched: boolean = false;
  loadingRowIndex: number | null = null;
  themeMenu: boolean = false;
  toggleMenuIndex: number | null = null;

  btnTxt = 'Search'
  searchFilter: any = '';
  pageNo: number = 1;
  orderBy: any = 'serialNo';
  pageSize: number = 15;
  totalItems: number = 0;

  submitted = false;
  reportSearchForm!: FormGroup;
  reportSearchResponse: ReportSearch[] = [];

  constructor(private formBuilder: FormBuilder,
    private reportService: ReportService,
    private notificationService: NotificationService,
    private router: Router) { }

  ngOnInit() {
    this.reportSearchForm = this.formBuilder.group({
      customerName: new FormControl(''),
      customerCode: new FormControl(''),
      issueDate: new FormControl(''),
    })
  }
  resetSearchOption() {

  }
  searchedData(pageNo: number) {
    debugger;
    this.searched = false;
    if (this.reportSearchForm.invalid) {
      this.searched = true;
      return;
    }
    this.isSearching = true;

    this.reportService.getReportForSearch(
      this.reportSearchForm.value, pageNo, this.pageSize).pipe(
        finalize(() => (this.isSearching = false))).subscribe({
          next: (data) => {
            debugger;
            this.reportSearchResponse = data;
            if (this.reportSearchResponse.length > 0) {
              this.totalItems = data[0].totalItems;
            }
            this.pageNo = pageNo;
            console.log(this.reportSearchResponse)
          },
          error: (err) => {
            this.notificationService.excpetionHandle(err);
            debugger;
          }
        });
  }
  getTotal() {
    debugger;
    if (this.reportSearchResponse.length > 0) {
      this.totalItems = this.reportSearchResponse[0].totalItems;
      return this.reportSearchResponse[0].totalItems;
    }
    this.totalItems = 0;
    return 0;
  }
  getNextPage(pageNo: number) {
    debugger;
    this.searchedData(pageNo);
  }
  toggleMenuOptions(index: number): void {

    if (this.toggleMenuIndex === index) {
      this.toggleMenuIndex = null;
    } else {
      this.toggleMenuIndex = index;
    }
  }
  addNewBill() {
    this.router.navigate(['/main/addEditBill', '', '']);
  }

}

import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Company } from '../Model/product';
import { Subscription, finalize } from 'rxjs';
import { ProductService } from '../Services/product.service';
import { ValidationPatterns } from '../Model/ValidationPatters';
import { StorageService } from '../Services/storage.service';
import { NotificationService } from '../Services/notification.service';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrl: './company.component.css'
})
export class CompanyComponent {
  error: string = "";
  isGridLoading: boolean = false;
  isSubmitting: boolean = false;
  Btntxt: string = "Add Company";
  submitted: boolean = false;
  selectedIndex: any;
  searchFilter: any = '';
  pageNo: any;

  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  companyForm!: FormGroup;
  companyResponse: Company[] = [];
  private dataSubscription = new Subscription();

  constructor(
    private formBuilder: FormBuilder,
    private notificationService: NotificationService,
    private storageService: StorageService,
    private productService: ProductService) {
  }


  ngOnInit(): void {
    this.companyForm = this.formBuilder.group({
      companyId: new FormControl(''),
      companyName: new FormControl('', Validators.compose([Validators.maxLength(50), Validators.required, Validators.pattern(ValidationPatterns.string)])),
    })
    this.getAll();
    this.Btntxt = "Add Company";
  }
  getAll() {
    debugger;
    this.companyResponse = [];
    this.isGridLoading = true;
    if (this.storageService.hasDataCompany()) {
      debugger;
      this.companyResponse = this.storageService.getDataCompany();
      this.isGridLoading = false;
    }
    else {
      debugger;
      this.dataSubscription = this.productService.getAllCompany().pipe(
        finalize(() => (this.isGridLoading = false))).subscribe({
          next: (data: any) => {
            debugger;
            this.companyResponse = data;
            this.storageService.setDataCompany(this.companyResponse);
          },
          complete: () => { },
          error: (err: any) => {
            debugger;
            this.notificationService.excpetionHandle(err)
          }
        });
    }
  }
  getTotal() {
    if (this.companyResponse.length > 0) {
      return this.companyResponse.length;
    }
    return 0;
  }
  onSearchChange(event: any) {
    this.pageNo = 1;
  }
  onSubmit() {
    debugger;
    if (this.companyForm.invalid) {
      this.submitted = true;
      return;
    }

    this.isSubmitting = true;
    const isUpdate = !!this.companyForm.value.companyId;

    const request$ = isUpdate
      ? this.productService.updateCompany(this.companyForm.value)
      : this.productService.addCompany(this.companyForm.value);
    debugger;
    this.dataSubscription = request$.pipe(
      finalize(() => (this.isSubmitting = false))).subscribe({
        next: (data: any) => {
          debugger;
          if (data.statusCode == 409) {
            this.notificationService.warning('Company Already Exists.', 'Already Exists');
          } else {
            const successMessage = isUpdate ? 'Updated' : 'Added';
            this.handleSuccess(data, successMessage);
          }
        },
        error: (err: any) => {
          debugger;
          this.notificationService.excpetionHandle(err);
        }
      }
      );
  }
  editCompany(Company: any, i: any) {
    this.selectedIndex = i;
    this.Btntxt = "Update Company";
    this.companyForm.controls['companyId'].setValue(Company.companyId);
    this.companyForm.controls['companyName'].setValue(Company.companyName);
  }

  private handleSuccess(data: any, action: string) {
    debugger;
    if (action === 'Updated') {
      const index = this.companyResponse.findIndex((item) => item.companyId === data.companyId);
      if (index !== -1) {
        this.companyResponse[index] = data;
      }
    } else {
      this.companyResponse.push(data);
    }
    this.storageService.setDataCompany(this.companyResponse);
    this.clear();
    this.notificationService.success(`Company Successfully ${action}.`, `Company ${action}`);
  }

  clear() {
    this.submitted = false;
    this.Btntxt = "Add Company";
    this.searchFilter = '';
    this.companyForm.reset({
      companyId: '',
      companyName: ''
    });
  }
  ngOnDestroy(): void {
    this.dataSubscription.unsubscribe();
  }
  sortTable(column: keyof Company) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.companyResponse.sort((a, b) => {
      const aValue = a[column];
      const bValue = b[column];
      return this.sortDirection === 'asc'
        ? aValue > bValue
          ? 1
          : -1
        : bValue > aValue
          ? 1
          : -1;
    });
  }
}

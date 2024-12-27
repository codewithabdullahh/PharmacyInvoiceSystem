import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Customer } from '../Model/product';
import { Subscription, finalize } from 'rxjs';
import { NotificationService } from '../Services/notification.service';
import { StorageService } from '../Services/storage.service';
import { ProductService } from '../Services/product.service';
import { ValidationPatterns } from '../Model/ValidationPatters';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrl: './customer.component.css'
})
export class CustomerComponent {
  error: string = "";
  isGridLoading: boolean = false;
  isSubmitting: boolean = false;
  Btntxt: string = "Add Customer";
  submitted: boolean = false;
  selectedIndex: any;
  searchFilter: any = '';
  pageNo: any;

  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  customerForm!: FormGroup;
  customerResponse: Customer[] = [];
  private dataSubscription = new Subscription();

  constructor(
    private formBuilder: FormBuilder,
    private notificationService: NotificationService,
    private storageService: StorageService,
    private productService: ProductService) {
  }


  ngOnInit(): void {
    this.customerForm = this.formBuilder.group({
      customerId: new FormControl(''),
      customerName: new FormControl('', Validators.compose([Validators.maxLength(100), Validators.required, Validators.pattern(ValidationPatterns.string)])),
      customerCode: new FormControl('', Validators.compose([Validators.maxLength(50), Validators.required])),
      customerAddress: new FormControl('', Validators.compose([Validators.maxLength(250), Validators.required])),
    })
    this.getAll();
    this.Btntxt = "Add Customer";
  }
  getAll() {
    debugger;
    this.customerResponse = [];
    this.isGridLoading = true;
    if (this.storageService.hasDataCustomer()) {
      debugger;
      this.customerResponse = this.storageService.getDataCustomer();
      this.isGridLoading = false;
    }
    else {
      debugger;
      this.dataSubscription = this.productService.getAllCustomer().pipe(
        finalize(() => (this.isGridLoading = false))).subscribe({
          next: (data: any) => {
            debugger;
            this.customerResponse = data;
            this.storageService.setDataCustomer(this.customerResponse);
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
    if (this.customerResponse.length > 0) {
      return this.customerResponse.length;
    }
    return 0;
  }
  onSearchChange(event: any) {
    this.pageNo = 1;
  }
  onSubmit() {
    debugger;
    if (this.customerForm.invalid) {
      this.submitted = true;
      return;
    }

    this.isSubmitting = true;
    const isUpdate = !!this.customerForm.value.customerId;

    const request$ = isUpdate
      ? this.productService.updateCustomer(this.customerForm.value)
      : this.productService.addCustomer(this.customerForm.value);
    debugger;
    this.dataSubscription = request$.pipe(
      finalize(() => (this.isSubmitting = false))).subscribe({
        next: (data: any) => {
          debugger;
          if (data.statusCode == 409) {
            this.notificationService.warning('Customer Already Exists.', 'Already Exists');
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
  editCustomer(customer: any, i: any) {
    this.selectedIndex = i;
    this.Btntxt = "Update Customer";
    this.customerForm.controls['customerId'].setValue(customer.customerId);
    this.customerForm.controls['customerName'].setValue(customer.customerName);
    this.customerForm.controls['customerCode'].setValue(customer.customerCode);
    this.customerForm.controls['customerAddress'].setValue(customer.customerAddress);
  }

  private handleSuccess(data: any, action: string) {
    debugger;
    if (action === 'Updated') {
      const index = this.customerResponse.findIndex((item) => item.customerId === data.customerId);
      if (index !== -1) {
        this.customerResponse[index] = data;
      }
    } else {
      this.customerResponse.push(data);
    }
    this.storageService.setDataCustomer(this.customerResponse);
    this.clear();
    this.notificationService.success(`Customer Successfully ${action}.`, `Customer ${action}`);
  }

  clear() {
    this.submitted = false;
    this.Btntxt = "Add Customer";
    this.searchFilter = '';
    this.customerForm.reset({
      customerId: '',
      customerName: '',
      customerCode: '',
      customerAddress: ''
    });
  }
  ngOnDestroy(): void {
    this.dataSubscription.unsubscribe();
  }
  sortTable(column: keyof Customer) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.customerResponse.sort((a, b) => {
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

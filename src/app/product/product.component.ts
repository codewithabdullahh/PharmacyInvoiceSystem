import { Component } from '@angular/core';
import { Company, Product } from '../Model/product';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription, finalize } from 'rxjs';
import { NotificationService } from '../Services/notification.service';
import { StorageService } from '../Services/storage.service';
import { ProductService } from '../Services/product.service';
import { ValidationPatterns } from '../Model/ValidationPatters';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent {
  error: string = "";
  isGridLoading: boolean = false;
  isSubmitting: boolean = false;
  Btntxt: string = "Add Product";
  submitted: boolean = false;
  selectedIndex: any;
  searchFilter: any = '';
  pageNo: any;

  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  productForm!: FormGroup;
  productResponse: Product[] = [];
  companyResponse: Company[] = [];
  private dataSubscription = new Subscription();

  constructor(
    private formBuilder: FormBuilder,
    private notificationService: NotificationService,
    private storageService: StorageService,
    private productService: ProductService) {
  }


  ngOnInit(): void {
    this.productForm = this.formBuilder.group({
      companyId: new FormControl([], Validators.required),
      productId: new FormControl(''),
      productName: new FormControl('', Validators.compose([Validators.maxLength(100), Validators.required, Validators.pattern(ValidationPatterns.string)])),
      retailPrize: new FormControl('', Validators.compose([Validators.required])),
      purchasePrize: new FormControl('', Validators.compose([Validators.required])),
      pack: new FormControl('', Validators.compose([Validators.maxLength(250), Validators.required])),
      retail_Net: new FormControl('', Validators.compose([Validators.required])),
    })
    this.getAllCompany();
    this.getAll();
    this.Btntxt = "Add Product";
  }
  getAllCompany() {
    this.companyResponse = [];
    if (this.storageService.hasDataCompany()) {
      debugger;
      this.companyResponse = this.storageService.getDataCompany();
    }
    else {
      this.dataSubscription = this.productService.getAllCompany().subscribe({
        next: (data: any) => {
          this.companyResponse = data;
        },
        error: (err: any)=>{
          this.notificationService.excpetionHandle(err)
        }
      })
    }
  }
  getAll() {
    debugger;
    this.productResponse = [];
    this.isGridLoading = true;
    if (this.storageService.hasDataProduct()) {
      debugger;
      this.productResponse = this.storageService.getDataProduct();
      this.isGridLoading = false;
    }
    else {
      debugger;
      this.dataSubscription = this.productService.getAllProduct().pipe(
        finalize(() => (this.isGridLoading = false))).subscribe({
          next: (data: any) => {
            debugger;
            this.productResponse = data;
            this.storageService.setDataProduct(this.productResponse);
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
    if (this.productResponse.length > 0) {
      return this.productResponse.length;
    }
    return 0;
  }
  onSearchChange(event: any) {
    this.pageNo = 1;
  }
  onSubmit() {
    debugger;
    if (this.productForm.invalid) {
      this.submitted = true;
      return;
    }

    this.isSubmitting = true;
    const isUpdate = !!this.productForm.value.productId;

    const request$ = isUpdate
      ? this.productService.updateProduct(this.productForm.value)
      : this.productService.addProduct(this.productForm.value);
    debugger;
    this.dataSubscription = request$.pipe(
      finalize(() => (this.isSubmitting = false))).subscribe({
        next: (data: any) => {
          debugger;
          if (data.statusCode == 409) {
            this.notificationService.warning('Product Already Exists.', 'Already Exists');
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
  editProduct(pro: any, i: any) {
    debugger
    this.selectedIndex = i;
    this.Btntxt = "Update Product";
    this.productForm.controls['companyId'].setValue(pro.companyId);
    this.productForm.controls['productId'].setValue(pro.productId);
    this.productForm.controls['productName'].setValue(pro.productName);
    this.productForm.controls['purchasePrize'].setValue(pro.purchasePrize);
    this.productForm.controls['pack'].setValue(pro.pack);
    this.productForm.controls['retailPrize'].setValue(pro.retailPrize);
    this.productForm.controls['retail_Net'].setValue(pro.retail_Net);
  }

  private handleSuccess(data: any, action: string) {
    debugger;
    if (action === 'Updated') {
      const index = this.productResponse.findIndex((item) => item.productId === data.productId);
      if (index !== -1) {
        this.productResponse[index] = data;
      }
    } else {
      this.productResponse.push(data);
    }
    this.storageService.setDataProduct(this.productResponse);
    this.clear();
    this.notificationService.success(`Product Successfully ${action}.`, `Product ${action}`);
  }

  clear() {
    this.submitted = false;
    this.Btntxt = "Add Product";
    this.searchFilter = '';
    this.productForm.reset({
      companyId: [],
      productId: '',
      productName: '',
      retailPrize: '',
      purchasePrize: '',
      pack: '',
      retail_Net: ''
    });
  }
  getCompanyName(companyId: string) {
    const com = this.companyResponse.filter(item => item.companyId === companyId);
    if (com.length > 0) {
      return com[0].companyName;
    }
    return "";
  }
  ngOnDestroy(): void {
    this.dataSubscription.unsubscribe();
  }
  sortTable(column: keyof Product) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.productResponse.sort((a, b) => {
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

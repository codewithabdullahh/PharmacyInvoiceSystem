import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../Services/product.service';
import { ValidationPatterns } from '../../Model/ValidationPatters';
import { Company, Customer, Product } from '../../Model/product';
import { StorageService } from '../../Services/storage.service';
import { NotificationService } from '../../Services/notification.service';
import { ReportService } from '../../Services/report.service';

@Component({
  selector: 'app-add-edit-report',
  templateUrl: './add-edit-report.component.html',
  styleUrl: './add-edit-report.component.css'
})
export class AddEditReportComponent {
  isLocalityLoading: boolean = false;
  isBSNEnable: boolean = false;
  isSubmitting: boolean = false;

  propertytxt: any = "Add New Property";
  productBtn: any = "Add Product";
  submitted = false;
  productSubmitted = false;

  customerForm!: FormGroup;
  productForm!: FormGroup;

  customerResponse: Customer[] = [];
  productResponse: Product[] = [];
  companyResponse: Company[] = [];
  productDdlResponse: Product[] = [];
  productSave: any[] = [];

  @ViewChild('firstInput') firstInput!: ElementRef;
  constructor(private formBuilder: FormBuilder,
    private productService: ProductService,
    private storageService: StorageService,
    private notificationService: NotificationService,
    private reportService: ReportService) {
      
  }

  ngOnInit() {
    this.customerForm = this.formBuilder.group({
      reportId: new FormControl(''),
      customerId: new FormControl(''),
      customerCode: new FormControl('', Validators.compose([Validators.maxLength(100), Validators.required, Validators.pattern(ValidationPatterns.string)])),
      customerName: new FormControl('', Validators.compose([Validators.maxLength(100), Validators.required, Validators.pattern(ValidationPatterns.string)])),
      customerAddress: new FormControl('', Validators.compose([Validators.maxLength(250), Validators.required, Validators.pattern(ValidationPatterns.string)])),
    });
    this.productForm = this.formBuilder.group({
      index: new FormControl(null),
      companyId: new FormControl('', Validators.required),
      productId: new FormControl('', Validators.required),
      quantity: new FormControl('', Validators.compose([Validators.required])),
      retailPrize: new FormControl('', Validators.compose([Validators.required])),
      purchasePrize: new FormControl('', Validators.compose([Validators.required])),
      pack: new FormControl('', Validators.compose([Validators.maxLength(250), Validators.required])),
      retail_Net: new FormControl('', Validators.compose([Validators.required])),
      discount: new FormControl(0, Validators.compose([Validators.required, Validators.max(100)])),
      amount: new FormControl(0),
      profit: new FormControl(0),
    })

    this.getAllCustomer();
    this.getAllCompany();
    this.getAllProducts();
  }
  getAllCustomer() {
    this.customerResponse = [];
    if (this.storageService.hasDataCustomer()) {
      this.customerResponse = this.storageService.getDataCustomer();
    } else {
      this.productService.getAllCustomer().subscribe({
        next: (data: any) => {
          this.customerResponse = data;
        },
        error: (err: any) => {
          this.notificationService.excpetionHandle(err)
        }

      })
    }
  }
  getAllCompany() {
    this.companyResponse = [];
    if (this.storageService.hasDataCompany()) {
      this.companyResponse = this.storageService.getDataCompany();
    } else {
      this.productService.getAllCompany().subscribe({
        next: (data: any) => {
          this.companyResponse = data;
        },
        error: (err: any) => {
          this.notificationService.excpetionHandle(err)
        }

      })
    }
  }
  getAllProducts() {
    this.productResponse = [];
    if (this.storageService.hasDataProduct()) {
      this.productResponse = this.storageService.getDataProduct();
    } else {
      this.productService.getAllProduct().subscribe({
        next: (data: any) => {
          this.productResponse = data;
        },
        error: (err: any) => {
          this.notificationService.excpetionHandle(err)
        }

      })
    }
  }
  save() {
    if (this.productSave.length < 1) {
      this.notificationService.warning("Please at least add one product", "Product");
      return;
    }
    if (this.customerForm.invalid) {
      this.submitted = true;
      return;
    }
    var totalPrice = 0;
    var retailNet = 0;
    var profit = 0;
    for (var i = 0; i < this.productSave.length; i++) {
      totalPrice += this.productSave[i].amount;
      retailNet += this.productSave[i].retail_Net;
      profit += this.productSave[i].profit;
    }
    const formData = {
      reportId: '',
      customerId: this.customerForm.controls['customerId'].getRawValue(),
      totalPrice: totalPrice,
      profit: profit
    }
    const reportData = this.productSave.map(item => ({
      reportDataId: '',
      companyId: item.companyId,
      productId: item.productId,
      discount: item.discount,
      quantity: item.quantity,
      amount: item.amount
    }));

    const report = {
      ...formData,
      reportData: reportData
    }
    this.reportService.addReport(report).subscribe({
      next: (data: any)=>{
        console.log(data);
      }
    })
    this.resetCustomer();
    this.productSave = [];
  }
  productSubmit() {
    debugger;
    this.productSubmitted = true;
    if (this.productForm.invalid) {
      return;
    }
    var quantity = this.productForm.controls['quantity'].getRawValue();
    var retailNet = this.productForm.controls['retail_Net'].getRawValue();
    var discount = this.productForm.controls['discount'].getRawValue();
    var purchasePrize = this.productForm.controls['purchasePrize'].getRawValue();
    var amount;
    var profit;
    if (discount > 0) {
      amount = quantity * (retailNet - (retailNet * (1-discount / 100)))
      profit = ((quantity * purchasePrize) - amount);
    } else {
      amount = quantity * retailNet;
      profit = ((quantity * purchasePrize) - amount);
    }
    this.productForm.controls['profit'].setValue(profit);
    this.productForm.controls['amount'].setValue(amount);
    const index = this.productForm.controls['index'].value;
    if (index != null) {
      this.productSave[index] = this.productForm.value
    } else {
      this.productSave.push(this.productForm.getRawValue())
    }
    this.productSubmitted = false;
    this.resetProduct();
    this.firstInput.nativeElement.focus();
    console.log(this.productSave)
  }
  resetProduct() {
    this.productForm.controls['productId'].setValue('');
    this.productForm.controls['retailPrize'].setValue('');
    this.productForm.controls['purchasePrize'].setValue('');
    this.productForm.controls['pack'].setValue('');
    this.productForm.controls['retail_Net'].setValue('');
    this.productForm.controls['amount'].setValue('');
    this.productForm.controls['quantity'].setValue('');
    this.productForm.controls['discount'].setValue(0);
  }
  resetCustomer() {
    this.customerForm.controls['customerId'].setValue('')
    this.customerForm.controls['customerCode'].setValue('')
    this.customerForm.controls['customerAddress'].setValue('')
    this.customerForm.controls['customerName'].setValue('')
  }
  onChangeCustomer(event: any) {
    debugger;
    if (event) {
      this.customerForm.controls['customerCode'].setValue(event.customerCode);
      this.customerForm.controls['customerName'].setValue(event.customerName);
      this.customerForm.controls['customerAddress'].setValue(event.customerAddress);
      this.customerForm.controls['customerCode'].disable();
      this.customerForm.controls['customerName'].disable();
      this.customerForm.controls['customerAddress'].disable();
    }
  }
  onChangeCompany(event: any) {
    if (event) {
      this.productDdlResponse = this.productResponse.filter(item => item.companyId == event.companyId);
      this.productForm.controls['productId'].setValue('');
      this.productForm.controls['retailPrize'].setValue('');
      this.productForm.controls['purchasePrize'].setValue('');
      this.productForm.controls['pack'].setValue('');
      this.productForm.controls['retail_Net'].setValue('');

      this.productForm.controls['retailPrize'].enable();
      this.productForm.controls['purchasePrize'].enable();
      this.productForm.controls['pack'].enable();
      this.productForm.controls['retail_Net'].enable();

    }
  }
  onChangeProduct(event: any) {
    debugger
    if (event) {
      this.productForm.controls['retailPrize'].setValue(event.retailPrize);
      this.productForm.controls['purchasePrize'].setValue(event.purchasePrize);
      this.productForm.controls['pack'].setValue(event.pack);
      this.productForm.controls['retail_Net'].setValue(event.retail_Net);

      this.productForm.controls['retailPrize'].disable();
      this.productForm.controls['purchasePrize'].disable();
      this.productForm.controls['pack'].disable();
      this.productForm.controls['retail_Net'].disable();

    }
  }
  getCompanyNameById(companyId: string) {
    var company = this.companyResponse.filter(item => (item.companyId == companyId));
    if (company.length > 0) {
      return company[0].companyName
    }
    return '';
  }
  getProductNameById(productId: string) {
    var product = this.productResponse.filter(item => (item.productId == productId));
    if (product.length > 0) {
      return product[0].productName
    }
    return '';
  }
  deleteProduct(index: any) {
    this.productSave.splice(index, 1);
  }
  editProduct(pro: any, i: any) {

  }
}

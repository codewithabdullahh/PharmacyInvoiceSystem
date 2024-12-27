export interface Company {
  companyId: string;
  companyName: string;
}
export interface Customer {
  customerId: string;
  customerName: string;
  customerAddress: string;
  customerCode: string;
}
export interface Product {
  productId: string;
  productName: string;
  companyId: string;
  retailPrize: number;
  purchasePrize: number;
  pack: string;
  retail_Net: number;
}



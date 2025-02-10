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

  productNamePack: string;
}
export interface ReportEditResponse {
  customerCode: string;
  customerName: string;
  customerAddress: string;
  reportId: string; // Using string for GUID
  customerId: string;
  reportData: ReportDataEditResponse[];
}

export interface ReportDataEditResponse {
  reportDataId: string; // Using string for GUID
  quantity: number;
  productName: string;
  pack: string;
  retailPrize: number;
  retailNet: number; // Adjusted naming convention
  discount: number;
  bonus: number;
  amount: number;
  createdOn: Date;
  totalPrice: number;
}




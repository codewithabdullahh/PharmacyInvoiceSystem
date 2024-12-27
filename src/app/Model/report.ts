export interface ReportSearch {
  rowNum: number;
  totalItems: number;
  customerName: string;
  customerCode: string;
  issueDate: Date;
  customerId: string;
  reportId: string;
  totalPrice: number;
  profit: number;
}
export interface ReportData {
  customerCode: string;
  customerName: string;
  customerAddress: string;
  reportId: string;
  customerId: string;
  quantity: number;
  productName: string;
  pack: string;
  retailPrize: number;
  retail_Net: number; 
  discount: number;
  amount: number;
  createdOn: Date;
  totalPrice: number;
}

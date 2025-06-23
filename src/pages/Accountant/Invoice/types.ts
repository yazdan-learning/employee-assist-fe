import { ListRequest } from "../../../types/common";

export enum InvoiceType {
  BUY = 'BUY',
  SELL = 'SELL'
}

export interface InvoiceDetail {
  id?: number;
  productId: number;
  unitId: number;
  primaryUnitId: number;
  quantity: number;
  unitPrice: number;
  discount: number;
  vat: number;
  finalPrice: number;
  conversionRate: number;
}

export interface Invoice {
  id?: number;
  type: InvoiceType;
  number: string;
  date: string;
  description?: string;
  partnerId: number; // This will be either buyerId or sellerId depending on type
  partnerName: string; // Added partner name field
  details: InvoiceDetail[];
  totalAmount: number;
  totalVat: number;
  totalDiscount: number;
  finalAmount: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface InvoiceFormData {
  type: InvoiceType;
  number: string;
  date: string;
  description?: string;
  partnerId: number;
  details: InvoiceDetail[];
}

export interface InvoiceListRequest extends ListRequest {
  type?: InvoiceType;
  startDate?: string;
  endDate?: string;
} 
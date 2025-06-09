import { ProductStatus } from "../types";

export interface BasicInfoFormData {
  categoryId: number | null;
  code: string;
  name: string;
  description?: string;
  status: ProductStatus;
  isService: boolean;
  hasSerial: boolean;
  allowNegativeStock: boolean;
}

export interface GeneralInfoFormData {
  locations: {
    warehouseId: number;
    addressId: number;
  }[];
  units: {
    unitId: number;
    isPrimary: boolean;
    conversionRate: number;
    weightPerUnit: number;
  }[];
  attributes: {
    attributeId: number;
    valueId: number;
  }[];
}

export interface PricingFormData {
  prices: {
    sellTypeId: number;
    price: number;
    currency: string;
    discountPercentage?: number;
  }[];
  taxAmount: number;
  minQuantity: number;
  maxQuantity: number;
  barcode?: string;
}

export interface ProductFormData extends BasicInfoFormData, GeneralInfoFormData, PricingFormData {} 
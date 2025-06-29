export interface ProductAttribute {
  id?: number;
  attributeId: number;
  valueId: number;
}

export interface Location {
  warehouseId: number;
  addressId?: number;
  minQuantity?: number;
  maxQuantity?: number;
}

export interface ProductImage {
  id?: number;
  title?: string;
  imageUrl: string;
}

export interface ProductSellType {
  id: number;
  title: string;
  discountPercentage: number;
  currencyName: string;
  currencyCode: string;
}

export interface ProductPrice {
  id?: number;
  sellTypeId: number;
  price: number;
  currency: string;
}

export interface ProductUnit {
  id?: number;
  unitId: number;
  isPrimary: boolean;
  conversionRate: number;
  weightPerUnit: number;
}

export interface Product {
  id?: number;
  categoryId: number;
  code: string;
  name: string;
  description?: string;
  isActive: boolean;
  isService: boolean;
  hasSerial: boolean;
  allowNegativeStock: boolean;
  isPackaging: boolean;
  locations: Location[];
  units: ProductUnit[];
  attributes: ProductAttribute[];
  prices: ProductPrice[];
  images: ProductImage[];
  taxPercentage: number;
  barcode?: string;
}

export interface Category {
  id: number;
  code: string;
  name: string;
}

export interface Attribute {
  id: number;
  name: string;
}

export interface AttributeValue {
  id: number;
  attributeId: number;
  value: string;
}

export interface Unit {
  id: number;
  name: string;
}

export interface ProductState {
  products: Product[];
  selectedProduct: Product | null;
  loading: boolean;
  error: string | null;
}

export interface ProductInfo {
  id: string;
  name: string;
  categoryName: string;
  isActive: boolean;
} 
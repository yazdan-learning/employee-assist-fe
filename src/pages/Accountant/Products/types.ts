export enum ProductStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  OUT_OF_STOCK = "OUT_OF_STOCK"
}

export interface ProductBasicInfo {
  name: string;
  sku: string;
  price: number;
  description?: string;
}

export interface ProductDetails {
  category: string;
  stock: number;
  cost?: number;
  barcode?: string;
  image?: string;
}

export interface ProductAttribute {
  id?: number;
  attributeId: number;
  valueId: number;
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
  name: string;
  barcode: string;
  isService: boolean;
  hasSerial: boolean;
  allowNegativeStock: boolean;
  categoryId: number | null;
  attributes: ProductAttribute[];
  units: ProductUnit[];
  locationId: number | null;
}

export interface Category {
  id: number;
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

export interface Location {
  id: number;
  name: string;
}

export interface ProductState {
  products: Product[];
  selectedProduct: Product | null;
  loading: boolean;
  error: string | null;
}

export interface ProductFormData extends ProductBasicInfo, ProductDetails {
  status: ProductStatus;
}

export interface ProductInfo {
  id: string;
  name: string;
  sku: string;
  price: number;
  description?: string;
  category: string;
  stock: number;
  cost?: number;
  barcode?: string;
  image?: string;
  status: ProductStatus;
  createdAt?: string;
  updatedAt?: string;
} 
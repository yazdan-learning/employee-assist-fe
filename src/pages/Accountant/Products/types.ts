export enum ProductStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  OUT_OF_STOCK = "OUT_OF_STOCK"
}


export interface ProductAttribute {
  id?: number;
  attributeId: number;
  valueId: number;
}

export interface ProductLocation {
  id?: number;
  warehouseId: number;
  addressId: number;
}

export interface ProductImage {
  id?: number;
  title?: string;
  imageUrl: string;
}

export interface ProductSellType {
  id: number;
  name: string;
  discountPercentage: number;
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
  name: string;
  description?: string;
  code: string;
  barcode?: string;
  isService: boolean;
  hasSerial: boolean;
  allowNegativeStock: boolean;
  status: ProductStatus;
  categoryId: number | null;
  attributes: ProductAttribute[];
  units: ProductUnit[];
  images: ProductImage[];
  prices: ProductPrice[];
  locations: ProductLocation[];
  taxAmount: number;
  minQuantity: number;
  maxQuantity: number;
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
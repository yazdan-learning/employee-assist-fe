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

export interface Product {
  id: string;
  basicInfo: ProductBasicInfo;
  details: ProductDetails;
  status: ProductStatus;
  createdAt?: string;
  updatedAt?: string;
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
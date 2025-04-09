export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  cost: number;
  stock: number;
  sku: string;
  barcode?: string;
  image?: string;
  status: ProductStatus;
  createdAt?: string;
  updatedAt?: string;
}

export enum ProductStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  OUT_OF_STOCK = "OUT_OF_STOCK"
}

export interface ProductState {
  products: Product[];
  selectedProduct: Product | null;
  loading: boolean;
  error: string | null;
}

export interface ProductFormData {
  name: string;
  description: string;
  category: string;
  price: number;
  cost: number;
  stock: number;
  sku: string;
  barcode?: string;
  image?: string;
  status: ProductStatus;
} 
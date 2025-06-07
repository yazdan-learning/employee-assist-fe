// Commented out as we're migrating from Redux to React Query
/*
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../services/ProductService";
import { Product, ProductFormData, ProductInfo } from "../../pages/Accountant/Products/types";
import { ListRequest } from "../../types/common";

// Helper function to convert Product to ProductInfo
const toProductInfo = (product: Product): ProductInfo => ({
  id: product.id,
  name: product.basicInfo.name,
  sku: product.basicInfo.sku,
  price: product.basicInfo.price,
  description: product.basicInfo.description,
  category: product.details.category,
  stock: product.details.stock,
  cost: product.details.cost,
  barcode: product.details.barcode,
  image: product.details.image,
  status: product.status,
  createdAt: product.createdAt,
  updatedAt: product.updatedAt
});

export const fetchProducts = createAsyncThunk(
  "product/fetchProducts",
  async (request: ListRequest) => {
    const response = await getProducts(request);
    return response;
  }
);

export const fetchProductById = createAsyncThunk(
  "product/fetchProductById",
  async (id: string) => {
    const product = await getProductById(id);
    return toProductInfo(product);
  }
);

export const createNewProduct = createAsyncThunk(
  "product/createProduct",
  async (data: ProductFormData) => {
    const product = await createProduct(data);
    return toProductInfo(product);
  }
);

export const updateProductById = createAsyncThunk(
  "product/updateProduct",
  async ({ id, data }: { id: string; data: ProductFormData }) => {
    const product = await updateProduct(id, data);
    return toProductInfo(product);
  }
);

export const deleteProductById = createAsyncThunk(
  "product/deleteProduct",
  async (id: string) => {
    await deleteProduct(id);
    return id;
  }
);
*/

// Placeholder exports to prevent import errors
export const fetchProducts = () => undefined;
export const fetchProductById = () => undefined;
export const createNewProduct = () => undefined;
export const updateProductById = () => undefined;
export const deleteProductById = () => undefined; 
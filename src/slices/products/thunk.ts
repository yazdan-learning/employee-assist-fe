import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../services/productService";
import { Product, ProductFormData } from "../../pages/Accountant/Products/types";

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (params: { page: number; pageSize: number; searchTerm?: string }) => {
    const response = await getProducts(params);
    return response;
  }
);

export const fetchProductById = createAsyncThunk(
  "products/fetchProductById",
  async (id: string) => {
    const response = await getProductById(id);
    return response;
  }
);

export const createNewProduct = createAsyncThunk(
  "products/createProduct",
  async (data: ProductFormData) => {
    const response = await createProduct(data);
    return response;
  }
);

export const updateProductById = createAsyncThunk(
  "products/updateProduct",
  async ({ id, data }: { id: string; data: ProductFormData }) => {
    const response = await updateProduct(id, data);
    return response;
  }
);

export const deleteProductById = createAsyncThunk(
  "products/deleteProduct",
  async (id: string) => {
    await deleteProduct(id);
    return id;
  }
); 
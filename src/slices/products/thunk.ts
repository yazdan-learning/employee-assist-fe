import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../services/productService";
import { Product, ProductFormData } from "../../pages/Accountant/Products/types";
import { ListRequest } from "../../types/common";

export const fetchProducts = createAsyncThunk(
  "product/fetchProducts",
  async (request: ListRequest) => {
    const response = await getProducts(request);
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
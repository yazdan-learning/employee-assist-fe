import { Dispatch } from "@reduxjs/toolkit";
import {
  setLoading,
  setError,
  setProducts,
  setSelectedProduct,
  addProduct,
  updateProduct,
  deleteProduct,
} from "./reducer";
import { Product, ProductFormData } from "../../pages/Accountant/Products/types";
import { getProducts as fetchProductsApi, 
         getProductById as fetchProductByIdApi,
         createProduct as createProductApi,
         updateProduct as updateProductApi,
         deleteProduct as deleteProductApi } from "../../services/productService";

export const fetchProducts = () => async (dispatch: Dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await fetchProductsApi();
    dispatch(setProducts(response));
    dispatch(setError(null));
  } catch (error: any) {
    dispatch(setError(error.message));
  } finally {
    dispatch(setLoading(false));
  }
};

export const fetchProductById = (id: string) => async (dispatch: Dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await fetchProductByIdApi(id);
    dispatch(setSelectedProduct(response));
    dispatch(setError(null));
  } catch (error: any) {
    dispatch(setError(error.message));
  } finally {
    dispatch(setLoading(false));
  }
};

export const createProduct = (data: ProductFormData) => async (dispatch: Dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await createProductApi(data);
    dispatch(addProduct(response));
    dispatch(setError(null));
    return response;
  } catch (error: any) {
    dispatch(setError(error.message));
    throw error;
  } finally {
    dispatch(setLoading(false));
  }
};

export const updateProductById = (id: string, data: ProductFormData) => async (dispatch: Dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await updateProductApi(id, data);
    dispatch(updateProduct(response));
    dispatch(setError(null));
    return response;
  } catch (error: any) {
    dispatch(setError(error.message));
    throw error;
  } finally {
    dispatch(setLoading(false));
  }
};

export const deleteProductById = (id: string) => async (dispatch: Dispatch) => {
  try {
    dispatch(setLoading(true));
    await deleteProductApi(id);
    dispatch(deleteProduct(id));
    dispatch(setError(null));
  } catch (error: any) {
    dispatch(setError(error.message));
    throw error;
  } finally {
    dispatch(setLoading(false));
  }
}; 
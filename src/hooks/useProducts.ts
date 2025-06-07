import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '../services/ProductService';
import type { Product } from '../pages/Accountant/Products/types';
import type { ListRequest, BaseResponse, ListResponse } from '../types/common';

// Query keys for cache management
const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters: ListRequest) => [...productKeys.lists(), filters] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: number) => [...productKeys.details(), id] as const,
};

// Get products list
export const useProductList = (request: ListRequest) => {
  return useQuery<ListResponse<Product>>({
    queryKey: productKeys.list(request),
    queryFn: () => productService.getAllProducts(request),
  });
};

// Get single product
export const useProductById = (id: number) => {
  return useQuery<BaseResponse<Product>>({
    queryKey: productKeys.detail(id),
    queryFn: () => productService.getProductById(id),
    enabled: !!id,
  });
};

// Create product
export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation<BaseResponse<Product>, Error, Product>({
    mutationFn: (product: Product) => productService.createProduct(product),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
};

// Update product
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation<BaseResponse<Product>, Error, Product>({
    mutationFn: (product: Product) => productService.updateProduct(product),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      if (variables.id) {
        queryClient.invalidateQueries({ queryKey: productKeys.detail(variables.id) });
      }
    },
  });
};

// Delete product
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation<BaseResponse<void>, Error, number>({
    mutationFn: (id: number) => productService.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
};

// Get attribute values for a specific attribute
export const useAttributeValues = (attributeId: number | null) => {
  return useQuery({
    queryKey: ['attributeValues', attributeId],
    queryFn: () => productService.getAttributeValues(attributeId),
    enabled: !!attributeId,
  });
}; 
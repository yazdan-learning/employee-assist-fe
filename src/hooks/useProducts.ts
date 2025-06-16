import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Product, ProductInfo } from '../pages/Accountant/Products/types';
import type { ListRequest, BaseResponse, ListResponse } from '../types/common';
import { fakeProductService } from '../services/FakeProductService';


// Query keys for cache management
const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters: ListRequest) => [...productKeys.lists(), filters] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: number) => [...productKeys.details(), id] as const,
};

// Get products list
export const useProductList = (params: ListRequest) => {
  return useQuery<ListResponse<ProductInfo>>({
    queryKey: productKeys.list(params),
    queryFn: () => fakeProductService.getProducts(params),
  });
};

// Get single product
export const useProductById = (id: number) => {
  return useQuery<BaseResponse<Product>>({
    queryKey: productKeys.detail(id),
    queryFn: () => fakeProductService.getProductById(id),
    enabled: !!id,
  });
};

// Create product
export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation<BaseResponse<Product>, Error, Product>({
    mutationFn: (product: Product) => fakeProductService.createProduct(product),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
};

// Update product
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation<BaseResponse<Product>, Error, Product>({
    mutationFn: (product: Product) => fakeProductService.updateProduct(product),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
};

// Delete product
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation<BaseResponse<void>, Error, number>({
    mutationFn: (id: number) => fakeProductService.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
};

// Get attribute values for a specific attribute
export const useAttributeValues = (attributeId: number | null) => {
  return useQuery({
    queryKey: ["attributeValues", attributeId],
    queryFn: () => attributeId ? fakeProductService.getAttributeValues(attributeId) : Promise.resolve([]),
    enabled: !!attributeId
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => fakeProductService.getCategories()
  });
};

export const useUnits = () => {
  return useQuery({
    queryKey: ["units"],
    queryFn: () => fakeProductService.getUnits()
  });
};

export const useAttributes = () => {
  return useQuery({
    queryKey: ["attributes"],
    queryFn: () => fakeProductService.getAttributes()
  });
};

export const useSellTypes = () => {
  return useQuery({
    queryKey: ["sellTypes"],
    queryFn: () => fakeProductService.getSellTypes()
  });
};

export const useWarehouses = () => {
  return useQuery({
    queryKey: ["warehouses"],
    queryFn: () => fakeProductService.getWarehouses()
  });
};

export const useWarehouseAddresses = (warehouseId: number | null) => {
  return useQuery({
    queryKey: ["warehouseAddresses", warehouseId],
    queryFn: () => warehouseId ? fakeProductService.getWarehouseAddresses(warehouseId) : Promise.resolve([]),
    enabled: !!warehouseId
  });
};

export const useCurrencies = () => {
  return useQuery({
    queryKey: ["currencies"],
    queryFn: () => fakeProductService.getCurrencies()
  });
}; 
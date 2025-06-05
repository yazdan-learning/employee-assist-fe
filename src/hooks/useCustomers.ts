// First run: npm install @tanstack/react-query
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { customerService } from '../services/CustomerService';
import type { Customer, CustomerInfo } from '../pages/Accountant/Customers/types';
import type { ListRequest, BaseResponse, ListResponse } from '../types/common';

// Query keys for cache management
const customerKeys = {
  all: ['customers'] as const,
  lists: () => [...customerKeys.all, 'list'] as const,
  list: (filters: ListRequest) => [...customerKeys.lists(), filters] as const,
  details: () => [...customerKeys.all, 'detail'] as const,
  detail: (id: number) => [...customerKeys.details(), id] as const,
};

// Get customers list
export const useCustomerList = (request: ListRequest) => {
  return useQuery<ListResponse<CustomerInfo>>({
    queryKey: customerKeys.list(request),
    queryFn: () => customerService.getAllCustomers(request),
    placeholderData: keepPreviousData,
  });
};

// Get single customer
export const useCustomerById = (id: number) => {
  return useQuery<BaseResponse<Customer>>({
    queryKey: customerKeys.detail(id),
    queryFn: () => customerService.getCustomerById(id),
    enabled: !!id,
  });
};

// Create customer
export const useCreateCustomer = () => {
  const queryClient = useQueryClient();
  
  return useMutation<BaseResponse<Customer>, Error, Customer>({
    mutationFn: (customer: Customer) => customerService.createCustomer(customer),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
    },
  });
};

// Update customer
export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();
  
  return useMutation<BaseResponse<Customer>, Error, Partial<Customer>>({
    mutationFn: (customer: Partial<Customer>) => customerService.updateCustomer(customer),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
      if (variables.id) {
        queryClient.invalidateQueries({ queryKey: customerKeys.detail(variables.id) });
      }
    },
  });
};

// Delete customer
export const useDeleteCustomer = () => {
  const queryClient = useQueryClient();
  
  return useMutation<BaseResponse<void>, Error, number>({
    mutationFn: (id: number) => customerService.deleteCustomer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
    },
  });
}; 
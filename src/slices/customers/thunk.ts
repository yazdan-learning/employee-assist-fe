import { createAsyncThunk } from '@reduxjs/toolkit';
import { Customer } from '../../pages/Accountant/Customers/types';
import { customerService } from '../../services/CustomerService';
import { ListRequest } from '../../types/common';

export const fetchCustomers = createAsyncThunk(
  'customers/fetchAll',
  async (request: ListRequest) => {
    const response = await customerService.getAllCustomers(request);
    return response;
  }
);

export const fetchCustomerById = createAsyncThunk(
  'customers/fetchById',
  async (id: number) => {
    const customer = await customerService.getCustomerById(id);
    return customer;
  }
);

export const createCustomer = createAsyncThunk(
  'customers/create',
  async (customer: Customer) => {
    const newCustomer = await customerService.createCustomer(customer);
    return newCustomer;
  }
);

export const updateCustomerById = createAsyncThunk(
  'customers/update',
  async (customerData: Partial<Customer>) => {
    if (!customerData.id) {
      throw new Error('Customer ID is required for update');
    }
    const updatedCustomer = await customerService.updateCustomer(
      customerData
    );
    return updatedCustomer;
  }
);

export const deleteCustomerById = createAsyncThunk(
  'customers/delete',
  async (id: number) => {
    await customerService.deleteCustomer(id);
    return id;
  }
); 
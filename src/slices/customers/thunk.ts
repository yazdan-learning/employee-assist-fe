import { createAsyncThunk } from '@reduxjs/toolkit';
import { CustomerBasicInfo, CustomerDetails } from '../../pages/Accountant/Customers/types';
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
  async (id: string) => {
    const customer = await customerService.getCustomerById(id);
    return customer;
  }
);

export const createCustomer = createAsyncThunk(
  'customers/create',
  async ({ basicInfo, details }: { basicInfo: CustomerBasicInfo; details: CustomerDetails }) => {
    const newCustomer = await customerService.createCustomer(basicInfo, details);
    return newCustomer;
  }
);

export const updateCustomerById = createAsyncThunk(
  'customers/update',
  async ({
    id,
    basicInfo,
    details,
  }: {
    id: string;
    basicInfo: Partial<CustomerBasicInfo>;
    details: Partial<CustomerDetails>;
  }) => {
    const updatedCustomer = await customerService.updateCustomer(id, basicInfo, details);
    return updatedCustomer;
  }
);

export const deleteCustomerById = createAsyncThunk(
  'customers/delete',
  async (id: string) => {
    await customerService.deleteCustomer(id);
    return id;
  }
); 
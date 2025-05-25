import { createAsyncThunk } from '@reduxjs/toolkit';
import { CustomerBasicInfo, CustomerContactInfo, CustomerAdditionalDetails } from '../../pages/Accountant/Customers/types';
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
  async ({ 
    basicInfo, 
    contactInfo, 
    additionalDetails 
  }: { 
    basicInfo: CustomerBasicInfo; 
    contactInfo: CustomerContactInfo; 
    additionalDetails: CustomerAdditionalDetails;
  }) => {
    const newCustomer = await customerService.createCustomer(basicInfo, contactInfo, additionalDetails);
    return newCustomer;
  }
);

export const updateCustomerById = createAsyncThunk(
  'customers/update',
  async ({
    id,
    basicInfo,
    contactInfo,
    additionalDetails,
  }: {
    id: string;
    basicInfo?: Partial<CustomerBasicInfo>;
    contactInfo?: Partial<CustomerContactInfo>;
    additionalDetails?: Partial<CustomerAdditionalDetails>;
  }) => {
    const updatedCustomer = await customerService.updateCustomer(
      id, 
      basicInfo, 
      contactInfo, 
      additionalDetails
    );
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
import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  setLoading,
  setError,
  setCustomers,
  setSelectedCustomer,
  addCustomer,
  updateCustomer,
  deleteCustomer,
} from './reducer';
import { CustomerBasicInfo, CustomerDetails } from '../../pages/Accountant/Customers/types';
import { customerService } from '../../services/CustomerService';

export const fetchCustomers = createAsyncThunk(
  'customers/fetchAll',
  async (_, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      const customers = await customerService.getAllCustomers();
      dispatch(setCustomers(customers));
      dispatch(setError(null));
    } catch (error: any) {
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const fetchCustomerById = createAsyncThunk(
  'customers/fetchById',
  async (id: string, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      const customer = await customerService.getCustomerById(id);
      dispatch(setSelectedCustomer(customer));
      dispatch(setError(null));
    } catch (error: any) {
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const createCustomer = createAsyncThunk(
  'customers/create',
  async (
    { basicInfo, details }: { basicInfo: CustomerBasicInfo; details: CustomerDetails },
    { dispatch }
  ) => {
    try {
      dispatch(setLoading(true));
      const newCustomer = await customerService.createCustomer(basicInfo, details);
      dispatch(addCustomer(newCustomer));
      dispatch(setError(null));
      return newCustomer;
    } catch (error: any) {
      dispatch(setError(error.message));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const updateCustomerById = createAsyncThunk(
  'customers/update',
  async (
    {
      id,
      basicInfo,
      details,
    }: { id: string; basicInfo: Partial<CustomerBasicInfo>; details: Partial<CustomerDetails> },
    { dispatch }
  ) => {
    try {
      dispatch(setLoading(true));
      const updatedCustomer = await customerService.updateCustomer(id, basicInfo, details);
      dispatch(updateCustomer(updatedCustomer));
      dispatch(setError(null));
      return updatedCustomer;
    } catch (error: any) {
      dispatch(setError(error.message));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const deleteCustomerById = createAsyncThunk(
  'customers/delete',
  async (id: string, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      await customerService.deleteCustomer(id);
      dispatch(deleteCustomer(id));
      dispatch(setError(null));
    } catch (error: any) {
      dispatch(setError(error.message));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }
); 
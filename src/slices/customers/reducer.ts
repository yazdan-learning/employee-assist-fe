import { createSlice } from "@reduxjs/toolkit";
import {
  fetchCustomers,
  fetchCustomerById,
  createCustomer,
  updateCustomerById,
  deleteCustomerById,
} from "./thunk";
import { Customer, CustomerInfo } from "../../pages/Accountant/Customers/types";

interface CustomerState {
  customers: CustomerInfo[];
  selectedCustomer: Customer | null;
  loading: boolean;
  error: string | null;
}

const initialState: CustomerState = {
  customers: [],
  selectedCustomer: null,
  loading: false,
  error: null,
};

const customerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Customers
      .addCase(fetchCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.customers = action.payload.data;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch customers";
      })
      // Fetch Customer by ID
      .addCase(fetchCustomerById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomerById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedCustomer = action.payload;
      })
      .addCase(fetchCustomerById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch customer";
      })
      // Create Customer
      .addCase(createCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCustomer.fulfilled, (state, action) => {
        state.loading = false;
        const customerInfo: CustomerInfo = {
          id: action.payload.id,
          name: action.payload.basicInfo.isFirm 
            ? action.payload.basicInfo.companyName || ''
            : `${action.payload.basicInfo.firstName} ${action.payload.basicInfo.lastName}`,
          isFirm: action.payload.basicInfo.isFirm,
          companyName: action.payload.basicInfo.companyName,
          firstName: action.payload.basicInfo.firstName,
          lastName: action.payload.basicInfo.lastName,
          nationalCode: action.payload.basicInfo.nationalCode,
          taxId: action.payload.basicInfo.taxId,
          customerType: action.payload.basicInfo.customerType,
          address: action.payload.details.address,
          createdAt: action.payload.createdAt,
          updatedAt: action.payload.updatedAt
        };
        state.customers.push(customerInfo);
      })
      .addCase(createCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create customer";
      })
      // Update Customer
      .addCase(updateCustomerById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCustomerById.fulfilled, (state, action) => {
        state.loading = false;
        const customerInfo: CustomerInfo = {
          id: action.payload.id,
          name: action.payload.basicInfo.isFirm 
            ? action.payload.basicInfo.companyName || ''
            : `${action.payload.basicInfo.firstName} ${action.payload.basicInfo.lastName}`,
          isFirm: action.payload.basicInfo.isFirm,
          companyName: action.payload.basicInfo.companyName,
          firstName: action.payload.basicInfo.firstName,
          lastName: action.payload.basicInfo.lastName,
          nationalCode: action.payload.basicInfo.nationalCode,
          taxId: action.payload.basicInfo.taxId,
          customerType: action.payload.basicInfo.customerType,
          address: action.payload.details.address,
          createdAt: action.payload.createdAt,
          updatedAt: action.payload.updatedAt
        };
        const index = state.customers.findIndex(
          (customer) => customer.id === action.payload.id
        );
        if (index !== -1) {
          state.customers[index] = customerInfo;
        }
      })
      .addCase(updateCustomerById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update customer";
      })
      // Delete Customer
      .addCase(deleteCustomerById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCustomerById.fulfilled, (state, action) => {
        state.loading = false;
        state.customers = state.customers.filter(
          (customer) => customer.id !== action.payload
        );
      })
      .addCase(deleteCustomerById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete customer";
      });
  },
});

export default customerSlice.reducer; 
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

// Helper function to transform Customer to CustomerInfo

const customerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {
    clearSelectedCustomer: (state) => {
      state.selectedCustomer = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Customers
      .addCase(fetchCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.customers = action.payload.data.items;
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
        state.selectedCustomer = action.payload.data;
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
        state.customers.push(action.payload.data as unknown as CustomerInfo);
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
        const customerInfo = action.payload.data as unknown as CustomerInfo;
        const index = state.customers.findIndex(
          (customer) => customer.id === action.payload.data.id
        );
        if (index !== -1) {
          state.customers[index] = customerInfo;
        }
        // Update selectedCustomer if it's the one being updated
        if (state.selectedCustomer?.id === action.payload.data.id) {
          state.selectedCustomer = action.payload.data;
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
        // Clear selectedCustomer if it's the one being deleted
        if (state.selectedCustomer?.id === action.payload) {
          state.selectedCustomer = null;
        }
      })
      .addCase(deleteCustomerById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete customer";
      });
  },
});

export const { clearSelectedCustomer } = customerSlice.actions;
export default customerSlice.reducer; 
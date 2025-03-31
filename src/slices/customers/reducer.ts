import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Customer, CustomerState, CustomerBasicInfo, CustomerDetails, CustomerType } from '../../pages/Accountant/Customers/types';

const initialState: CustomerState = {
  customers: [],
  selectedCustomer: null,
  loading: false,
  error: null,
  currentStep: 1,
  formData: {
    basicInfo: {
      isFirm: false,
      customerType: CustomerType.NONE,
    },
    details: {},
  },
};

const customerSlice = createSlice({
  name: 'customer',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setCustomers: (state, action: PayloadAction<Customer[]>) => {
      state.customers = action.payload;
    },
    setSelectedCustomer: (state, action: PayloadAction<Customer | null>) => {
      state.selectedCustomer = action.payload;
    },
    setCurrentStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload;
    },
    updateBasicInfo: (state, action: PayloadAction<Partial<CustomerBasicInfo>>) => {
      state.formData.basicInfo = {
        ...state.formData.basicInfo,
        ...action.payload,
      };
    },
    updateDetails: (state, action: PayloadAction<Partial<CustomerDetails>>) => {
      state.formData.details = {
        ...state.formData.details,
        ...action.payload,
      };
    },
    resetForm: (state) => {
      state.formData = initialState.formData;
      state.currentStep = 1;
    },
    addCustomer: (state, action: PayloadAction<Customer>) => {
      state.customers.push(action.payload);
    },
    updateCustomer: (state, action: PayloadAction<Customer>) => {
      const index = state.customers.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.customers[index] = action.payload;
      }
    },
    deleteCustomer: (state, action: PayloadAction<string>) => {
      state.customers = state.customers.filter(c => c.id !== action.payload);
    },
  },
});

export const {
  setLoading,
  setError,
  setCustomers,
  setSelectedCustomer,
  setCurrentStep,
  updateBasicInfo,
  updateDetails,
  resetForm,
  addCustomer,
  updateCustomer,
  deleteCustomer,
} = customerSlice.actions;

export default customerSlice.reducer; 
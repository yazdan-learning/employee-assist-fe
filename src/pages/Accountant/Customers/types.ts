export enum CustomerType {
  NONE = "NONE",
  BUYER = "BUYER",
  SELLER = "SELLER",
  BOTH = "BOTH",
}

export interface CustomerBasicInfo {
  isFirm: boolean;
  companyName?: string;
  firstName: string;
  lastName: string;
  nationalCode: string;
  taxId: string;
  customerType: CustomerType;
}

export interface CustomerDetails {
  address: string;
  // Add any other customer detail fields here
}

export interface Customer {
  id: string;
  basicInfo: CustomerBasicInfo;
  details: CustomerDetails;
  createdAt?: string;
  updatedAt?: string;
}

export interface CustomerState {
  customers: Customer[];
  selectedCustomer: Customer | null;
  loading: boolean;
  error: string | null;
  currentStep: number;
  formData: {
    basicInfo: Partial<CustomerBasicInfo>;
    details: Partial<CustomerDetails>;
  };
}

// Form related types
export interface CustomerFormData {
  basicInfo: CustomerBasicInfo;
  details: CustomerDetails;
}

export interface CustomerInfo {
  id: string;
  name: string;
  isFirm: boolean;
  companyName?: string;
  firstName: string;
  lastName: string;
  nationalCode: string;
  taxId: string;
  customerType: CustomerType;
  address: string;
  createdAt?: string;
  updatedAt?: string;
} 
export enum CustomerType {
  NONE = "NONE",
  BUYER = "BUYER",
  SELLER = "SELLER",
  BOTH = "BOTH",
}

export interface CustomerBasicInfo {
  isFirm: boolean;
  companyName?: string;
  firstName?: string;
  lastName?: string;
  nationalCode: string;
  taxId: string;
  customerType: CustomerType;
}

export interface Address {
  address: string;
  postalCode: string;
  city: string;
}

export interface CustomerContactInfo {
  addresses: Address[];
  phones: string[];
  email: string;
  website?: string;
}

export interface CustomerAdditionalDetails {
  notes?: string;
  preferredContactMethod?: string;
  tags?: string[];
}

export interface Customer {
  id: string;
  basicInfo: CustomerBasicInfo;
  contactInfo: CustomerContactInfo;
  additionalDetails: CustomerAdditionalDetails;
}

export interface CustomerInfo {
  id: string;
  name: string;
  isFirm: boolean;
  companyName?: string;
  firstName?: string;
  lastName?: string;
  nationalCode: string;
  taxId: string;
  customerType: CustomerType;
  address: string;
} 
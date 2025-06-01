export enum CustomerType {
  NONE = 0,
  BUYER = 1,
  SELLER = 2,
  BOTH = 3,
}

export enum Gender {
  MALE = 1,
  FEMALE = 2
  
}

export enum MaritalStatus {
  SINGLE = 1,
  MARRIED = 2,
  DIVORCED = 3,
  WIDOWED = 4,
}

export interface Address {
  id?: string;
  title: string;
  value: string;
  postalCode: string;
  isPrimary: boolean;
}

export interface BankAccount {
  accountNumber: string;
  iban: string;
  cardNumber: string;
  title: string;
  branchName: string;
  branchCode: string;
  bankId: number;
}

export interface Customer {
  id?: number;  // Optional for creation, required after creation
  isCompany: boolean;
  title: string;
  firstName: string;
  lastName: string;
  nationalId: string;
  taxId: string;
  gender: Gender;
  nickname?: string;
  maritalStatus: MaritalStatus;
  tradeChamberNumber?: string;
  registrationNumber?: string;
  customerType: CustomerType;
  customerRiskLimit: number;
  phone: string[];
  fax?: string;
  email: string;
  website?: string;
  licensePlate?: string;
  addresses: Address[];
  bankAccounts: BankAccount[];
}

// For list view and basic info display
export interface CustomerInfo {
  id: number;
  name: string;
  isFirm: boolean;
  companyName?: string;
  firstName?: string;
  lastName?: string;
  nationalCode: string;
  taxId: string;
  customerType: CustomerType;
} 
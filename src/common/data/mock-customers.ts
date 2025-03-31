import { Customer, CustomerType } from '../../pages/Accountant/Customers/types';

export const mockCustomers: Customer[] = [
  {
    id: '1',
    basicInfo: {
      isFirm: true,
      companyName: 'Tech Solutions Ltd',
      firstName: 'Tech',
      lastName: 'Solutions',
      nationalCode: '12345',
      taxId: 'TX123456',
      customerType: CustomerType.BOTH,
    },
    details: {
      address: '123 Tech Street, Silicon Valley, CA',
    },
    createdAt: new Date(2024, 0, 1).toISOString(),
    updatedAt: new Date(2024, 0, 1).toISOString(),
  },
  {
    id: '2',
    basicInfo: {
      isFirm: false,
      firstName: 'John',
      lastName: 'Doe',
      nationalCode: '67890',
      taxId: 'TX789012',
      customerType: CustomerType.BUYER,
    },
    details: {
      address: '456 Customer Ave, New York, NY',
    },
    createdAt: new Date(2024, 0, 15).toISOString(),
    updatedAt: new Date(2024, 0, 15).toISOString(),
  },
  {
    id: '3',
    basicInfo: {
      isFirm: true,
      companyName: 'Global Trade Inc',
      firstName: 'Global',
      lastName: 'Trade',
      nationalCode: '11223',
      taxId: 'TX345678',
      customerType: CustomerType.SELLER,
    },
    details: {
      address: '789 Business Blvd, Chicago, IL',
    },
    createdAt: new Date(2024, 1, 1).toISOString(),
    updatedAt: new Date(2024, 1, 1).toISOString(),
  },
]; 
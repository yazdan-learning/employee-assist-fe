import { Customer, CustomerBasicInfo, CustomerContactInfo, CustomerAdditionalDetails, CustomerInfo } from '../pages/Accountant/Customers/types';
import { mockCustomers } from '../common/data/mock-customers';
import { ListRequest, ListResponse } from '../types/common';

class CustomerService {
  private customers: Customer[] = [...mockCustomers];

  getAllCustomers(request: ListRequest): Promise<ListResponse<CustomerInfo>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        let filteredCustomers = [...this.customers].map(customer => ({
          id: customer.id,
          name: customer.basicInfo.isFirm 
            ? customer.basicInfo.companyName || ''
            : `${customer.basicInfo.firstName} ${customer.basicInfo.lastName}`,
          isFirm: customer.basicInfo.isFirm,
          companyName: customer.basicInfo.companyName,
          firstName: customer.basicInfo.firstName,
          lastName: customer.basicInfo.lastName,
          nationalCode: customer.basicInfo.nationalCode,
          taxId: customer.basicInfo.taxId,
          customerType: customer.basicInfo.customerType,
          address: customer.contactInfo.addresses[0]?.address || ''
        }));

        // Apply search
        if (request.searchTerm) {
          const searchLower = request.searchTerm.toLowerCase();
          filteredCustomers = filteredCustomers.filter(customer => 
            customer.name.toLowerCase().includes(searchLower) ||
            customer.nationalCode.toLowerCase().includes(searchLower) ||
            customer.taxId.toLowerCase().includes(searchLower)
          );
        }

        // Apply sorting
        if (request.sortField && request.sortDirection) {
          filteredCustomers.sort((a, b) => {
            const aValue = a[request.sortField as keyof CustomerInfo];
            const bValue = b[request.sortField as keyof CustomerInfo];
            
            if (typeof aValue === 'string' && typeof bValue === 'string') {
              return request.sortDirection === 'desc' 
                ? bValue.localeCompare(aValue) 
                : aValue.localeCompare(bValue);
            }
            if (typeof aValue === 'number' && typeof bValue === 'number') {
              return request.sortDirection === 'desc' 
                ? bValue - aValue 
                : aValue - bValue;
            }
            return 0;
          });
        }

        // Calculate pagination
        const totalItems = filteredCustomers.length;
        const totalPages = Math.ceil(totalItems / request.pageSize);
        const start = (request.page - 1) * request.pageSize;
        const end = start + request.pageSize;
        
        resolve({
          data: filteredCustomers.slice(start, end),
          currentPage: request.page,
          pageSize: request.pageSize,
          totalItems,
          totalPages
        });
      }, 500);
    });
  }

  getCustomerById(id: string): Promise<Customer | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const customer = this.customers.find(c => c.id === id) || null;
        resolve(customer);
      }, 500);
    });
  }

  createCustomer(
    basicInfo: CustomerBasicInfo, 
    contactInfo: CustomerContactInfo, 
    additionalDetails: CustomerAdditionalDetails
  ): Promise<Customer> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newCustomer: Customer = {
          id: Math.random().toString(36).substr(2, 9),
          basicInfo,
          contactInfo,
          additionalDetails
        };
        this.customers.push(newCustomer);
        resolve(newCustomer);
      }, 500);
    });
  }

  updateCustomer(
    id: string,
    basicInfo?: Partial<CustomerBasicInfo>,
    contactInfo?: Partial<CustomerContactInfo>,
    additionalDetails?: Partial<CustomerAdditionalDetails>
  ): Promise<Customer> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.customers.findIndex(c => c.id === id);
        if (index === -1) {
          reject(new Error('Customer not found'));
          return;
        }

        const updatedCustomer: Customer = {
          ...this.customers[index],
          basicInfo: {
            ...this.customers[index].basicInfo,
            ...basicInfo,
          },
          contactInfo: {
            ...this.customers[index].contactInfo,
            ...contactInfo,
          },
          additionalDetails: {
            ...this.customers[index].additionalDetails,
            ...additionalDetails,
          }
        };

        this.customers[index] = updatedCustomer;
        resolve(updatedCustomer);
      }, 500);
    });
  }

  deleteCustomer(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.customers.findIndex(c => c.id === id);
        if (index === -1) {
          reject(new Error('Customer not found'));
          return;
        }

        this.customers.splice(index, 1);
        resolve();
      }, 500);
    });
  }
}

export const customerService = new CustomerService(); 
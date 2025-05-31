import { Customer } from '../pages/Accountant/Customers/types';
import { ListRequest, ListResponse } from '../types/common';
import { mockCustomers } from '../common/data/mock-customers';

class FakeCustomerService {
  private customers: Customer[] = [...mockCustomers];

  async getAllCustomers(request: ListRequest): Promise<ListResponse<Customer>> {
    let filteredCustomers = [...this.customers];

    // Apply search
    if (request.searchTerm) {
      const searchLower = request.searchTerm.toLowerCase();
      filteredCustomers = filteredCustomers.filter(customer => 
        `${customer.firstName} ${customer.lastName}`.toLowerCase().includes(searchLower) ||
        customer.nationalId.toLowerCase().includes(searchLower) ||
        customer.taxId.toLowerCase().includes(searchLower)
      );
    }

    // Apply sorting
    if (request.sortField && request.sortDirection) {
      filteredCustomers.sort((a, b) => {
        const aValue = a[request.sortField as keyof Customer];
        const bValue = b[request.sortField as keyof Customer];
        
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
    
    return {
      data: filteredCustomers.slice(start, end),
      currentPage: request.page,
      pageSize: request.pageSize,
      totalItems,
      totalPages
    };
  }

  async getCustomerById(id: number): Promise<Customer | null> {
    const customer = this.customers.find(c => c.id === id) || null;
    return customer;
  }

  async createCustomer(customer: Customer): Promise<Customer> {
    const newCustomer: Customer = {
      ...customer,
      id: Math.floor(Math.random() * 10000) + 1 // Generate a random number ID
    };
    this.customers.push(newCustomer);
    return newCustomer;
  }

  async updateCustomer(id: number, customerData: Partial<Customer>): Promise<Customer> {
    const index = this.customers.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Customer not found');
    }

    const updatedCustomer: Customer = {
      ...this.customers[index],
      ...customerData,
    };

    this.customers[index] = updatedCustomer;
    return updatedCustomer;
  }

  async deleteCustomer(id: number): Promise<void> {
    const index = this.customers.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Customer not found');
    }

    this.customers.splice(index, 1);
  }
}

export const fakeCustomerService = new FakeCustomerService(); 
import { Customer, CustomerBasicInfo, CustomerDetails } from '../pages/Accountant/Customers/types';
import { mockCustomers } from '../common/data/mock-customers';

class CustomerService {
  private customers: Customer[] = [...mockCustomers];

  getAllCustomers(): Promise<Customer[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...this.customers]);
      }, 500); // Simulate network delay
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

  createCustomer(basicInfo: CustomerBasicInfo, details: CustomerDetails): Promise<Customer> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newCustomer: Customer = {
          id: Math.random().toString(36).substr(2, 9),
          basicInfo,
          details,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        this.customers.push(newCustomer);
        resolve(newCustomer);
      }, 500);
    });
  }

  updateCustomer(
    id: string,
    basicInfo: Partial<CustomerBasicInfo>,
    details: Partial<CustomerDetails>
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
          ...basicInfo,
          details: {
            ...this.customers[index].details,
            ...details,
          },
          updatedAt: new Date().toISOString(),
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
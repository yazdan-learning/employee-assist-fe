import { Customer } from '../pages/Accountant/Customers/types';
import { ListRequest, ListResponse } from '../types/common';
import { APIClient } from '../helpers/api_helper';
import { API_CONFIG } from '../config/api.config';

class CustomerService {
  private api: APIClient;
  private endpoint: string;

  constructor() {
    this.api = new APIClient();
    this.endpoint = API_CONFIG.ENDPOINTS.CUSTOMERS;
  }

  async getAllCustomers(request: ListRequest): Promise<ListResponse<Customer>> {
    try {
      const response = await this.api.get(this.endpoint, request);
      return (response as unknown) as ListResponse<Customer>;
    } catch (error) {
      throw new Error(`Failed to fetch customers: ${error}`);
    }
  }

  async getCustomerById(id: number): Promise<Customer> {
    try {
      const response = await this.api.get(`${this.endpoint}/${id}`, null);
      return (response as unknown) as Customer;
    } catch (error) {
      throw new Error(`Failed to fetch customer with ID ${id}: ${error}`);
    }
  }

  async createCustomer(customer: Customer): Promise<Customer> {
    try {
      const response = await this.api.create(this.endpoint, customer);
      return (response as unknown) as Customer;
    } catch (error) {
      throw new Error(`Failed to create customer: ${error}`);
    }
  }

  async updateCustomer(customerData: Partial<Customer>): Promise<Customer> {
    try {
      const response = await this.api.update(this.endpoint, customerData);
      return (response as unknown) as Customer;
    } catch (error) {
      throw new Error(`Failed to update customer: ${error}`);
    }
  }

  async deleteCustomer(id: number): Promise<void> {
    try {
      await this.api.delete(`${this.endpoint}/${id}`, null);
    } catch (error) {
      throw new Error(`Failed to delete customer with ID ${id}: ${error}`);
    }
  }
}

export const customerService = new CustomerService(); 
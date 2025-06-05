import { Customer, CustomerInfo } from '../pages/Accountant/Customers/types';
import { ListRequest, ListResponse, BaseResponse } from '../types/common';
import { APIClient } from '../helpers/api_helper';
import { API_CONFIG } from '../config/api.config';

class CustomerService {
  private api: APIClient;
  private endpoint: string;

  constructor() {
    this.api = new APIClient();
    this.endpoint =
    API_CONFIG.SERVICES.ACCOUNTANT.BASE_URL +
    API_CONFIG.SERVICES.ACCOUNTANT.ENDPOINTS.CUSTOMERS;
  }

  async getAllCustomers(request: ListRequest): Promise<ListResponse<CustomerInfo>> {
    try {
      const requestToServer = {
        ...request,
        sortDirection: request.sortDirection === 'asc' ? 0 : 1
      };
      const response = await this.api.create(`${this.endpoint}/paged`, requestToServer);
      return response as unknown as ListResponse<CustomerInfo>;
    } catch (error) {
      throw new Error(`Failed to fetch customers: ${error}`);
    }
  }

  async getCustomerById(id: number): Promise<BaseResponse<Customer>> {
    try {
      const response = await this.api.get(`${this.endpoint}/${id}`, null);
      return response as unknown as BaseResponse<Customer>;
    } catch (error) {
      throw new Error(`Failed to fetch customer with ID ${id}: ${error}`);
    }
  }

  async createCustomer(customer: Customer): Promise<BaseResponse<Customer>> {
    try {
      const customerToSend = {
        ...customer,
        phone: customer.phone.join(',')
      };
      const response = await this.api.create(this.endpoint, customerToSend);
      return response as unknown as BaseResponse<Customer>;
    } catch (error) {
      throw new Error(`Failed to create customer: ${error}`);
    }
  }

  async updateCustomer(customerData: Partial<Customer>): Promise<BaseResponse<Customer>> {
    try {
      const response = await this.api.update(this.endpoint, customerData);
      return response as unknown as BaseResponse<Customer>;
    } catch (error) {
      throw new Error(`Failed to update customer: ${error}`);
    }
  }

  async deleteCustomer(id: number): Promise<BaseResponse<void>> {
    try {
      const response = await this.api.delete(`${this.endpoint}/${id}`, null);
      return response as unknown as BaseResponse<void>;
    } catch (error) {
      throw new Error(`Failed to delete customer with ID ${id}: ${error}`);
    }
  }
}

export const customerService = new CustomerService(); 
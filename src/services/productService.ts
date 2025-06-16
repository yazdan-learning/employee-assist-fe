import { Product, AttributeValue, ProductInfo } from '../pages/Accountant/Products/types';
import { ListRequest, ListResponse, BaseResponse } from '../types/common';
import { APIClient } from '../helpers/api_helper';
import { API_CONFIG } from '../config/api.config';
import { mockCategories, mockAttributes, mockAttributeValues, mockUnits, mockLocations } from '../common/data/mock-products';
import { 
  mockSellTypes,
  mockWarehouses,
  mockWarehouseAddresses,
  mockCurrencies
} from "./mockData";
import { 
  Category, 
  Unit, 
  Attribute, 
  ProductSellType 
} from "../pages/Accountant/Products/types";

class ProductService {
  private api: APIClient;
  private endpoint: string;
  private mockProducts: Product[] = [];

  constructor() {
    this.api = new APIClient();
    this.endpoint = API_CONFIG.SERVICES.ACCOUNTANT.BASE_URL + '/products';
  }

  async getProducts(request: ListRequest): Promise<ListResponse<ProductInfo>> {
    try {
      const requestToServer = {
        ...request,
        sortDirection: request.sortDirection === 'asc' ? 0 : 1
      };
      const response = await this.api.create(`${this.endpoint}/paged`, requestToServer);
      return response as unknown as ListResponse<ProductInfo>;
    } catch (error) {
      throw new Error(`Failed to fetch products: ${error}`);
    }
  }

  async getProductById(id: number): Promise<BaseResponse<Product>> {
    try {
      const response = await this.api.get(`${this.endpoint}/${id}`, null);
      return response as unknown as BaseResponse<Product>;
    } catch (error) {
      throw new Error(`Failed to fetch product with ID ${id}: ${error}`);
    }
  }

  async createProduct(product: Product): Promise<BaseResponse<Product>> {
    try {
      const response = await this.api.create(this.endpoint, product);
      return response as unknown as BaseResponse<Product>;
    } catch (error) {
      throw new Error(`Failed to create product: ${error}`);
    }
  }

  async updateProduct(product: Product): Promise<BaseResponse<Product>> {
    try {
      const response = await this.api.put(`${this.endpoint}/${product.id}`, product);
      return response as unknown as BaseResponse<Product>;
    } catch (error) {
      throw new Error(`Failed to update product: ${error}`);
    }
  }

  async deleteProduct(id: number): Promise<BaseResponse<void>> {
    try {
      const response = await this.api.delete(`${this.endpoint}/${id}`, null);
      return response as unknown as BaseResponse<void>;
    } catch (error) {
      throw new Error(`Failed to delete product with ID ${id}: ${error}`);
    }
  }

  // Mock dropdown data methods
  async getCategories(): Promise<Category[]> {
    return Promise.resolve(mockCategories);
  }

  async getAttributes(): Promise<Attribute[]> {
    return Promise.resolve(mockAttributes);
  }

  async getAttributeValues(attributeId: number): Promise<AttributeValue[]> {
    return Promise.resolve(
      mockAttributeValues.filter((v) => v.attributeId === attributeId)
    );
  }

  async getUnits(): Promise<Unit[]> {
    return Promise.resolve(mockUnits);
  }

  async getLocations() {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockLocations;
  }

  async getSellTypes(): Promise<ProductSellType[]> {
    return Promise.resolve(mockSellTypes);
  }

  async getWarehouses(): Promise<typeof mockWarehouses> {
    return Promise.resolve(mockWarehouses);
  }

  async getWarehouseAddresses(warehouseId: number): Promise<typeof mockWarehouseAddresses> {
    return Promise.resolve(mockWarehouseAddresses.filter(addr => addr.warehouseId === warehouseId));
  }

  async getCurrencies(): Promise<typeof mockCurrencies> {
    return Promise.resolve(mockCurrencies);
  }

  generateProductCode(categoryCode: string): string {
    const timestamp = Date.now().toString().slice(-6);
    return `${categoryCode}-${timestamp}`;
  }
}

export const productService = new ProductService(); 
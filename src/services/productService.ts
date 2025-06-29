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
  private categoryEndpoint: string;
  private attributeEndpoint: string;
  private attributeValueEndpoint: string;
  private locationEndpoint: string;
  private priceEndpoint: string;
  private saleTypeEndpoint: string;
  private unitEndpoint: string;
  private warehouseEndpoint: string;
  
  constructor() {
    this.api = new APIClient();
    this.endpoint = API_CONFIG.SERVICES.ACCOUNTANT.BASE_URL + API_CONFIG.SERVICES.ACCOUNTANT.ENDPOINTS.PRODUCTS;
    this.categoryEndpoint = API_CONFIG.SERVICES.ACCOUNTANT.BASE_URL + API_CONFIG.SERVICES.ACCOUNTANT.ENDPOINTS.PRODUCT_CATEGORIES;
    this.attributeEndpoint = API_CONFIG.SERVICES.ACCOUNTANT.BASE_URL + API_CONFIG.SERVICES.ACCOUNTANT.ENDPOINTS.PRODUCT_ATTRIBUTES;
    this.attributeValueEndpoint = API_CONFIG.SERVICES.ACCOUNTANT.BASE_URL + API_CONFIG.SERVICES.ACCOUNTANT.ENDPOINTS.PRODUCT_ATTRIBUTE_VALUES;
    this.locationEndpoint = API_CONFIG.SERVICES.ACCOUNTANT.BASE_URL + API_CONFIG.SERVICES.ACCOUNTANT.ENDPOINTS.PRODUCT_LOCATIONS;
    this.priceEndpoint = API_CONFIG.SERVICES.ACCOUNTANT.BASE_URL + API_CONFIG.SERVICES.ACCOUNTANT.ENDPOINTS.PRODUCT_PRICES;
    this.saleTypeEndpoint = API_CONFIG.SERVICES.ACCOUNTANT.BASE_URL + API_CONFIG.SERVICES.ACCOUNTANT.ENDPOINTS.PRODUCT_SALE_TYPES;
    this.unitEndpoint = API_CONFIG.SERVICES.ACCOUNTANT.BASE_URL + API_CONFIG.SERVICES.ACCOUNTANT.ENDPOINTS.PRODUCT_UNITS;
    this.warehouseEndpoint = API_CONFIG.SERVICES.ACCOUNTANT.BASE_URL + API_CONFIG.SERVICES.ACCOUNTANT.ENDPOINTS.PRODUCT_WAREHOUSES;
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
    const response = await this.api.get(this.categoryEndpoint, null);
    const baseResponse = response as unknown as BaseResponse<Category[]>;
    return baseResponse.data;
  }

  async getAttributes(): Promise<Attribute[]> {
    const response = await this.api.get(this.attributeEndpoint, null);
    const baseResponse = response as unknown as BaseResponse<Attribute[]>;
    return baseResponse.data;
  }

  async getAttributeValues(attributeId: number): Promise<AttributeValue[]> {
    const response = await this.api.get(`${this.attributeValueEndpoint}?attributeId=${attributeId}`, null);
    const baseResponse = response as unknown as BaseResponse<AttributeValue[]>;
    return baseResponse.data;
  }

  async getUnits(): Promise<Unit[]> {
    const response = await this.api.get(this.unitEndpoint, null);
    const baseResponse = response as unknown as BaseResponse<Unit[]>;
    return baseResponse.data;
  }

  async getLocations() {
    const response = await this.api.get(this.locationEndpoint, null);
    const baseResponse = response as unknown as BaseResponse<typeof mockLocations>;
    return baseResponse.data;
  }

  async getSellTypes(): Promise<ProductSellType[]> {
    const response = await this.api.get(this.saleTypeEndpoint, null);
    const baseResponse = response as unknown as BaseResponse<ProductSellType[]>;
    return baseResponse.data;
  }

  async getWarehouses(): Promise<typeof mockWarehouses> {
    const response = await this.api.get(this.warehouseEndpoint, null);
    const baseResponse = response as unknown as BaseResponse<typeof mockWarehouses>;
    return baseResponse.data;
  }

  async getWarehouseAddresses(warehouseId: number): Promise<typeof mockWarehouseAddresses> {
    const response = await this.api.get(`${this.warehouseEndpoint}/${warehouseId}/addresses`, null);
    const baseResponse = response as unknown as BaseResponse<typeof mockWarehouseAddresses>;
    return baseResponse.data;
  }

  async getCurrencies(): Promise<typeof mockCurrencies> {
    // Note: No currency endpoint was provided in the list, keeping as mock data for now
    return Promise.resolve(mockCurrencies);
  }

}

export const productService = new ProductService(); 
import { Product, AttributeValue, ProductInfo } from '../pages/Accountant/Products/types';
import { ListRequest, ListResponse, BaseResponse } from '../types/common';
import { APIClient } from '../helpers/api_helper';
import { API_CONFIG } from '../config/api.config';
import {  mockLocations } from '../common/data/mock-products';
import { 
  mockCurrencies
} from "./mockData";
import { 
  Category, 
  Unit, 
  Attribute, 
  ProductSellType,
  Warehouse,
  WarehouseAddress
} from "../pages/Accountant/Products/types";

// API Request/Response interfaces
interface ApiProductRequest {
  id?: number;
  code: string;
  name: string;
  generatedName: string;
  isService: boolean;
  isPackaging: boolean;
  hasSerial: boolean;
  allowNegativeStock: boolean;
  taxPercentage: number;
  barcode?: string;
  description?: string;
  isActive: boolean;
  categoryId: number;
  attributeValueMappings: {
    id?: number;
    productAttributeId: number;
    productAttributeValueId: number;
  }[];
  productUnitMappings: {
    id?: number;
    unitId: number;
    isPrimary: boolean;
    conversionRate: number;
    weightPerUnit: number;
  }[];
  productInventories: {
    id?: number;
    warehouseId: number;
    productLocationId: number;
    quantity: number;
    reservedQuantity: number;
    minimumQuantity: number;
    maximumQuantity: number;
    lastUpdated: string;
  }[];
  productPrices: {
    id?: number;
    productSaleTypeId: number;
    discountPercent: number;
    price: number;
    isActive: boolean;
  }[];
}

type ApiProductResponse = ApiProductRequest;

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

  // Mapping functions
  private mapProductToApiRequest(product: Product): ApiProductRequest {
    return {
      id: product.id,
      code: product.code,
      name: product.name,
      generatedName: product.name, // Assuming generatedName is same as name
      isService: product.isService,
      isPackaging: product.isPackaging,
      hasSerial: product.hasSerial,
      allowNegativeStock: product.allowNegativeStock,
      taxPercentage: product.taxPercentage,
      barcode: product.barcode,
      description: product.description,
      isActive: product.isActive,
      categoryId: product.categoryId,
      attributeValueMappings: product.attributes.map(attr => ({
        id: attr.id,
        productAttributeId: attr.attributeId,
        productAttributeValueId: attr.valueId
      })),
      productUnitMappings: product.units.map(unit => ({
        id: unit.id,
        unitId: unit.unitId,
        isPrimary: unit.isPrimary,
        conversionRate: unit.conversionRate,
        weightPerUnit: unit.weightPerUnit
      })),
      productInventories: product.locations.map(location => ({
        id: 0, // New record
        warehouseId: location.warehouseId,
        productLocationId: location.addressId || 0,
        quantity: 0, // Default values
        reservedQuantity: 0,
        minimumQuantity: location.minQuantity || 0,
        maximumQuantity: location.maxQuantity || 0,
        lastUpdated: new Date().toISOString()
      })),
      productPrices: product.prices.map(price => ({
        id: price.id,
        productSaleTypeId: price.sellTypeId,
        discountPercent: 0, // Default value, you might want to adjust this
        price: price.price,
        isActive: true
      }))
    };
  }

  private mapApiResponseToProduct(apiProduct: ApiProductResponse): Product {
    return {
      id: apiProduct.id,
      categoryId: apiProduct.categoryId,
      code: apiProduct.code,
      name: apiProduct.name,
      description: apiProduct.description,
      isActive: apiProduct.isActive,
      isService: apiProduct.isService,
      hasSerial: apiProduct.hasSerial,
      allowNegativeStock: apiProduct.allowNegativeStock,
      isPackaging: apiProduct.isPackaging,
      taxPercentage: apiProduct.taxPercentage,
      barcode: apiProduct.barcode,
      locations: apiProduct.productInventories?.map(inventory => ({
        warehouseId: inventory.warehouseId,
        addressId: inventory.productLocationId,
        minQuantity: inventory.minimumQuantity,
        maxQuantity: inventory.maximumQuantity
      })),
      units: apiProduct.productUnitMappings?.map(unit => ({
        id: unit.id,
        unitId: unit.unitId,
        isPrimary: unit.isPrimary,
        conversionRate: unit.conversionRate,
        weightPerUnit: unit.weightPerUnit 
      })),
      attributes: apiProduct.attributeValueMappings?.map(attr => ({
        id: attr.id,
        attributeId: attr.productAttributeId,
        valueId: attr.productAttributeValueId
      })),
      prices: apiProduct.productPrices?.map(price => ({
        id: price.id,
        sellTypeId: price.productSaleTypeId,
        price: price.price,
        currency: '' // You might need to handle currency mapping
      })),
      images: [] // No images in API response, defaulting to empty array
    };
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
      const baseResponse = response as unknown as BaseResponse<ApiProductResponse>;
      
      // Map API response to Product type
      const mappedProduct = this.mapApiResponseToProduct(baseResponse.data);
      
      return {
        ...baseResponse,
        data: mappedProduct
      };
    } catch (error) {
      throw new Error(`Failed to fetch product with ID ${id}: ${error}`);
    }
  }

  async createProduct(product: Product): Promise<BaseResponse<Product>> {
    try {
      // Map Product to API request format
      const apiRequest = this.mapProductToApiRequest(product);
      
      const response = await this.api.create(this.endpoint, apiRequest);
      const baseResponse = response as unknown as BaseResponse<ApiProductResponse>;
      
      // Map API response back to Product type
      const mappedProduct = this.mapApiResponseToProduct(baseResponse.data);
      
      return {
        ...baseResponse,
        data: mappedProduct
      };
    } catch (error) {
      throw new Error(`Failed to create product: ${error}`);
    }
  }

  async updateProduct(product: Product): Promise<BaseResponse<Product>> {
    try {
      // Map Product to API request format
      const apiRequest = this.mapProductToApiRequest(product);
      
      const response = await this.api.put(`${this.endpoint}/${product.id}`, apiRequest);
      const baseResponse = response as unknown as BaseResponse<ApiProductResponse>;
      
      // Map API response back to Product type
      const mappedProduct = this.mapApiResponseToProduct(baseResponse.data);
      
      return {
        ...baseResponse,
        data: mappedProduct
      };
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

  async getWarehouses(): Promise<Warehouse[]> {
    const response = await this.api.get(this.warehouseEndpoint, null);
    const baseResponse = response as unknown as BaseResponse<Warehouse[]>;
    return baseResponse.data;
  }

  async getWarehouseAddresses(warehouseId: number): Promise<WarehouseAddress[]> {
    const response = await this.api.get(`${this.locationEndpoint}/warehouse/${warehouseId}`, null);
    const baseResponse = response as unknown as BaseResponse<WarehouseAddress[]>;
    return baseResponse.data;
  }

  async getCurrencies(): Promise<typeof mockCurrencies> {
    // Note: No currency endpoint was provided in the list, keeping as mock data for now
    return Promise.resolve(mockCurrencies);
  }

}

export const productService = new ProductService(); 
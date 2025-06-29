import { Product, AttributeValue, ProductInfo } from '../pages/Accountant/Products/types';
import { ListRequest, ListResponse, BaseResponse } from '../types/common';
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

class FakeProductService {
  private mockProducts: Product[] = [];

  async getProducts(request: ListRequest): Promise<ListResponse<ProductInfo>> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    let filteredProducts = [...this.mockProducts];

    // Apply search
    if (request.searchTerm) {
      const searchLower = request.searchTerm.toLowerCase();
      filteredProducts = filteredProducts.filter(product => 
        product.name.toLowerCase().includes(searchLower) ||
        product.barcode?.toLowerCase().includes(searchLower)
      );
    }

    // Apply sorting
    if (request.sortField && request.sortDirection) {
      filteredProducts.sort((a, b) => {
        const aValue = a[request.sortField as keyof Product];
        const bValue = b[request.sortField as keyof Product];
        
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
    const totalItems = filteredProducts.length;
    const totalPages = Math.ceil(totalItems / request.pageSize);
    const start = (request.page - 1) * request.pageSize;
    const end = start + request.pageSize;
    
    // Convert to ProductInfo for list view
    const items = filteredProducts.slice(start, end).map(product => ({
      id: (product.id || 0).toString(),
      name: product.name,
      code: product.code,
      categoryName: mockCategories.find(c => c.id === product.categoryId)?.name || '',
      isActive: product.isActive
    }));

    return {
      data: {
        items,
        totalCount: totalItems,
        pageNumber: request.page,
        pageSize: request.pageSize,
        totalPages: totalPages,
        hasPreviousPage: request.page > 1,
        hasNextPage: request.page < totalPages
      },
      succeeded: true,
      statusCode: 200,
      errors: null,
      message: null
    };
  }

  async getProductById(id: number): Promise<BaseResponse<Product>> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const product = this.mockProducts.find(p => p.id === id);
    
    if (!product) {
      return {
        data: {
          id: 0,
          name: "",
          code: "",
          description: "",
          barcode: "",
          isService: false,
          hasSerial: false,
          allowNegativeStock: false,
          isActive: false,
          categoryId: 0,
          attributes: [],
          units: [],
          locations: [],
          images: [],
          prices: [],
          taxAmount: 0
        },
        succeeded: false,
        statusCode: 404,
        errors: "Product not found",
        message: "Product not found"
      };
    }

    return {
      data: product,
      succeeded: true,
      statusCode: 200,
      errors: null,
      message: null
    };
  }

  async createProduct(product: Product): Promise<BaseResponse<Product>> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Ensure at least one unit is marked as primary
    if (product.units.length > 0 && !product.units.some(u => u.isPrimary)) {
      product.units[0].isPrimary = true;
    }

    // Generate IDs for new units
    product.units = product.units.map((unit, index) => ({
      ...unit,
      id: Math.max(0, ...this.mockProducts.flatMap(p => p.units.map(u => u.id || 0))) + index + 1
    }));
    
    const newProduct = {
      ...product,
      id: Math.max(0, ...this.mockProducts.map(p => p.id || 0)) + 1
    };
    
    this.mockProducts.push(newProduct);

    return {
      data: newProduct,
      succeeded: true,
      statusCode: 200,
      errors: null,
      message: null
    };
  }

  async updateProduct(product: Product): Promise<BaseResponse<Product>> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const index = this.mockProducts.findIndex(p => p.id === product.id);
    if (index === -1) {
      return {
        data: {
          id: 0,
          name: "",
          code: "",
          description: "",
          barcode: "",
          isService: false,
          hasSerial: false,
          allowNegativeStock: false,
          isActive: true,
          categoryId: 0,
          attributes: [],
          units: [],
          locations: [],
          images: [],
          prices: [],
          taxAmount: 0
        },
        succeeded: false,
        statusCode: 404,
        errors: "Product not found",
        message: "Product not found"
      };
    }

    // Ensure at least one unit is marked as primary
    if (product.units.length > 0 && !product.units.some(u => u.isPrimary)) {
      product.units[0].isPrimary = true;
    }

    // Generate IDs for any new units
    product.units = product.units.map(unit => {
      if (!unit.id) {
        return {
          ...unit,
          id: Math.max(0, ...this.mockProducts.flatMap(p => p.units.map(u => u.id || 0))) + 1
        };
      }
      return unit;
    });

    this.mockProducts[index] = product;

    return {
      data: product,
      succeeded: true,
      statusCode: 200,
      errors: null,
      message: null
    };
  }

  async deleteProduct(id: number): Promise<BaseResponse<void>> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const index = this.mockProducts.findIndex(p => p.id === id);
    if (index === -1) {
      return {
        data: undefined,
        succeeded: false,
        statusCode: 404,
        errors: "Product not found",
        message: "Product not found"
      };
    }

    this.mockProducts.splice(index, 1);

    return {
      data: undefined,
      succeeded: true,
      statusCode: 200,
      errors: null,
      message: null
    };
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

export const fakeProductService = new FakeProductService(); 
import { Product, ProductFormData, ProductInfo } from "../pages/Accountant/Products/types";
import { ListRequest, ListResponse } from "../types/common";
import { v4 as uuidv4 } from 'uuid';
import { mockProducts as initialMockProducts } from "../common/data/mock-products";

// Use the mock data from the data folder
// Using let because this array is modified by CRUD operations
/* eslint-disable prefer-const */
let mockProducts = [...initialMockProducts];
/* eslint-enable prefer-const */

// Mock API functions
export const getProducts = async (request: ListRequest): Promise<ListResponse<ProductInfo>> => {
  console.log("request", request);
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredProducts = [...mockProducts].map(product => ({
        id: product.id,
        name: product.basicInfo.name,
        sku: product.basicInfo.sku,
        price: product.basicInfo.price,
        description: product.basicInfo.description,
        category: product.details.category,
        stock: product.details.stock,
        cost: product.details.cost,
        barcode: product.details.barcode,
        image: product.details.image,
        status: product.status,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt
      }));

      // Apply search
      if (request.searchTerm) {
        const searchLower = request.searchTerm.toLowerCase();
        filteredProducts = filteredProducts.filter(product => 
          product.name.toLowerCase().includes(searchLower) ||
          product.sku.toLowerCase().includes(searchLower) ||
          product.category.toLowerCase().includes(searchLower)
        );
      }

      // Apply sorting
      if (request.sortField) {
        filteredProducts.sort((a, b) => {
          const aValue = a[request.sortField!];
          const bValue = b[request.sortField!];
          
          if (typeof aValue === 'string') {
            return request.sortDirection === 'desc' 
              ? bValue.localeCompare(aValue) 
              : aValue.localeCompare(bValue);
          }
          return request.sortDirection === 'desc' 
            ? bValue - aValue 
            : aValue - bValue;
        });
      }

      // Calculate pagination
      const totalItems = filteredProducts.length;
      const totalPages = Math.ceil(totalItems / request.pageSize);
      const start = (request.page - 1) * request.pageSize;
      const end = start + request.pageSize;
      
      resolve({
        data: {
          items: filteredProducts.slice(start, end),
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
      });
    }, 500);
  });
};

export const getProductById = async (id: string): Promise<Product> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const product = mockProducts.find((p) => p.id === id);
      if (product) {
        resolve(product);
      } else {
        reject(new Error("Product not found"));
      }
    }, 500);
  });
};

export const createProduct = async (data: ProductFormData): Promise<Product> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newProduct: Product = {
        id: uuidv4(),
        basicInfo: {
          name: data.name,
          description: data.description,
          price: data.price,
          sku: data.sku
        },
        details: {
          category: data.category,
          cost: data.cost,
          stock: data.stock,
          barcode: data.barcode,
          image: data.image
        },
        status: data.status,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      mockProducts.push(newProduct);
      resolve(newProduct);
    }, 500);
  });
};

export const updateProduct = async (id: string, data: ProductFormData): Promise<Product> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockProducts.findIndex((p) => p.id === id);
      if (index !== -1) {
        const updatedProduct: Product = {
          id,
          basicInfo: {
            name: data.name,
            description: data.description,
            price: data.price,
            sku: data.sku
          },
          details: {
            category: data.category,
            cost: data.cost,
            stock: data.stock,
            barcode: data.barcode,
            image: data.image
          },
          status: data.status,
          createdAt: mockProducts[index].createdAt,
          updatedAt: new Date().toISOString()
        };
        mockProducts[index] = updatedProduct;
        resolve(updatedProduct);
      } else {
        reject(new Error("Product not found"));
      }
    }, 500);
  });
};

export const deleteProduct = async (id: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockProducts.findIndex((p) => p.id === id);
      if (index !== -1) {
        mockProducts.splice(index, 1);
        resolve();
      } else {
        reject(new Error("Product not found"));
      }
    }, 500);
  });
}; 
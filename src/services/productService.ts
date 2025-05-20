import { Product, ProductFormData } from "../pages/Accountant/Products/types";
import { ListRequest, ListResponse } from "../types/common";
import { v4 as uuidv4 } from 'uuid';
import { mockProducts as initialMockProducts } from "../common/data/mock-products";

// Use the mock data from the data folder
// Using let because this array is modified by CRUD operations
/* eslint-disable prefer-const */
let mockProducts = [...initialMockProducts];
/* eslint-enable prefer-const */

// Mock API functions
export const getProducts = async (request: ListRequest): Promise<ListResponse<Product>> => {
  console.log("request", request);
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredProducts = [...mockProducts];

      // Apply search
      if (request.searchTerm) {
        const searchLower = request.searchTerm.toLowerCase();
        filteredProducts = filteredProducts.filter(product => 
          product.basicInfo.name.toLowerCase().includes(searchLower) ||
          product.basicInfo.sku.toLowerCase().includes(searchLower) ||
          product.details.category.toLowerCase().includes(searchLower)
        );
      }

      // Apply sorting
      if (request.sortField) {
        const fields = request.sortField.split('.');
        filteredProducts.sort((a: any, b: any) => {
          const aValue = fields.reduce((obj, field) => obj[field], a);
          const bValue = fields.reduce((obj, field) => obj[field], b);
          
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
        data: filteredProducts.slice(start, end),
        currentPage: request.page,
        pageSize: request.pageSize,
        totalItems,
        totalPages
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
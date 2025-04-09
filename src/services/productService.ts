import { Product, ProductFormData, ProductStatus } from "../pages/Accountant/Products/types";
import { v4 as uuidv4 } from 'uuid';

// Mock data
const mockProducts: Product[] = [
  {
    id: "1",
    name: "Product 1",
    description: "Description for product 1",
    category: "Category 1",
    price: 100,
    cost: 80,
    stock: 50,
    sku: "SKU001",
    status: ProductStatus.ACTIVE,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Product 2",
    description: "Description for product 2",
    category: "Category 2",
    price: 200,
    cost: 150,
    stock: 30,
    sku: "SKU002",
    status: ProductStatus.ACTIVE,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Mock API functions
export const getProducts = async (): Promise<Product[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockProducts);
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
        ...data,
        id: uuidv4(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
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
          ...data,
          id,
          createdAt: mockProducts[index].createdAt,
          updatedAt: new Date().toISOString(),
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
import { Category, Unit, Attribute, AttributeValue, ProductSellType } from "../pages/Accountant/Products/types";

export const mockCategories: Category[] = [
  { id: 1, code: "ELEC", name: "Electronics" },
  { id: 2, code: "CLOTH", name: "Clothing" },
  { id: 3, code: "FOOD", name: "Food & Beverages" },
];

export const mockUnits: Unit[] = [
  { id: 1, name: "Piece" },
  { id: 2, name: "Box" },
  { id: 3, name: "Kilogram" },
];

export const mockAttributes: Attribute[] = [
  { id: 1, name: "Color" },
  { id: 2, name: "Size" },
  { id: 3, name: "Material" },
];

export const mockAttributeValues: AttributeValue[] = [
  { id: 1, attributeId: 1, value: "Red" },
  { id: 2, attributeId: 1, value: "Blue" },
  { id: 3, attributeId: 2, value: "Small" },
  { id: 4, attributeId: 2, value: "Medium" },
  { id: 5, attributeId: 3, value: "Cotton" },
  { id: 6, attributeId: 3, value: "Polyester" },
];

export const mockSellTypes: ProductSellType[] = [
  { id: 1, name: "Retail", discountPercentage: 0 },
  { id: 2, name: "Wholesale", discountPercentage: 10 },
  { id: 3, name: "Distributor", discountPercentage: 20 },
];

export const mockWarehouses = [
  { id: 1, name: "Main Warehouse" },
  { id: 2, name: "Secondary Warehouse" },
];

export const mockWarehouseAddresses = [
  { id: 1, warehouseId: 1, address: "123 Main St" },
  { id: 2, warehouseId: 1, address: "456 Side St" },
  { id: 3, warehouseId: 2, address: "789 Back St" },
]; 
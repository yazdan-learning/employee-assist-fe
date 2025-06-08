import { Product, Category, Attribute, AttributeValue, Unit, Location, ProductAttribute } from "../../pages/Accountant/Products/types";

// Mock data for dropdowns
export const mockCategories: Category[] = [
  { id: 1, name: "Electronics" },
  { id: 2, name: "Accessories" },
  { id: 3, name: "Gaming" },
  { id: 4, name: "Audio" },
  { id: 5, name: "Storage" },
  { id: 6, name: "Networking" },
  { id: 7, name: "Software" },
  { id: 8, name: "Cameras" },
  { id: 9, name: "Printers" },
  { id: 10, name: "Components" }
];

export const mockAttributes: Attribute[] = [
  { id: 1, name: "Color" },
  { id: 2, name: "Size" },
  { id: 3, name: "Material" },
  { id: 4, name: "Brand" },
  { id: 5, name: "Condition" }
];

export const mockAttributeValues: AttributeValue[] = [
  // Colors
  { id: 1, attributeId: 1, value: "Black" },
  { id: 2, attributeId: 1, value: "White" },
  { id: 3, attributeId: 1, value: "Silver" },
  { id: 4, attributeId: 1, value: "Blue" },
  // Sizes
  { id: 5, attributeId: 2, value: "Small" },
  { id: 6, attributeId: 2, value: "Medium" },
  { id: 7, attributeId: 2, value: "Large" },
  // Materials
  { id: 8, attributeId: 3, value: "Plastic" },
  { id: 9, attributeId: 3, value: "Metal" },
  { id: 10, attributeId: 3, value: "Glass" },
  // Brands
  { id: 11, attributeId: 4, value: "TechPro" },
  { id: 12, attributeId: 4, value: "GameMax" },
  { id: 13, attributeId: 4, value: "DataStore" },
  { id: 14, attributeId: 4, value: "AudioPhile" },
  // Conditions
  { id: 15, attributeId: 5, value: "New" },
  { id: 16, attributeId: 5, value: "Refurbished" },
  { id: 17, attributeId: 5, value: "Used" }
];

export const mockUnits: Unit[] = [
  { id: 1, name: "Piece" },
  { id: 2, name: "Set" },
  { id: 3, name: "Box" },
  { id: 4, name: "Pack" }
];

export const mockLocations: Location[] = [
  { id: 1, name: "Main Warehouse" },
  { id: 2, name: "Store Front" },
  { id: 3, name: "Back Store" },
  { id: 4, name: "Service Center" }
];

const productTypes = {
  Electronics: ["Laptop", "Desktop", "Tablet", "Smartphone", "Monitor", "TV"],
  Accessories: ["Mouse", "Keyboard", "Headset", "Webcam", "USB Hub", "Dock"],
  Gaming: ["Controller", "Gaming Chair", "Gaming Mouse", "Gaming Keyboard"],
  Audio: ["Speakers", "Headphones", "Microphone", "Sound Card", "Earbuds"],
  Storage: ["SSD", "HDD", "USB Drive", "Memory Card", "External Drive"],
  Networking: ["Router", "Switch", "Access Point", "Network Card", "Cable"],
  Software: ["Antivirus", "Office Suite", "Design Software", "Operating System"],
  Cameras: ["DSLR", "Mirrorless", "Action Camera", "Security Camera", "Lens"],
  Printers: ["Laser Printer", "Inkjet Printer", "3D Printer", "Scanner"],
  Components: ["CPU", "GPU", "RAM", "Motherboard", "Power Supply"]
};

// Helper function to generate random attributes for a product
const generateRandomAttributes = (categoryId: number): ProductAttribute[] => {
  const attributes: ProductAttribute[] = [];
  
  // Always add a brand (attributeId: 4)
  const brandValueIds = mockAttributeValues.filter(v => v.attributeId === 4).map(v => v.id);
  attributes.push({
    attributeId: 4,
    valueId: brandValueIds[Math.floor(Math.random() * brandValueIds.length)]
  });

  // Add condition (attributeId: 5) with 80% chance
  if (Math.random() < 0.8) {
    const conditionValueIds = mockAttributeValues.filter(v => v.attributeId === 5).map(v => v.id);
    attributes.push({
      attributeId: 5,
      valueId: conditionValueIds[Math.floor(Math.random() * conditionValueIds.length)]
    });
  }

  // Add color for certain categories
  if ([1, 2, 3, 4, 8].includes(categoryId)) { // Electronics, Accessories, Gaming, Audio, Cameras
    const colorValueIds = mockAttributeValues.filter(v => v.attributeId === 1).map(v => v.id);
    attributes.push({
      attributeId: 1,
      valueId: colorValueIds[Math.floor(Math.random() * colorValueIds.length)]
    });
  }

  // Add size for certain categories
  if ([2, 3].includes(categoryId)) { // Accessories, Gaming
    const sizeValueIds = mockAttributeValues.filter(v => v.attributeId === 2).map(v => v.id);
    attributes.push({
      attributeId: 2,
      valueId: sizeValueIds[Math.floor(Math.random() * sizeValueIds.length)]
    });
  }

  return attributes;
};

const generateSampleProducts = (): Product[] => {
  const products: Product[] = [];

  for (let i = 1; i <= 100; i++) {
    const categoryId = Math.floor(Math.random() * mockCategories.length) + 1;
    const category = mockCategories.find(c => c.id === categoryId)!;
    const productType = productTypes[category.name as keyof typeof productTypes][
      Math.floor(Math.random() * productTypes[category.name as keyof typeof productTypes].length)
    ];
    
    // Generate attributes
    const attributes = generateRandomAttributes(categoryId);
    
    // Generate units (1-3 units per product)
    const numUnits = Math.floor(Math.random() * 3) + 1;
    const units = Array.from({ length: numUnits }, (_, index) => {
      const unitId = Math.floor(Math.random() * mockUnits.length) + 1;
      return {
        id: i * 10 + index, // Generate unique ID for each unit
        unitId,
        isPrimary: index === 0, // First unit is primary
        conversionRate: index === 0 ? 1 : Math.random() * 10 + 0.1, // Random conversion rate between 0.1 and 10.1
        weightPerUnit: Math.random() * 5 // Random weight between 0 and 5
      };
    });
    
    const locationId = Math.random() > 0.2 ? Math.floor(Math.random() * mockLocations.length) + 1 : null;
    
    products.push({
      id: i,
      name: `${productType} ${Math.floor(Math.random() * 1000)}`,
      barcode: `${Math.floor(Math.random() * 1000000000000)}`,
      isService: Math.random() < 0.1, // 10% chance of being a service
      hasSerial: Math.random() < 0.3, // 30% chance of having serial
      allowNegativeStock: Math.random() < 0.2, // 20% chance of allowing negative stock
      categoryId,
      attributes,
      units,
      locationId
    });
  }
  
  return products;
};

export const mockProducts = generateSampleProducts(); 
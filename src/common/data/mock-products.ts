import { Product, ProductStatus } from "../../pages/Accountant/Products/types";

const categories = ["Electronics", "Accessories", "Gaming", "Audio", "Storage", "Networking", "Software", "Cameras", "Printers", "Components"];
const productTypes = {
  Electronics: ["Laptop", "Desktop", "Tablet", "Smartphone", "Monitor", "TV", "Console"],
  Accessories: ["Mouse", "Keyboard", "Headset", "Webcam", "USB Hub", "Dock", "Case"],
  Gaming: ["Controller", "Gaming Chair", "Gaming Mouse", "Gaming Keyboard", "Headset", "Mouse Pad"],
  Audio: ["Speakers", "Headphones", "Microphone", "Sound Card", "Earbuds", "Audio Interface"],
  Storage: ["SSD", "HDD", "USB Drive", "Memory Card", "NAS", "External Drive"],
  Networking: ["Router", "Switch", "Access Point", "Network Card", "Cable", "Adapter"],
  Software: ["Antivirus", "Office Suite", "Design Software", "Game", "Operating System"],
  Cameras: ["DSLR", "Mirrorless", "Action Camera", "Security Camera", "Lens", "Flash"],
  Printers: ["Laser Printer", "Inkjet Printer", "3D Printer", "Scanner", "Label Printer"],
  Components: ["CPU", "GPU", "RAM", "Motherboard", "Power Supply", "Case Fan"]
};

const brands = ["TechPro", "GameMax", "DataStore", "AudioPhile", "NetGear", "CompuTech", "DigiCam", "PrintMaster", "CoreTech"];

const generateSampleProducts = (): Product[] => {
  const products: Product[] = [];

  for (let i = 1; i <= 1000; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const productType = productTypes[category as keyof typeof productTypes][
      Math.floor(Math.random() * productTypes[category as keyof typeof productTypes].length)
    ];
    const brand = brands[Math.floor(Math.random() * brands.length)];
    const basePrice = 50 + Math.random() * 950;
    const cost = basePrice * (0.6 + Math.random() * 0.2);
    const stock = Math.floor(Math.random() * 200);
    
    products.push({
      id: i.toString(),
      basicInfo: {
        name: `${brand} ${productType} ${Math.floor(Math.random() * 1000)}`,
        description: `High-quality ${productType.toLowerCase()} from ${brand} with premium features and reliable performance`,
        price: Math.round(basePrice * 100) / 100,
        sku: `${category.substring(0, 3).toUpperCase()}${i.toString().padStart(4, '0')}`
      },
      details: {
        category,
        cost: Math.round(cost * 100) / 100,
        stock,
        barcode: `${Math.floor(Math.random() * 1000000000000)}`,
        image: `product_${i}.jpg`
      },
      status: stock === 0 ? ProductStatus.OUT_OF_STOCK : 
              stock < 10 ? ProductStatus.INACTIVE : 
              ProductStatus.ACTIVE,
      createdAt: new Date(Date.now() - Math.random() * 31536000000).toISOString(),
      updatedAt: new Date(Date.now() - Math.random() * 15768000000).toISOString()
    });
  }
  
  return products;
};

export const mockProducts = generateSampleProducts(); 
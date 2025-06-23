import { Invoice, InvoiceType } from "../../pages/Accountant/Invoice/types";

export const mockInvoices: Invoice[] = [
  {
    id: 1,
    type: InvoiceType.SELL,
    number: "INV-2024-001",
    date: "2024-01-15",
    description: "Monthly office supplies",
    partnerId: 1, // References a seller
    partnerName: "Acme Corporation",
    details: [
      {
        id: 1,
        productId: 1,
        unitId: 1,
        primaryUnitId: 1,
        quantity: 5,
        unitPrice: 100,
        discount: 10,
        vat: 19,
        finalPrice: 535.5,
        conversionRate: 1
      },
      {
        id: 2,
        productId: 2,
        unitId: 2,
        primaryUnitId: 1,
        quantity: 2,
        unitPrice: 200,
        discount: 20,
        vat: 19,
        finalPrice: 452.2,
        conversionRate: 1
      }
    ],
    totalAmount: 900,
    totalVat: 171,
    totalDiscount: 83.3,
    finalAmount: 987.7,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z"
  },
  {
    id: 2,
    type: InvoiceType.BUY,
    number: "INV-2024-002",
    date: "2024-01-16",
    description: "Raw materials purchase",
    partnerId: 2, // References a buyer
    partnerName: "Global Supplies Ltd.",
    details: [
      {
        id: 3,
        productId: 3,
        unitId: 3,
        primaryUnitId: 1,
        quantity: 10,
        unitPrice: 50,
        discount: 25,
        vat: 19,
        finalPrice: 565.25,
        conversionRate: 1
      }
    ],
    totalAmount: 500,
    totalVat: 95,
    totalDiscount: 25,
    finalAmount: 565.25,
    createdAt: "2024-01-16T10:00:00Z",
    updatedAt: "2024-01-16T10:00:00Z"
  }
];

// Helper function to generate a new invoice number
export const generateInvoiceNumber = (type: InvoiceType): string => {
  const prefix = type === InvoiceType.BUY ? "PUR" : "INV";
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
  return `${prefix}-${year}${month}-${random}`;
}; 
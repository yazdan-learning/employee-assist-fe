import { Invoice, InvoiceListRequest, InvoiceType } from "../pages/Accountant/Invoice/types";
import { mockInvoices, generateInvoiceNumber } from "../common/data/mock-invoices";
import { delay } from "../helpers/delay";
import { ListResponse } from "../types/common";

class FakeInvoiceService {
  private invoices: Invoice[] = [...mockInvoices];

  async getInvoices(filters: InvoiceListRequest): Promise<ListResponse<Invoice>> {
    await delay(500);

    let filteredInvoices = [...this.invoices];

    // Apply filters
    if (filters.type) {
      filteredInvoices = filteredInvoices.filter(inv => inv.type === filters.type);
    }

    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filteredInvoices = filteredInvoices.filter(inv =>
        inv.number.toLowerCase().includes(searchLower) ||
        inv.description?.toLowerCase().includes(searchLower)
      );
    }

    if (filters.startDate) {
      filteredInvoices = filteredInvoices.filter(inv => inv.date >= filters.startDate!);
    }

    if (filters.endDate) {
      filteredInvoices = filteredInvoices.filter(inv => inv.date <= filters.endDate!);
    }

    // Apply sorting
    if (filters.sortField) {
      filteredInvoices.sort((a: any, b: any) => {
        const aValue = a[filters.sortField!];
        const bValue = b[filters.sortField!];
        const modifier = filters.sortDirection === 'desc' ? -1 : 1;
        
        if (aValue < bValue) return -1 * modifier;
        if (aValue > bValue) return 1 * modifier;
        return 0;
      });
    }

    // Apply pagination
    const totalItems = filteredInvoices.length;
    const totalPages = Math.ceil(totalItems / filters.pageSize);
    const start = (filters.page - 1) * filters.pageSize;
    const end = start + filters.pageSize;

    return {
      data: {
        items: filteredInvoices.slice(start, end),
        totalCount: totalItems,
        pageNumber: filters.page,
        pageSize: filters.pageSize,
        totalPages: totalPages,
        hasPreviousPage: filters.page > 1,
        hasNextPage: filters.page < totalPages
      },
      succeeded: true,
      statusCode: 200,
      errors: null,
      message: null
    };
  }

  async getInvoiceById(id: number): Promise<Invoice | null> {
    await delay(500);
    return this.invoices.find(inv => inv.id === id) || null;
  }

  async createInvoice(invoice: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>): Promise<Invoice> {
    await delay(500);
    
    const newInvoice: Invoice = {
      ...invoice,
      id: Math.max(...this.invoices.map(inv => inv.id || 0)) + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.invoices.push(newInvoice);
    return newInvoice;
  }

  async updateInvoice(id: number, invoice: Partial<Invoice>): Promise<Invoice> {
    await delay(500);

    const index = this.invoices.findIndex(inv => inv.id === id);
    if (index === -1) {
      throw new Error('Invoice not found');
    }

    const updatedInvoice: Invoice = {
      ...this.invoices[index],
      ...invoice,
      id,
      updatedAt: new Date().toISOString()
    };

    this.invoices[index] = updatedInvoice;
    return updatedInvoice;
  }

  async deleteInvoice(id: number): Promise<void> {
    await delay(500);
    
    const index = this.invoices.findIndex(inv => inv.id === id);
    if (index === -1) {
      throw new Error('Invoice not found');
    }

    this.invoices.splice(index, 1);
  }

  async generateInvoiceNumber(type: InvoiceType): Promise<string> {
    await delay(100);
    return generateInvoiceNumber(type);
  }
}

export default new FakeInvoiceService(); 
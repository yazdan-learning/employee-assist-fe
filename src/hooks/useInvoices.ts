import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import FakeInvoiceService from "../services/FakeInvoiceService";
import { Invoice, InvoiceListRequest, InvoiceType } from "../pages/Accountant/Invoice/types";

export const useInvoices = (filters: InvoiceListRequest) => {
  return useQuery({
    queryKey: ["invoices", filters],
    queryFn: () => FakeInvoiceService.getInvoices(filters),
  });
};

export const useInvoice = (id: number) => {
  return useQuery({
    queryKey: ["invoice", id],
    queryFn: () => FakeInvoiceService.getInvoiceById(id),
    enabled: !!id,
  });
};

export const useCreateInvoice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (invoice: Omit<Invoice, "id" | "createdAt" | "updatedAt">) =>
      FakeInvoiceService.createInvoice(invoice),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
    },
  });
};

export const useUpdateInvoice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      invoice,
    }: {
      id: number;
      invoice: Partial<Invoice>;
    }) => FakeInvoiceService.updateInvoice(id, invoice),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
    },
  });
};

export const useDeleteInvoice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => FakeInvoiceService.deleteInvoice(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
    },
  });
};

export const useGenerateInvoiceNumber = (type: InvoiceType) => {
  return useQuery({
    queryKey: ["invoiceNumber", type],
    queryFn: () => FakeInvoiceService.generateInvoiceNumber(type),
  });
}; 
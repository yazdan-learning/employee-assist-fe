import React, { useState, useCallback, useEffect } from "react";
import { Card, CardBody, Button, Row, Col, Container } from "reactstrap";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import { debounce } from "lodash";
import TableContainer from "../../../Components/Common/TableContainer";
import { useInvoices } from "../../../hooks/useInvoices";
import { InvoiceType } from "./types";

interface InvoiceListProps {
  type?: InvoiceType;
}

const InvoiceList: React.FC<InvoiceListProps> = ({ type }) => {
  const { t } = useTranslation();
  const { type: urlType } = useParams<{ type: string }>();
  const invoiceType = urlType?.toUpperCase() as InvoiceType;

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [sortState, setSortState] = useState<{
    field: string;
    direction: "asc" | "desc";
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data: response, isLoading } = useInvoices({
    page: currentPage,
    pageSize: pageSize,
    searchTerm: debouncedSearchTerm,
    sortField: sortState?.field || "date",
    sortDirection: sortState?.direction || "desc",
    type: invoiceType,
  });

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((term: string) => {
      setDebouncedSearchTerm(term);
    }, 300),
    []
  );

  // Handle search
  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  // Effect to handle search
  useEffect(() => {
    debouncedSearch(searchTerm);
  }, [searchTerm, debouncedSearch]);

  const columns = [
    {
      header: t("invoice.list.number"),
      accessorKey: "number",
      enableColumnFilter: true,
      enableSorting: true,
    },
    {
      header: t("invoice.list.partner"),
      accessorKey: "partnerName",
      enableColumnFilter: true,
      enableSorting: true,
    },
    {
      header: t("invoice.list.date"),
      accessorKey: "date",
      enableColumnFilter: true,
      enableSorting: true,
      cell: ({ row }: any) => new Date(row.original.date).toLocaleDateString(),
    },
    {
      header: t("invoice.list.totalAmount"),
      accessorKey: "totalAmount",
      enableColumnFilter: false,
      enableSorting: true,
      cell: ({ row }: any) => row.original.totalAmount.toLocaleString(),
    },
    {
      header: t("invoice.list.finalAmount"),
      accessorKey: "finalAmount",
      enableColumnFilter: false,
      enableSorting: true,
      cell: ({ row }: any) => row.original.finalAmount.toLocaleString(),
    },
  ];

  const getTitle = () => {
    if (invoiceType === InvoiceType.BUY) {
      return t("invoice.list.buyTitle");
    }
    if (invoiceType === InvoiceType.SELL) {
      return t("invoice.list.sellTitle");
    }
    return t("invoice.list.title");
  };

  return (
    <div className="page-content">
      <Container fluid>

                <TableContainer
                  columns={columns}
                  data={response?.data?.items || []}
                  isGlobalFilter={true}
                  loading={isLoading}
                  isPagination={true}
                  isAddButton={true}
                  buttonName={type === InvoiceType.BUY ? t("invoice.list.newBuy") : t("invoice.list.newSell")}
                  isCustomPageSize={true}
                  SearchPlaceholder={t("invoice.list.search")}
                  pagination="pagination"
                  paginationWrapper="dataTables_paginate paging_simple_numbers"
                  tableClass="table align-middle table-nowrap table-hover"
                  theadClass="table-light"
                  totalItems={response?.data?.totalCount || 0}
                  pageSize={pageSize}
                  currentPage={currentPage}
                  onPageChange={setCurrentPage}
                  onPageSizeChange={(size) => {
                    setPageSize(size);
                    setCurrentPage(1);
                  }}
                  onSort={(field, direction) =>
                    setSortState({ field, direction })
                  }
                  onSearch={handleSearch}
                />
      </Container>
    </div>
  );
};

export default InvoiceList; 
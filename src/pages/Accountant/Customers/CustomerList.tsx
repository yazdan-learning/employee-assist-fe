import React, { useMemo, useState, useCallback, useEffect } from "react";
import { Container } from "reactstrap";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  useCustomerList,
  useDeleteCustomer,
} from "../../../hooks/useCustomers";
import Breadcrumbs from "../../../Components/Common/Breadcrumb";
import TableContainer from "../../../Components/Common/TableContainer";
import { debounce } from "lodash";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CustomerList: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data: response, isLoading } = useCustomerList({
    page: currentPage,
    pageSize: pageSize,
    searchTerm: debouncedSearchTerm,
    sortField: sortField,
    sortDirection: sortDirection,
  });

  const deleteMutation = useDeleteCustomer();

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((term: string) => {
      setDebouncedSearchTerm(term);
    }, 300),
    []
  );

  // Keep handleSearch simple - just update the searchTerm
  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  // Effect to handle search and show pagination info
  useEffect(() => {
    debouncedSearch(searchTerm);
  }, [searchTerm, debouncedSearch]);

  const handleSort = (field: string, direction: "asc" | "desc") => {
    setSortField(field);
    setSortDirection(direction);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    if (page !== currentPage) {
      setCurrentPage(page);
    }
  };

  const handlePageSizeChange = (size: number) => {
    if (size !== pageSize) {
      setPageSize(size);
      setCurrentPage(1);
    }
  };

  const columns = useMemo(
    () => [
      {
        header: t("Name"),
        accessorKey: "displayName",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (row: any) => row.getValue(),
      },
      {
        header: t("Type"),
        accessorKey: "isCompany",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (row: any) => (
          <span
            className={`badge badge-soft-${
              row.getValue() ? "primary" : "success"
            } font-size-11`}
          >
            {row.getValue() ? t("Firm") : t("Individual")}
          </span>
        ),
      },
      {
        header: t("National Code"),
        accessorKey: "nationalId",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (row: any) => row.getValue(),
      },
      {
        header: t("Tax ID"),
        accessorKey: "taxId",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (row: any) => row.getValue(),
      },
      {
        header: t("Actions"),
        accessorKey: "id",
        enableColumnFilter: false,
        enableSorting: false,
        cell: (row: any) => (
          <div className="d-flex gap-3">
            <button
              className="btn btn-sm btn-soft-primary"
              onClick={() =>
                navigate(`/accountant/customers/edit/${row.getValue()}`)
              }
            >
              <i className="mdi mdi-pencil font-size-14"></i>
            </button>
            <button
              className="btn btn-sm btn-soft-danger"
              onClick={() => handleDelete(row.getValue())}
            >
              <i className="mdi mdi-trash-can font-size-14"></i>
            </button>
          </div>
        ),
      },
    ],
    [t, navigate]
  );

  const handleDelete = async (id: number) => {
    if (window.confirm(t("Are you sure you want to delete this customer?"))) {
      try {
        const response = await deleteMutation.mutateAsync(id);
        if (response.succeeded) {
          toast.success(t("Customer deleted successfully"));
        } else {
          toast.error(response.errors || t("Error deleting customer"));
        }
      } catch (error) {
        toast.error(t("Error deleting customer"));
      }
    }
  };

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumbs
          title={t("Customers")}
          breadcrumbItem={t("Customer List")}
        />
        <TableContainer
          columns={columns}
          data={response?.data?.items || []}
          isGlobalFilter={true}
          isPagination={true}
          isCustomPageSize={true}
          SearchPlaceholder={t("Search customers...")}
          pagination="pagination"
          paginationWrapper="dataTables_paginate paging_simple_numbers"
          tableClass="table align-middle table-nowrap table-hover"
          theadClass="table-light"
          isAddButton={true}
          buttonName={t("Add Customer")}
          buttonClass="btn btn-primary"
          handleUserClick={() => navigate("/accountant/customers/add")}
          onSearch={handleSearch}
          onSort={handleSort}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          currentPage={currentPage}
          pageSize={pageSize}
          totalItems={response?.data?.totalCount || 0}
          totalPages={response?.data?.totalPages || 0}
          loading={isLoading}
        />
        <ToastContainer />
      </Container>
    </div>
  );
};

export default CustomerList;

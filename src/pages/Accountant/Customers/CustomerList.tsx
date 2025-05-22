import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Container } from "reactstrap";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCustomers,
  deleteCustomerById,
} from "../../../slices/customers/thunk";
import { CustomerInfo } from "./types";
import Breadcrumbs from "../../../Components/Common/Breadcrumb";
import TableContainer from "../../../Components/Common/TableContainer";
import { debounce } from "lodash";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface RootState {
  customer: {
    customers: CustomerInfo[];
    loading: boolean;
    error: string | null;
  };
}

const CustomerList: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch<any>();
  const { customers, loading } = useSelector(
    (state: RootState) => state.customer
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((term: string) => {
      setDebouncedSearchTerm(term);
      setCurrentPage(1); // Reset to first page when searching
    }, 300),
    []
  );

  // Effect for loading customers
  useEffect(() => {
    dispatch(
      fetchCustomers({
        page: currentPage,
        pageSize: pageSize,
        searchTerm: debouncedSearchTerm,
        sortField: sortField,
        sortDirection: sortDirection,
      })
    ).then((response: any) => {
      console.log("fetchCustomers response:", response);
      if (response.payload) {
        setTotalItems(response.payload.totalItems);
        setTotalPages(response.payload.totalPages);
      }
    });
  }, [
    dispatch,
    debouncedSearchTerm,
    sortField,
    sortDirection,
    currentPage,
    pageSize,
  ]);

  // Effect for handling search term changes
  useEffect(() => {
    console.log("totalPages", totalPages);
    console.log("totalItems", totalItems);
    debouncedSearch(searchTerm);
  }, [searchTerm, debouncedSearch]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleSort = (field: string, direction: "asc" | "desc") => {
    setSortField(field);
    setSortDirection(direction);
    setCurrentPage(1); // Reset to first page when sorting
  };

  const handlePageChange = (page: number) => {
    if (page !== currentPage) {
      setCurrentPage(page);
    }
  };

  const handlePageSizeChange = (size: number) => {
    if (size !== pageSize) {
      setPageSize(size);
      setCurrentPage(1); // Reset to first page when changing page size
    }
  };


  const columns = useMemo(
    () => [
      {
        header: t("Name"),
        accessorKey: "name",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (row: any) => row.getValue(),
      },
      {
        header: t("Type"),
        accessorKey: "isFirm",
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
        accessorKey: "nationalCode",
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

  const handleDelete = async (id: string) => {
    if (window.confirm(t("Are you sure you want to delete this customer?"))) {
      try {
        await dispatch(deleteCustomerById(id));
        toast.success(t("Customer deleted successfully"));
      } catch (error) {
        toast.error(t("Error deleting customer"));
      }
    }
  };

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumbs title={t("Customers")} breadcrumbItem={t("Customer List")} />
        <TableContainer
          columns={columns}
          data={customers || []}
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
          // Server-side props
          onSearch={handleSearch}
          onSort={handleSort}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          currentPage={currentPage}
          pageSize={pageSize}
          totalItems={totalItems}
          totalPages={totalPages}
          loading={loading}
        />
        <ToastContainer />
      </Container>
    </div>
  );
};

export default CustomerList;

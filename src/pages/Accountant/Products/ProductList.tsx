import React, { useMemo, useState, useCallback, useEffect } from "react";
import { Container } from "reactstrap";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useProductList, useDeleteProduct } from "../../../hooks/useProducts";
import Breadcrumbs from "../../../Components/Common/Breadcrumb";
import TableContainer from "../../../Components/Common/TableContainer";
import { debounce } from "lodash";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProductList: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [sortState, setSortState] = useState<{
    field: string;
    direction: "asc" | "desc";
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data: response, isLoading } = useProductList({
    page: currentPage,
    pageSize: pageSize,
    searchTerm: debouncedSearchTerm,
    sortField: sortState?.field || "",
    sortDirection: sortState?.direction || "asc",
  });

  const deleteMutation = useDeleteProduct();

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

  const handleSort = (field: string) => {
    setSortState((prev) => {
      if (!prev || prev.field !== field) {
        return { field, direction: "asc" };
      }
      if (prev.direction === "asc") {
        return { field, direction: "desc" };
      }
      return null; // Reset sorting when clicking third time
    });
    setCurrentPage(1); // Reset to first page when sorting changes
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

  const handleDelete = async (id: string) => {
    if (window.confirm(t("Are you sure you want to delete this product?"))) {
      try {
        const response = await deleteMutation.mutateAsync(Number(id));
        if (response.succeeded) {
          toast.success(t("product.list.messages.deleteSuccess"));
        } else {
          toast.error(response.errors || t("product.list.messages.deleteError"));
        }
      } catch (error) {
        toast.error(t("product.list.messages.deleteError"));
      }
    }
  };

  const columns = useMemo(
    () => [
      {
        header: t("product.list.columns.name"),
        accessorKey: "name",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (row: any) => row.getValue(),
        sortingFn: "alphanumeric",
      },
      {
        header: t("product.list.columns.category"),
        accessorKey: "category",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (row: any) => row.getValue() || "-",
        sortingFn: "alphanumeric",
      },
      {
        header: t("product.list.columns.status"),
        accessorKey: "isActive",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (row: any) => (
          <span
            className={`badge badge-soft-${
              row.getValue() ? "success" : "danger"
            } font-size-11`}
          >
            {t(row.getValue() ? "product.form.status.active" : "product.form.status.inactive")}
          </span>
        ),
        sortingFn: "boolean",
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
                navigate(`/accountant/products/edit/${row.getValue()}`)
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

  return (
    <div className="page-content">
      <Container fluid>
        <TableContainer
          columns={columns}
          data={response?.data?.items || []}
          isGlobalFilter={true}
          isPagination={true}
          isCustomPageSize={true}
          SearchPlaceholder={t("product.list.search")}
          pagination="pagination"
          paginationWrapper="dataTables_paginate paging_simple_numbers"
          tableClass="table align-middle table-nowrap table-hover"
          theadClass="table-light"
          isAddButton={true}
          buttonName={t("product.list.buttons.new")}
          buttonClass="btn btn-primary"
          handleUserClick={() => navigate("/accountant/products/add")}
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

export default ProductList;

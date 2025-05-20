import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Container } from "reactstrap";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../../slices/products/thunk";
import Breadcrumbs from "../../../Components/Common/Breadcrumb";
import TableContainer from "../../../Components/Common/TableContainer";
import { Product } from "./types";
import { debounce } from "lodash";

interface RootState {
  product: {
    products: Product[];
    loading: boolean;
    error: string | null;
    pagination: {
      currentPage: number;
      totalItems: number;
      pageSize: number;
      totalPages: number;
    };
  };
}

const ProductList = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const dispatch = useDispatch<any>();
  const { products, loading, pagination } = useSelector(
    (state: RootState) => state.product
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((term: string) => {
      setDebouncedSearchTerm(term);
      setCurrentPage(1); // Reset to first page when searching
    }, 300),
    []
  );

  // Effect for loading products
  useEffect(() => {
    dispatch(
      fetchProducts({
        page: currentPage,
        pageSize: pageSize,
        searchTerm: debouncedSearchTerm,
        sortField: sortField,
        sortDirection: sortDirection,
      })
    );
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
        accessorKey: "basicInfo.name",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (row: any) => row.getValue(),
      },
      {
        header: t("SKU"),
        accessorKey: "basicInfo.sku",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (row: any) => row.getValue(),
      },
      {
        header: t("Category"),
        accessorKey: "details.category",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (row: any) => row.getValue(),
      },
      {
        header: t("Price"),
        accessorKey: "basicInfo.price",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (row: any) => `$${row.getValue()}`,
      },
      {
        header: t("Stock"),
        accessorKey: "details.stock",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (row: any) => row.getValue(),
      },
      {
        header: t("Status"),
        accessorKey: "status",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (row: any) => (
          <span
            className={`badge bg-${
              row.getValue() === "ACTIVE" ? "success" : "danger"
            }`}
          >
            {row.getValue()}
          </span>
        ),
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

  const handleDelete = async (id: string) => {
    if (window.confirm(t("Are you sure you want to delete this product?"))) {
      // Implement delete functionality
    }
  };

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumbs title={t("Products")} breadcrumbItem={t("Product List")} />
        <TableContainer
          columns={columns}
          data={products || []}
          isGlobalFilter={true}
          isPagination={true}
          isCustomPageSize={true}
          SearchPlaceholder={t("Search products...")}
          pagination="pagination"
          paginationWrapper="dataTables_paginate paging_simple_numbers"
          tableClass="table align-middle table-nowrap table-hover"
          theadClass="table-light"
          isAddButton={true}
          buttonName={t("Add Product")}
          buttonClass="btn btn-primary"
          handleUserClick={() => navigate("/accountant/products/add")}
          // Server-side props
          onSearch={handleSearch}
          onSort={handleSort}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          currentPage={currentPage}
          pageSize={pageSize}
          totalItems={pagination?.totalItems || 0}
          totalPages={pagination?.totalPages || 0}
          loading={loading}
        />
      </Container>
    </div>
  );
};

export default ProductList;

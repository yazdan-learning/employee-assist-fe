import React, { useEffect, useMemo, useState } from "react";
import { Container } from "reactstrap";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../../slices/products/thunk";
import Breadcrumbs from "../../../Components/Common/Breadcrumb";
import TableContainer from "../../../Components/Common/TableContainer";
import { Product } from "./types";

interface RootState {
  product: {
    products: Product[];
    loading: boolean;
    error: string | null;
    pagination?: {
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
  const { products, loading } = useSelector(
    (state: RootState) => state.product
  );

  useEffect(() => {
    // Load all products at once since we're using client-side pagination
    dispatch(fetchProducts({ page: 1, pageSize: 1000 }));
  }, [dispatch]);

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
        />
      </Container>
    </div>
  );
};

export default ProductList;

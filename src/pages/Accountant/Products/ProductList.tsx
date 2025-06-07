import React, { useState } from "react";
import { Container, Row, Col, Card, CardBody, Button } from "reactstrap";
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
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState<string | undefined>();
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">();

  const {
    data: productResponse,
    isLoading,
    isError,
    error,
  } = useProductList({
    page: currentPage,
    pageSize: pageSize,
    searchTerm: debouncedSearchTerm,
    sortField,
    sortDirection,
  });

  const deleteMutation = useDeleteProduct();

  // Handle search with debounce
  const debouncedSearch = debounce((value: string) => {
    setDebouncedSearchTerm(value);
    setCurrentPage(1); // Reset to first page on search
  }, 500);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    debouncedSearch(value);
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    setCurrentPage(1); // Reset to first page on sort
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await deleteMutation.mutateAsync(id);
      if (response.succeeded) {
        toast.success(t("product.list.messages.deleteSuccess"));
      } else {
        toast.error(t("product.list.messages.deleteError"));
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error(t("product.list.messages.deleteError"));
    }
  };

  const columns = [
    {
      header: t("product.list.columns.name"),
      accessorKey: "name",
      enableColumnFilter: true,
      enableSorting: true,
    },
    {
      header: t("product.list.columns.barcode"),
      accessorKey: "barcode",
      enableColumnFilter: true,
      enableSorting: true,
    },
    {
      header: t("product.list.columns.category"),
      accessorKey: "categoryId",
      enableColumnFilter: true,
      enableSorting: true,
      cell: ({ row }: any) => {
        const category = row.original.category;
        return category ? category.name : "-";
      },
    },
    {
      header: t("product.list.columns.unit"),
      accessorKey: "unitId",
      enableColumnFilter: true,
      enableSorting: true,
      cell: ({ row }: any) => {
        const unit = row.original.unit;
        return unit ? unit.name : "-";
      },
    },
    {
      header: t("product.list.columns.location"),
      accessorKey: "locationId",
      enableColumnFilter: true,
      enableSorting: true,
      cell: ({ row }: any) => {
        const location = row.original.location;
        return location ? location.name : "-";
      },
    },
    {
      header: t("product.list.columns.actions"),
      accessorKey: "actions",
      disableSortBy: true,
      cell: ({ row }: any) => (
        <div className="d-flex gap-2">
          <Button
            color="primary"
            size="sm"
            onClick={() => navigate(`/accountant/products/${row.original.id}`)}
          >
            {t("View")}
          </Button>
          <Button
            color="info"
            size="sm"
            onClick={() =>
              navigate(`/accountant/products/edit/${row.original.id}`)
            }
          >
            {t("Edit")}
          </Button>
          <Button
            color="danger"
            size="sm"
            onClick={() => handleDelete(row.original.id)}
            disabled={deleteMutation.isPending}
          >
            {t("Delete")}
          </Button>
        </div>
      ),
    },
  ];

  if (isError) {
    return (
      <div className="page-content">
        <Container fluid>
          <div className="alert alert-danger">
            {error?.message || t("product.list.messages.loadError")}
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumbs title={t("Products")} breadcrumbItem={t("Products")} />

        <Row>
          <Col>
            <Card>
              <CardBody>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h4 className="card-title">{t("product.list.title")}</h4>
                  <Button
                    color="primary"
                    onClick={() => navigate("/accountant/products/add")}
                  >
                    {t("product.list.buttons.new")}
                  </Button>
                </div>

                <TableContainer
                  columns={columns}
                  data={productResponse?.data?.items || []}
                  loading={isLoading}
                  totalItems={productResponse?.data?.totalCount || 0}
                  pageSize={pageSize}
                  currentPage={currentPage}
                  onPageChange={handlePageChange}
                  onPageSizeChange={handlePageSizeChange}
                  onSort={handleSort}
                  isGlobalFilter={true}
                  isAddButton={false}
                  tableClass="align-middle table-nowrap table-hover"
                  theadClass="table-light"
                  SearchPlaceholder={t("product.list.search")}
                />
              </CardBody>
            </Card>
          </Col>
        </Row>
        <ToastContainer />
      </Container>
    </div>
  );
};

export default ProductList;

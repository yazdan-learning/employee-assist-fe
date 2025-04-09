import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, CardBody, Button } from "reactstrap";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../../slices/products/thunk";
import Breadcrumbs from "../../../Components/Common/Breadcrumb";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProductTable from "./ProductTable";
import SearchInput from "../../../Components/Common/SearchInput";
import { Product } from "./types";

interface RootState {
  product: {
    products: Product[];
    loading: boolean;
    error: string | null;
  };
}

const ProductList: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch<any>();

  const [searchTerm, setSearchTerm] = useState<string>("");

  const { products, loading } = useSelector((state: RootState) => ({
    products: state.product.products,
    loading: state.product.loading,
  }));

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const filteredProducts = products.filter((product) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      product.name.toLowerCase().includes(searchLower) ||
      product.sku.toLowerCase().includes(searchLower) ||
      product.category.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumbs
          title={t("Dashboard")}
          breadcrumbItem={t("Products")}
          titleUrl="/dashboard"
        />

        <Row>
          <Col xs={12}>
            <Card>
              <CardBody>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div className="d-flex align-items-center w-50">
                    <SearchInput
                      value={searchTerm}
                      onChange={setSearchTerm}
                      placeholderKey="Search products..."
                    />
                  </div>
                  <Button
                    color="primary"
                    onClick={() => navigate("/accountant/products/add")}
                  >
                    <i className="bx bx-plus me-1"></i>
                    {t("Add Product")}
                  </Button>
                </div>
                <ProductTable products={filteredProducts} loading={loading} />
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

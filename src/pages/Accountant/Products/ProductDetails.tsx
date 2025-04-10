import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Container, Row, Col, Card, CardBody } from "reactstrap";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductById } from "../../../slices/products/thunk";
import { Product } from "./types";
import Breadcrumbs from "../../../Components/Common/Breadcrumb";

interface RootState {
  product: {
    selectedProduct: Product | null;
    loading: boolean;
    error: string | null;
  };
}

const ProductDetails: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<any>();
  const { id } = useParams<{ id: string }>();

  const { selectedProduct, loading } = useSelector((state: RootState) => ({
    selectedProduct: state.product.selectedProduct,
    loading: state.product.loading,
  }));

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
    }
  }, [dispatch, id]);

  if (loading || !selectedProduct) {
    return (
      <div className="page-content">
        <Container fluid>
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="sr-only">{t("Loading...")}</span>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumbs
          title={t("Products")}
          breadcrumbItem={t("Product Details")}
        />

        <Row>
          <Col lg={12}>
            <Card>
              <CardBody>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h4 className="card-title mb-0">
                    {selectedProduct.basicInfo.name}
                  </h4>
                  <Link
                    to={`/accountant/products/edit/${id}`}
                    className="btn btn-primary"
                  >
                    <i className="bx bx-edit me-1"></i>
                    {t("Edit")}
                  </Link>
                </div>

                <Row>
                  <Col md={6}>
                    <div className="mb-4">
                      <h5 className="font-size-15">{t("Basic Information")}</h5>
                      <div className="table-responsive">
                        <table className="table table-nowrap mb-0">
                          <tbody>
                            <tr>
                              <th scope="row">{t("SKU")}</th>
                              <td>{selectedProduct.basicInfo.sku}</td>
                            </tr>
                            <tr>
                              <th scope="row">{t("Category")}</th>
                              <td>{selectedProduct.details.category}</td>
                            </tr>
                            <tr>
                              <th scope="row">{t("Status")}</th>
                              <td>
                                <span
                                  className={`badge badge-soft-${
                                    selectedProduct.status === "ACTIVE"
                                      ? "success"
                                      : selectedProduct.status === "INACTIVE"
                                      ? "warning"
                                      : "danger"
                                  } font-size-11`}
                                >
                                  {t(selectedProduct.status)}
                                </span>
                              </td>
                            </tr>
                            <tr>
                              <th scope="row">{t("Price")}</th>
                              <td>
                                ${selectedProduct.basicInfo.price.toFixed(2)}
                              </td>
                            </tr>
                            <tr>
                              <th scope="row">{t("Cost")}</th>
                              <td>
                                $
                                {selectedProduct.details.cost?.toFixed(2) ||
                                  "0.00"}
                              </td>
                            </tr>
                            <tr>
                              <th scope="row">{t("Stock")}</th>
                              <td>{selectedProduct.details.stock}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="mb-4">
                      <h5 className="font-size-15">
                        {t("Additional Details")}
                      </h5>
                      <div className="table-responsive">
                        <table className="table table-nowrap mb-0">
                          <tbody>
                            <tr>
                              <th scope="row">{t("Description")}</th>
                              <td>
                                {selectedProduct.basicInfo.description || "-"}
                              </td>
                            </tr>
                            <tr>
                              <th scope="row">{t("Barcode")}</th>
                              <td>{selectedProduct.details.barcode || "-"}</td>
                            </tr>
                            <tr>
                              <th scope="row">{t("Created At")}</th>
                              <td>
                                {selectedProduct.createdAt
                                  ? new Date(
                                      selectedProduct.createdAt
                                    ).toLocaleDateString()
                                  : "-"}
                              </td>
                            </tr>
                            <tr>
                              <th scope="row">{t("Updated At")}</th>
                              <td>
                                {selectedProduct.updatedAt
                                  ? new Date(
                                      selectedProduct.updatedAt
                                    ).toLocaleDateString()
                                  : "-"}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ProductDetails;

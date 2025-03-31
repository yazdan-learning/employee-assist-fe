import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Container, Row, Col, Card, CardBody } from "reactstrap";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "reselect";
import { fetchCustomerById } from "../../../slices/customers/thunk";
import { Customer, CustomerType } from "./types";
import Breadcrumbs from "../../../Components/Common/Breadcrumb";

interface CustomerDetailsState {
  customers: {
    selectedCustomer: Customer | null;
    loading: boolean;
    error: string | null;
  };
}

const CustomerDetails: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<any>();
  const { id } = useParams<{ id: string }>();

  const selectCustomerState = createSelector(
    (state: CustomerDetailsState) => state.customers,
    (customers) => ({
      selectedCustomer: customers.selectedCustomer,
      loading: customers.loading,
      error: customers.error,
    })
  );

  const { selectedCustomer, loading } = useSelector(selectCustomerState);

  useEffect(() => {
    if (id) {
      dispatch(fetchCustomerById(id));
    }
  }, [dispatch, id]);

  const getCustomerTypeLabel = (type: CustomerType): string => {
    switch (type) {
      case CustomerType.BUYER:
        return t("Buyer");
      case CustomerType.SELLER:
        return t("Seller");
      case CustomerType.BOTH:
        return t("Both");
      default:
        return t("None");
    }
  };

  if (loading || !selectedCustomer) {
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
          title={t("Customers")}
          breadcrumbItem={t("Customer Details")}
        />

        <Row>
          <Col lg={12}>
            <Card>
              <CardBody>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h4 className="card-title mb-0">
                    {selectedCustomer.basicInfo.isFirm
                      ? selectedCustomer.basicInfo.companyName
                      : `${selectedCustomer.basicInfo.firstName} ${selectedCustomer.basicInfo.lastName}`}
                  </h4>
                  <Link
                    to={`/accountant/customers/edit/${id}`}
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
                              <th scope="row">{t("Type")}</th>
                              <td>
                                <span
                                  className={`badge badge-soft-${
                                    selectedCustomer.basicInfo.isFirm
                                      ? "primary"
                                      : "success"
                                  } font-size-11`}
                                >
                                  {selectedCustomer.basicInfo.isFirm
                                    ? t("Firm")
                                    : t("Individual")}
                                </span>
                              </td>
                            </tr>
                            {selectedCustomer.basicInfo.isFirm && (
                              <tr>
                                <th scope="row">{t("Company Name")}</th>
                                <td>
                                  {selectedCustomer.basicInfo.companyName}
                                </td>
                              </tr>
                            )}
                            <tr>
                              <th scope="row">{t("First Name")}</th>
                              <td>{selectedCustomer.basicInfo.firstName}</td>
                            </tr>
                            <tr>
                              <th scope="row">{t("Last Name")}</th>
                              <td>{selectedCustomer.basicInfo.lastName}</td>
                            </tr>
                            <tr>
                              <th scope="row">{t("National Code")}</th>
                              <td>{selectedCustomer.basicInfo.nationalCode}</td>
                            </tr>
                            <tr>
                              <th scope="row">{t("Tax ID")}</th>
                              <td>{selectedCustomer.basicInfo.taxId}</td>
                            </tr>
                            <tr>
                              <th scope="row">{t("Customer Type")}</th>
                              <td>
                                <span className="badge badge-soft-info font-size-11">
                                  {getCustomerTypeLabel(
                                    selectedCustomer.basicInfo.customerType
                                  )}
                                </span>
                              </td>
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
                              <th scope="row">{t("Address")}</th>
                              <td>{selectedCustomer.details.address}</td>
                            </tr>
                            <tr>
                              <th scope="row">{t("Created At")}</th>
                              <td>
                                {selectedCustomer.createdAt
                                  ? new Date(
                                      selectedCustomer.createdAt
                                    ).toLocaleDateString()
                                  : "-"}
                              </td>
                            </tr>
                            <tr>
                              <th scope="row">{t("Updated At")}</th>
                              <td>
                                {selectedCustomer.updatedAt
                                  ? new Date(
                                      selectedCustomer.updatedAt
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

export default CustomerDetails;

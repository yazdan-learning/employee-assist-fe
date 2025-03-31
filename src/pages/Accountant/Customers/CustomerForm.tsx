import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
} from "reactstrap";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "reselect";
import classnames from "classnames";
import { CustomerType, CustomerFormData, CustomerState } from "./types";
import {
  createCustomer,
  fetchCustomerById,
  updateCustomerById,
} from "../../../slices/customers/thunk";
import Breadcrumbs from "../../../Components/Common/Breadcrumb";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface RootState {
  customer: CustomerState;
}

const CustomerForm: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch<any>();
  const { id } = useParams<{ id: string }>();

  const [activeTab, setActiveTab] = useState(1);
  const [formData, setFormData] = useState<CustomerFormData>({
    basicInfo: {
      isFirm: false,
      companyName: "",
      firstName: "",
      lastName: "",
      nationalCode: "",
      taxId: "",
      customerType: CustomerType.NONE,
    },
    details: {
      address: "",
    },
  });

  const selectCustomerState = (state: RootState) => ({
    selectedCustomer: state.customer.selectedCustomer,
    loading: state.customer.loading,
    error: state.customer.error,
  });

  const { selectedCustomer, loading } = useSelector(selectCustomerState);

  useEffect(() => {
    if (id) {
      dispatch(fetchCustomerById(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (id && selectedCustomer) {
      setFormData({
        basicInfo: selectedCustomer.basicInfo,
        details: selectedCustomer.details,
      });
    }
  }, [id, selectedCustomer]);

  const handleInputChange = (
    section: "basicInfo" | "details",
    field: string,
    value: any
  ) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (goToNext = false) => {
    try {
      if (id) {
        await dispatch(
          updateCustomerById({
            id,
            basicInfo: formData.basicInfo,
            details: formData.details,
          })
        );
        toast.success(t("Customer updated successfully"));
      } else {
        await dispatch(
          createCustomer({
            basicInfo: formData.basicInfo,
            details: formData.details,
          })
        );
        toast.success(t("Customer created successfully"));
      }

      if (goToNext) {
        setActiveTab(2);
      } else {
        navigate("/accountant/customers");
      }
    } catch (error) {
      toast.error(t("Error saving customer"));
    }
  };

  const toggleTab = (tab: number) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumbs
          title={t("Customers")}
          breadcrumbItem={id ? t("Edit Customer") : t("Add Customer")}
        />

        <Row>
          <Col lg={12}>
            <Card>
              <CardBody>
                <Nav tabs>
                  <NavItem>
                    <NavLink
                      className={classnames({ active: activeTab === 1 })}
                      onClick={() => toggleTab(1)}
                    >
                      {t("Basic Information")}
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classnames({ active: activeTab === 2 })}
                      onClick={() => toggleTab(2)}
                    >
                      {t("Additional Details")}
                    </NavLink>
                  </NavItem>
                </Nav>

                <TabContent activeTab={activeTab} className="p-3">
                  <TabPane tabId={1}>
                    <Form>
                      <FormGroup className="mb-3">
                        <div className="form-check mb-3">
                          <Input
                            type="checkbox"
                            className="form-check-input"
                            id="isFirm"
                            checked={formData.basicInfo.isFirm}
                            onChange={(e) =>
                              handleInputChange(
                                "basicInfo",
                                "isFirm",
                                e.target.checked
                              )
                            }
                          />
                          <Label className="form-check-label" for="isFirm">
                            {t("Is Firm")}
                          </Label>
                        </div>
                      </FormGroup>

                      {formData.basicInfo.isFirm && (
                        <FormGroup className="mb-3">
                          <Label for="companyName">{t("Company Name")}</Label>
                          <Input
                            type="text"
                            id="companyName"
                            value={formData.basicInfo.companyName}
                            onChange={(e) =>
                              handleInputChange(
                                "basicInfo",
                                "companyName",
                                e.target.value
                              )
                            }
                          />
                        </FormGroup>
                      )}

                      <Row>
                        <Col md={6}>
                          <FormGroup className="mb-3">
                            <Label for="firstName">{t("First Name")}</Label>
                            <Input
                              type="text"
                              id="firstName"
                              value={formData.basicInfo.firstName}
                              onChange={(e) =>
                                handleInputChange(
                                  "basicInfo",
                                  "firstName",
                                  e.target.value
                                )
                              }
                            />
                          </FormGroup>
                        </Col>
                        <Col md={6}>
                          <FormGroup className="mb-3">
                            <Label for="lastName">{t("Last Name")}</Label>
                            <Input
                              type="text"
                              id="lastName"
                              value={formData.basicInfo.lastName}
                              onChange={(e) =>
                                handleInputChange(
                                  "basicInfo",
                                  "lastName",
                                  e.target.value
                                )
                              }
                            />
                          </FormGroup>
                        </Col>
                      </Row>

                      <Row>
                        <Col md={6}>
                          <FormGroup className="mb-3">
                            <Label for="nationalCode">
                              {t("National Code")}
                            </Label>
                            <Input
                              type="text"
                              id="nationalCode"
                              value={formData.basicInfo.nationalCode}
                              onChange={(e) =>
                                handleInputChange(
                                  "basicInfo",
                                  "nationalCode",
                                  e.target.value
                                )
                              }
                            />
                          </FormGroup>
                        </Col>
                        <Col md={6}>
                          <FormGroup className="mb-3">
                            <Label for="taxId">{t("Tax ID")}</Label>
                            <Input
                              type="text"
                              id="taxId"
                              value={formData.basicInfo.taxId}
                              onChange={(e) =>
                                handleInputChange(
                                  "basicInfo",
                                  "taxId",
                                  e.target.value
                                )
                              }
                            />
                          </FormGroup>
                        </Col>
                      </Row>

                      <FormGroup className="mb-3">
                        <Label for="customerType">{t("Customer Type")}</Label>
                        <Input
                          type="select"
                          id="customerType"
                          value={formData.basicInfo.customerType}
                          onChange={(e) =>
                            handleInputChange(
                              "basicInfo",
                              "customerType",
                              e.target.value
                            )
                          }
                        >
                          <option value={CustomerType.NONE}>{t("None")}</option>
                          <option value={CustomerType.BUYER}>
                            {t("Buyer")}
                          </option>
                          <option value={CustomerType.SELLER}>
                            {t("Seller")}
                          </option>
                          <option value={CustomerType.BOTH}>{t("Both")}</option>
                        </Input>
                      </FormGroup>

                      <div className="d-flex justify-content-end gap-2">
                        <Button
                          color="primary"
                          onClick={() => handleSubmit(true)}
                        >
                          {t("Next")}
                        </Button>
                        <Button
                          color="success"
                          onClick={() => handleSubmit(false)}
                        >
                          {t("Register")}
                        </Button>
                      </div>
                    </Form>
                  </TabPane>

                  <TabPane tabId={2}>
                    <Form>
                      <FormGroup className="mb-3">
                        <Label for="address">{t("Address")}</Label>
                        <Input
                          type="textarea"
                          id="address"
                          rows={4}
                          value={formData.details.address}
                          onChange={(e) =>
                            handleInputChange(
                              "details",
                              "address",
                              e.target.value
                            )
                          }
                        />
                      </FormGroup>

                      <div className="d-flex justify-content-end gap-2">
                        <Button
                          color="secondary"
                          onClick={() => setActiveTab(1)}
                        >
                          {t("Previous")}
                        </Button>
                        <Button
                          color="success"
                          onClick={() => handleSubmit(false)}
                        >
                          {t("Register")}
                        </Button>
                      </div>
                    </Form>
                  </TabPane>
                </TabContent>
              </CardBody>
            </Card>
          </Col>
        </Row>

        <ToastContainer />
      </Container>
    </div>
  );
};

export default CustomerForm;

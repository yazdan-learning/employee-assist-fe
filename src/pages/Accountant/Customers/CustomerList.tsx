import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, CardBody, Button } from "reactstrap";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCustomers,
  deleteCustomerById,
} from "../../../slices/customers/thunk";
import { CustomerType } from "./types";
import Breadcrumbs from "../../../Components/Common/Breadcrumb";
import DeleteModal from "../../../Components/Common/DeleteModal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CustomerTable from "./CustomerTable";
import SearchInput from "../../../Components/Common/SearchInput";

interface RootState {
  customer: {
    customers: any[];
    loading: boolean;
    error: string | null;
  };
}

const CustomerList: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch<any>();

  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [customerToDelete, setCustomerToDelete] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const selectCustomerState = (state: RootState) => ({
    customers: state.customer.customers,
    loading: state.customer.loading,
    error: state.customer.error,
  });

  const { customers, loading } = useSelector(selectCustomerState);

  useEffect(() => {
    dispatch(fetchCustomers());
  }, [dispatch]);

  const handleDeleteCustomer = (id: string) => {
    setCustomerToDelete(id);
    setDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (customerToDelete) {
      try {
        await dispatch(deleteCustomerById(customerToDelete));
        setDeleteModal(false);
        toast.success(t("Customer deleted successfully"));
      } catch (error) {
        toast.error(t("Error deleting customer"));
      }
    }
  };

  const filteredCustomers = customers.filter((customer) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      customer.basicInfo.firstName.toLowerCase().includes(searchLower) ||
      customer.basicInfo.lastName.toLowerCase().includes(searchLower) ||
      customer.basicInfo.companyName?.toLowerCase().includes(searchLower) ||
      customer.basicInfo.nationalCode.includes(searchTerm) ||
      customer.basicInfo.taxId.includes(searchTerm)
    );
  });

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

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumbs
          title={t("Dashboard")}
          breadcrumbItem={t("Customers")}
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
                      placeholderKey="Search customers..."
                    />
                  </div>
                  <Button
                    color="primary"
                    onClick={() => navigate("/accountant/customers/add")}
                  >
                    <i className="bx bx-plus me-1"></i>
                    {t("Add Customer")}
                  </Button>
                </div>
                <CustomerTable
                  customers={filteredCustomers}
                  loading={loading}
                  onDeleteCustomer={handleDeleteCustomer}
                />
              </CardBody>
            </Card>
          </Col>
        </Row>

        <DeleteModal
          show={deleteModal}
          onDeleteClick={handleDeleteConfirm}
          onCloseClick={() => setDeleteModal(false)}
        />

        <ToastContainer />
      </Container>
    </div>
  );
};

export default CustomerList;

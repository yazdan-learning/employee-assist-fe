import React, { useState } from "react";
import { Row, Col, Card, CardBody, Button } from "reactstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  Customer,
  Gender,
  MaritalStatus,
  CustomerType,
  CustomerInfo,
} from "../types";
import {
  createCustomer,
  updateCustomerById,
} from "../../../../slices/customers/thunk";
import BasicInfoForm from "./BasicInfoForm";
import ContactInfoForm from "./ContactInfoForm";
import BankAccountForm from "./BankAccountForm";
import { AppDispatch } from "../../../../store";

interface CustomerFormProps {
  customer?: CustomerInfo & Partial<Customer>;
  isEdit?: boolean;
}

const CustomerForm: React.FC<CustomerFormProps> = ({
  customer,
  isEdit = false,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Customer>(() => {
    const defaultData: Customer = {
      isCompany: false,
      title: "",
      firstName: "",
      lastName: "",
      nationalId: "",
      taxId: "",
      gender: Gender.MALE,
      nickname: "",
      maritalStatus: MaritalStatus.SINGLE,
      customerType: CustomerType.NONE,
      customerRiskLimit: 0,
      phone: [],
      email: "",
      addresses: [],
      bankAccounts: [],
      fax: "",
      website: "",
      licensePlate: "",
    };

    if (!customer) return defaultData;

    return {
      ...defaultData,
      ...customer,
      // Ensure required fields have default values if undefined
      isCompany: customer.isCompany ?? defaultData.isCompany,
      gender: customer.gender ?? defaultData.gender,
      maritalStatus: customer.maritalStatus ?? defaultData.maritalStatus,
      customerType: customer.customerType ?? defaultData.customerType,
      customerRiskLimit:
        customer.customerRiskLimit ?? defaultData.customerRiskLimit,
      phone: customer.phone ?? defaultData.phone,
      addresses: customer.addresses ?? defaultData.addresses,
      bankAccounts: customer.bankAccounts ?? defaultData.bankAccounts,
    };
  });

  const handleBasicInfoChange = (basicInfo: {
    isCompany: boolean;
    title: string;
    firstName: string;
    lastName: string;
    nationalId: string;
    taxId: string;
    gender: Gender;
    nickname?: string;
    maritalStatus: MaritalStatus;
    customerType: CustomerType;
    customerRiskLimit: number;
  }) => {
    setFormData((prev) => ({
      ...prev,
      ...basicInfo,
    }));
  };

  const handleContactInfoChange = (contactInfo: {
    phone: string[];
    fax?: string;
    email: string;
    website?: string;
    licensePlate?: string;
    addresses: {
      title: string;
      value: string;
      postalCode: string;
      isPrimary: boolean;
    }[];
  }) => {
    setFormData((prev) => ({
      ...prev,
      ...contactInfo,
    }));
  };

  const handleBankAccountChange = (bankInfo: {
    bankAccounts: {
      accountNumber: string;
      iban: string;
      cardNumber: string;
      title: string;
      branchName: string;
      branchCode: string;
      bankId: number;
    }[];
  }) => {
    setFormData((prev) => ({
      ...prev,
      ...bankInfo,
    }));
  };

  const handleNext = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const transformFormDataForAPI = (): Customer => {
    // Return a properly typed Customer object
    return {
      isCompany: formData.isCompany,
      title: formData.title,
      firstName: formData.firstName,
      lastName: formData.lastName,
      nationalId: formData.nationalId,
      taxId: formData.taxId,
      gender: formData.gender,
      nickname: formData.nickname,
      maritalStatus: formData.maritalStatus,
      tradeChamberNumber: formData.tradeChamberNumber,
      registrationNumber: formData.registrationNumber,
      customerType: formData.customerType,
      customerRiskLimit: formData.customerRiskLimit,
      phone: formData.phone,
      fax: formData.fax,
      email: formData.email,
      website: formData.website,
      licensePlate: formData.licensePlate,
      addresses: formData.addresses,
      bankAccounts: formData.bankAccounts,
    };
  };

  const handleSubmit = async () => {
    try {
      const customerData = transformFormDataForAPI();

      if (isEdit && customer?.id) {
        await dispatch(
          updateCustomerById({
            ...customerData,
          })
        );
      } else {
        await dispatch(createCustomer(customerData));
      }
      navigate("/accountant/customers");
    } catch (error) {
      console.error("Error saving customer:", error);
    }
  };

  return (
    <div className="page-content">
      <div className="container-fluid">
        <Row>
          <Col lg={12}>
            <Card>
              <CardBody>
                <h4 className="card-title mb-4">
                  {isEdit
                    ? t("customer.form.title.edit")
                    : t("customer.form.title.new")}
                </h4>

                {currentStep === 1 && (
                  <BasicInfoForm
                    data={{
                      isCompany: formData.isCompany,
                      title: formData.title,
                      firstName: formData.firstName,
                      lastName: formData.lastName,
                      nationalId: formData.nationalId,
                      taxId: formData.taxId,
                      gender: formData.gender,
                      nickname: formData.nickname,
                      maritalStatus: formData.maritalStatus,
                      customerType: formData.customerType,
                      customerRiskLimit: formData.customerRiskLimit,
                    }}
                    onChange={handleBasicInfoChange}
                  />
                )}

                {currentStep === 2 && (
                  <ContactInfoForm
                    data={{
                      phone: formData.phone,
                      email: formData.email,
                      fax: formData.fax,
                      website: formData.website,
                      licensePlate: formData.licensePlate,
                      addresses: formData.addresses,
                    }}
                    onChange={handleContactInfoChange}
                  />
                )}

                {currentStep === 3 && (
                  <BankAccountForm
                    data={{
                      bankAccounts: formData.bankAccounts,
                    }}
                    onChange={handleBankAccountChange}
                  />
                )}

                <div className="d-flex justify-content-end mt-4">
                  <div className="d-flex gap-2">
                    {currentStep > 1 && (
                      <Button color="secondary" onClick={handlePrevious}>
                        {t("customer.form.buttons.previous")}
                      </Button>
                    )}
                    {currentStep < 3 ? (
                      <Button color="primary" onClick={handleNext}>
                        {t("customer.form.buttons.next")}
                      </Button>
                    ) : (
                      <Button color="success" onClick={handleSubmit}>
                        {isEdit
                          ? t("customer.form.buttons.update")
                          : t("customer.form.buttons.save")}
                      </Button>
                    )}
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default CustomerForm;

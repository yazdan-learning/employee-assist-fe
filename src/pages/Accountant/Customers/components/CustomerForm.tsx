import React, { useState, useEffect } from "react";
import { Row, Col, Card, CardBody, Button } from "reactstrap";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import * as Yup from "yup";
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
  fetchCustomerById,
} from "../../../../slices/customers/thunk";
import BasicInfoForm from "./BasicInfoForm";
import ContactInfoForm from "./ContactInfoForm";
import BankAccountForm from "./BankAccountForm";
import { AppDispatch, RootState } from "../../../../store";

interface CustomerFormProps {
  isEdit?: boolean;
}

const CustomerForm: React.FC<CustomerFormProps> = ({ isEdit = false }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useParams<{ id: string }>();
  const [currentStep, setCurrentStep] = useState(1);

  const { selectedCustomer, loading, error } = useSelector(
    (state: RootState) => state.customer
  );

  useEffect(() => {
    if (isEdit && id) {
      dispatch(fetchCustomerById(parseInt(id, 10)));
    }
  }, [dispatch, id, isEdit]);

  if (isEdit) {
    if (loading) {
      return <div>Loading...</div>;
    }

    if (error) {
      return <div>Error: {error}</div>;
    }

    if (!selectedCustomer) {
      return <div>Customer not found</div>;
    }
  }

  const initialValues: Customer =
    isEdit && selectedCustomer
      ? {
          ...selectedCustomer,
        }
      : {
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
          tradeChamberNumber: "",
          registrationNumber: "",
        };

  const validationSchema = Yup.object().shape({
    // Basic Info Validation
    isCompany: Yup.boolean(),
    title: Yup.string().when("isCompany", {
      is: true,
      then: () =>
        Yup.string().required(
          t("customer.form.validation.companyNameRequired")
        ),
      otherwise: () => Yup.string(),
    }),
    firstName: Yup.string().when("isCompany", {
      is: false,
      then: () =>
        Yup.string().test({
          name: "atLeastOneNameRequired",
          test: function (value) {
            const { lastName } = this.parent;
            if (!value && !lastName) {
              return false;
            }
            return true;
          },
          message: t("customer.form.validation.atLeastOneNameRequired"),
        }),
    }),
    lastName: Yup.string().when("isCompany", {
      is: false,
      then: () =>
        Yup.string().test({
          name: "atLeastOneNameRequired",
          test: function (value) {
            const { firstName } = this.parent;
            if (!value && !firstName) {
              return false;
            }
            return true;
          },
          message: t("customer.form.validation.atLeastOneNameRequired"),
        }),
    }),
    nationalId: Yup.string(),
    taxId: Yup.string(),
    gender: Yup.mixed(),
    nickname: Yup.string(),
    maritalStatus: Yup.mixed(),
    customerType: Yup.number(),
    customerRiskLimit: Yup.number(),

    // Contact Info Validation
    email: Yup.string()
      .nullable()
      .transform((value) => (value === "" ? null : value))
      .test("email", t("validation.invalidEmail"), (value) => {
        if (!value) return true; // Allow empty/null values
        return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value);
      }),
    website: Yup.string()
      .nullable()
      .transform((value) => (value === "" ? null : value))
      .test("website", t("validation.invalidWebsite"), (value) => {
        if (!value) return true; // Allow empty/null values
        return /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(
          value
        );
      }),
    fax: Yup.string(),
    phone: Yup.array().of(Yup.string()),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    validateOnMount: true,
    validateOnChange: true,
    onSubmit: async (values) => {
      try {
        if (isEdit && selectedCustomer?.id) {
          await dispatch(
            updateCustomerById({
              ...values,
              id: selectedCustomer.id,
            })
          );
        } else {
          await dispatch(createCustomer(values));
        }
        navigate("/accountant/customers");
      } catch (error) {
        console.error("Error saving customer:", error);
      }
    },
  });

  const handleNext = () => {
    const fields = getFieldsForCurrentStep();

    // Touch all fields in current step to show validation errors
    fields.forEach((field) => {
      formik.setFieldTouched(field, true);
    });

    // Check if there are any errors in the current step's fields
    const hasErrors = fields.some((field) => formik.errors[field]);

    if (!hasErrors) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleSave = async () => {
    try {
      // Touch all fields to show all validation errors
      Object.keys(formik.values).forEach((field) => {
        formik.setFieldTouched(field, true);
      });

      // Submit the form
      await formik.submitForm();
    } catch (error) {
      console.error("Save error:", error);
    }
  };

  const getFieldsForCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return [
          "isCompany",
          "title",
          "firstName",
          "lastName",
          "nationalId",
          "taxId",
          "gender",
          "maritalStatus",
          "customerType",
          "customerRiskLimit",
          "tradeChamberNumber",
          "registrationNumber",
        ];
      case 2:
        return ["email", "phone", "fax", "website", "licensePlate"];
      case 3:
        return [];
      default:
        return [];
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

                <form onSubmit={formik.handleSubmit}>
                  {currentStep === 1 && (
                    <BasicInfoForm
                      data={{
                        isCompany: formik.values.isCompany,
                        title: formik.values.title,
                        firstName: formik.values.firstName,
                        lastName: formik.values.lastName,
                        nationalId: formik.values.nationalId,
                        taxId: formik.values.taxId,
                        gender: formik.values.gender,
                        nickname: formik.values.nickname,
                        maritalStatus: formik.values.maritalStatus,
                        customerType: formik.values.customerType,
                        customerRiskLimit: formik.values.customerRiskLimit,
                      }}
                      onChange={(values) => {
                        Object.keys(values).forEach((key) => {
                          formik.setFieldValue(key, values[key]);
                        });
                      }}
                      errors={formik.errors}
                      touched={formik.touched}
                    />
                  )}

                  {currentStep === 2 && (
                    <ContactInfoForm
                      data={{
                        phone: formik.values.phone,
                        email: formik.values.email,
                        fax: formik.values.fax,
                        website: formik.values.website,
                        licensePlate: formik.values.licensePlate,
                        addresses: formik.values.addresses,
                      }}
                      onChange={(values) => {
                        Object.keys(values).forEach((key) => {
                          formik.setFieldValue(key, values[key]);
                        });
                      }}
                      errors={formik.errors}
                      touched={formik.touched}
                    />
                  )}

                  {currentStep === 3 && (
                    <BankAccountForm
                      bankAccounts={formik.values.bankAccounts}
                      onChange={(bankAccounts) => {
                        formik.setFieldValue("bankAccounts", bankAccounts);
                      }}
                    />
                  )}

                  <div className="d-flex justify-content-end mt-4">
                    <div className="d-flex gap-2">
                      {currentStep > 1 && (
                        <Button color="secondary" onClick={handlePrevious}>
                          {t("customer.form.buttons.previous")}
                        </Button>
                      )}

                      <Button color="primary" onClick={handleNext}>
                        {t("customer.form.buttons.next")}
                      </Button>

                      <Button color="success" onClick={handleSave}>
                        {isEdit
                          ? t("customer.form.buttons.update")
                          : t("customer.form.buttons.save")}
                      </Button>
                    </div>
                  </div>
                </form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default CustomerForm;

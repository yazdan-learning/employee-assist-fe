import React, { useState } from "react";
import { Row, Col, Card, CardBody, Button } from "reactstrap";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Customer, Gender, MaritalStatus, CustomerType } from "../types";
import {
  useCreateCustomer,
  useUpdateCustomer,
  useCustomerById,
} from "../../../../hooks/useCustomers";
import BasicInfoForm from "./BasicInfoForm";
import ContactInfoForm from "./ContactInfoForm";
import BankAccountForm from "./BankAccountForm";
import { toast } from "react-toastify";

const CustomerForm: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [currentStep, setCurrentStep] = useState(1);

  const {
    data: customerResponse,
    isLoading,
    isError,
    error,
  } = useCustomerById(id ? parseInt(id, 10) : 0);
  const createMutation = useCreateCustomer();
  const updateMutation = useUpdateCustomer();

  const initialValues: Customer =
    id && customerResponse?.data
      ? {
          isCompany: customerResponse.data.isCompany,
          title: customerResponse.data.title || "",
          firstName: customerResponse.data.firstName || "",
          lastName: customerResponse.data.lastName || "",
          nationalId: customerResponse.data.nationalId || "",
          taxId: customerResponse.data.taxId || "",
          gender: customerResponse.data.gender || null,
          nickname: customerResponse.data.nickname || "",
          maritalStatus: customerResponse.data.maritalStatus || null,
          customerType: customerResponse.data.customerType || CustomerType.NONE,
          customerRiskLimit: customerResponse.data.customerRiskLimit || 0,
          phone: customerResponse.data.phone || [],
          email: customerResponse.data.email || "",
          addresses: customerResponse.data.addresses || [],
          bankAccounts: customerResponse.data.bankAccounts || [],
          fax: customerResponse.data.fax || "",
          website: customerResponse.data.website || "",
          licensePlate: customerResponse.data.licensePlate || "",
          tradeChamberNumber: customerResponse.data.tradeChamberNumber || "",
          registrationNumber: customerResponse.data.registrationNumber || "",
        }
      : {
          isCompany: false,
          title: "",
          firstName: "",
          lastName: "",
          nationalId: "",
          taxId: "",
          gender: null,
          nickname: "",
          maritalStatus: null,
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
        if (!value) return true;
        return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value);
      }),
    website: Yup.string()
      .nullable()
      .transform((value) => (value === "" ? null : value))
      .test("website", t("validation.invalidWebsite"), (value) => {
        if (!value) return true;
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
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        if (id) {
          const response = await updateMutation.mutateAsync({
            ...values,
            id: parseInt(id, 10),
          });
          if (response.succeeded) {
            toast.success(t("customer.form.messages.updateSuccess"));
            navigate("/accountant/customers");
          } else {
            toast.error(
              response.errors || t("customer.form.messages.updateError")
            );
          }
        } else {
          const response = await createMutation.mutateAsync(values);
          if (response.succeeded) {
            toast.success(t("customer.form.messages.createSuccess"));
            navigate("/accountant/customers");
          } else {
            toast.error(
              response.errors || t("customer.form.messages.createError")
            );
          }
        }
      } catch (error) {
        console.error("Error saving customer:", error);
        toast.error(t("customer.form.messages.saveError"));
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

  if (id && isLoading) {
    return <div>Loading...</div>;
  }

  if (id && isError) {
    return <div>Error: {error?.message}</div>;
  }

  if (id && !customerResponse?.data) {
    return <div>Customer not found</div>;
  }

  return (
    <div className="page-content">
      <div className="container-fluid">
        <Row>
          <Col lg={12}>
            <Card>
              <CardBody>
                <h4 className="card-title mb-4">
                  {id
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

                      {currentStep < 3 && (
                        <Button color="primary" onClick={handleNext}>
                          {t("customer.form.buttons.next")}
                        </Button>
                      )}

                      <Button color="success" onClick={handleSave}>
                        {id
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

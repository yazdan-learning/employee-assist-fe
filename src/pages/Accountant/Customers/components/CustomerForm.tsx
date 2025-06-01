import React, { useState } from "react";
import { Row, Col, Card, CardBody, Button } from "reactstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
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

  const initialValues: Customer = {
    isCompany: customer?.isCompany ?? false,
    title: customer?.title ?? "",
    firstName: customer?.firstName ?? "",
    lastName: customer?.lastName ?? "",
    nationalId: customer?.nationalId ?? "",
    taxId: customer?.taxId ?? "",
    gender: customer?.gender ?? Gender.MALE,
    nickname: customer?.nickname ?? "",
    maritalStatus: customer?.maritalStatus ?? MaritalStatus.SINGLE,
    customerType: customer?.customerType ?? CustomerType.NONE,
    customerRiskLimit: customer?.customerRiskLimit ?? 0,
    phone: customer?.phone ?? [],
    email: customer?.email ?? "",
    addresses: customer?.addresses ?? [],
    bankAccounts: customer?.bankAccounts ?? [],
    fax: customer?.fax ?? "",
    website: customer?.website ?? "",
    licensePlate: customer?.licensePlate ?? "",
    tradeChamberNumber: customer?.tradeChamberNumber ?? "",
    registrationNumber: customer?.registrationNumber ?? "",
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

    // Contact Info Validation - making fields optional
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
    addresses: Yup.array().of(
      Yup.object().shape({
        title: Yup.string(),
        value: Yup.string(),
        postalCode: Yup.string(),
        isPrimary: Yup.boolean(),
      })
    ),

    // Bank Account Validation - making fields optional at customer level
    bankAccounts: Yup.array().of(
      Yup.object().shape({
        accountNumber: Yup.string().required(t("validation.required")),
        iban: Yup.string().required(t("validation.required")),
        cardNumber: Yup.string().required(t("validation.required")),
        title: Yup.string().required(t("validation.required")),
        branchName: Yup.string().required(t("validation.required")),
        branchCode: Yup.string().required(t("validation.required")),
        bankId: Yup.number().required(t("validation.required")),
      })
    ),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    validateOnMount: true,
    validateOnChange: true,
    onSubmit: async (values) => {
      try {
        if (isEdit && customer?.id) {
          await dispatch(
            updateCustomerById({
              ...values,
              id: customer.id,
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

  const handleNext = async () => {
    const fields = getFieldsForCurrentStep();
    try {
      // Touch all fields in current step to show validation errors
      fields.forEach((field) => {
        formik.setFieldTouched(field, true);
      });

      // For bank accounts step, validate each bank account
      if (currentStep === 3 && formik.values.bankAccounts.length > 0) {
        const bankAccountSchema = Yup.object().shape({
          accountNumber: Yup.string().required(t("validation.required")),
          iban: Yup.string().required(t("validation.required")),
          cardNumber: Yup.string().required(t("validation.required")),
          title: Yup.string().required(t("validation.required")),
          branchName: Yup.string().required(t("validation.required")),
          branchCode: Yup.string().required(t("validation.required")),
          bankId: Yup.number().required(t("validation.required")),
        });

        try {
          await Promise.all(
            formik.values.bankAccounts.map((account) =>
              bankAccountSchema.validate(account, { abortEarly: false })
            )
          );
        } catch (error) {
          // If there are validation errors, don't proceed
          return;
        }
      }

      // Validate only the current step's fields
      const stepErrors = await formik.validateForm();
      const hasErrors = fields.some((field) => stepErrors[field]);

      if (!hasErrors) {
        setCurrentStep((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Validation error:", error);
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
        ];
      case 2:
        return ["email", "phone", "addresses"];
      case 3:
        return ["bankAccounts"];
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

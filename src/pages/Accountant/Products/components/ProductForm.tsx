import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Row, Col, Card, CardBody, Button } from "reactstrap";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Product, ProductStatus } from "../types";
import {
  useCreateProduct,
  useUpdateProduct,
  useProductById,
} from "../../../../hooks/useProducts";
import BasicInfoForm from "./BasicInfoForm";
import GeneralInfoForm from "./GeneralInfoForm";
import AdditionalInfoForm from "./AdditionalInfoForm";

const ProductForm: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [currentStep, setCurrentStep] = useState(1);

  const {
    data: productResponse,
    isLoading,
    isError,
    error,
  } = useProductById(id ? parseInt(id, 10) : 0);

  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();

  const initialValues: Product =
    id && productResponse?.data
      ? productResponse.data
      : {
          id: 0,
          name: "",
          code: "",
          description: "",
          barcode: "",
          isService: false,
          hasSerial: false,
          allowNegativeStock: false,
          status: ProductStatus.INACTIVE,
          categoryId: 0,
          attributes: [],
          units: [],
          locations: [],
          images: [],
          prices: [],
          taxAmount: 0
        };

  const validationSchema = Yup.object().shape({
    // Basic Info Validation
    categoryId: Yup.number().required(t("validation.required")),
    code: Yup.string().required(t("validation.required")),
    name: Yup.string().required(t("validation.required")),
    description: Yup.string(),
    status: Yup.string().required(t("validation.required")),
    isService: Yup.boolean(),
    hasSerial: Yup.boolean(),
    allowNegativeStock: Yup.boolean(),
    units: Yup.array()
      .of(
        Yup.object().shape({
          unitId: Yup.number().required(t("validation.required")),
          isPrimary: Yup.boolean(),
          conversionRate: Yup.number()
            .min(0.0001, t("validation.min", { min: 0.0001 }))
            .required(t("validation.required")),
          weightPerUnit: Yup.number()
            .min(0, t("validation.min", { min: 0 }))
            .required(t("validation.required")),
        })
      )
      .test("hasPrimary", t("product.form.units.validation.primaryRequired"), function(value) {
        return value?.some(unit => unit.isPrimary) || false;
      }),
    taxAmount: Yup.number()
      .min(0, t("validation.min", { min: 0 }))
      .max(100, t("validation.max", { max: 100 }))
      .required(t("validation.required")),
    barcode: Yup.string(),
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
            toast.success(t("product.form.messages.updateSuccess"));
            navigate("/accountant/products");
          } else {
            toast.error(
              response.errors || t("product.form.messages.updateError")
            );
          }
        } else {
          const response = await createMutation.mutateAsync(values);
          if (response.succeeded) {
            toast.success(t("product.form.messages.createSuccess"));
            navigate("/accountant/products");
          } else {
            toast.error(
              response.errors || t("product.form.messages.createError")
            );
          }
        }
      } catch (error) {
        console.error("Error saving product:", error);
        toast.error(t("product.form.messages.saveError"));
      }
    },
  });

  const handleNext = () => {
    const fields = getFieldsForCurrentStep();

    // Touch all fields in current step to show validation errors
    fields.forEach((field) => {
      formik.setFieldTouched(field, true);
    });

    // For basic info step, also validate units
    if (currentStep === 1) {
      formik.setFieldTouched("units", true);
    }

    // Check if there are any errors in the current step's fields
    const hasErrors = fields.some((field) => formik.errors[field]);

    // For basic info step, also check units validation
    if (currentStep === 1) {
      const unitsError = formik.errors.units;
      if (unitsError) {
        return;
      }
    }

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

      // Validate all fields
      const errors = await formik.validateForm();
      const hasErrors = Object.keys(errors).length > 0;

      if (hasErrors) {
        return;
      }

      // Submit the form if validation passes
      await formik.submitForm();
    } catch (error) {
      console.error("Save error:", error);
      toast.error(t("product.form.messages.saveError"));
    }
  };

  const getFieldsForCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return [
          "categoryId",
          "code",
          "name",
          "description",
          "status",
          "isService",
          "hasSerial",
          "allowNegativeStock",
        ];
      case 2:
        return [];
      case 3:
        return ["taxAmount", "minQuantity", "maxQuantity", "barcode"];
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

  if (id && !productResponse?.data) {
    return <div>Product not found</div>;
  }

  return (
    <div className="page-content">
      <div className="container-fluid">
        <Row>
          <Col lg={12}>
            <Card>
              <CardBody>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h4 className="card-title mb-0">
                    {id
                      ? t("product.form.title.edit")
                      : t("product.form.title.new")}
                  </h4>
                  <div className="step-indicator d-flex align-items-center">
                    <span className="me-2">
                      {t(
                        "product.form.steps." +
                          (currentStep === 1
                            ? "basicInfo"
                            : currentStep === 2
                            ? "generalInfo"
                            : "additionalInfo")
                      )}{" "}
                      -{" "}
                      {t("product.form.step", {
                        current: currentStep,
                        total: 3,
                      })}
                    </span>
                    <div
                      className="progress"
                      style={{ width: "100px", height: "6px" }}
                    >
                      <div
                        className="progress-bar"
                        role="progressbar"
                        style={{ width: `${(currentStep / 3) * 100}%` }}
                        aria-valuenow={currentStep}
                        aria-valuemin={1}
                        aria-valuemax={3}
                      />
                    </div>
                  </div>
                </div>

                <form onSubmit={formik.handleSubmit}>
                  {currentStep === 1 && (
                    <BasicInfoForm
                      data={formik.values}
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
                    <GeneralInfoForm
                      data={formik.values}
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
                    <AdditionalInfoForm
                      data={formik.values}
                      onChange={(values) => {
                        Object.keys(values).forEach((key) => {
                          formik.setFieldValue(key, values[key]);
                        });
                      }}
                      errors={formik.errors}
                      touched={formik.touched}
                    />
                  )}

                  <div className="d-flex justify-content-end gap-2 mt-4">
                    {currentStep > 1 && (
                      <Button color="light" onClick={handlePrevious}>
                        {t("common.form.buttons.previous")}
                      </Button>
                    )}
                    <Button
                      color="light"
                      onClick={() => navigate("/accountant/products")}
                    >
                      {t("common.form.buttons.cancel")}
                    </Button>
                    <Button color="success" onClick={handleSave}>
                      {id
                        ? t("common.form.buttons.update")
                        : t("common.form.buttons.save")}
                    </Button>
                    {currentStep < 3 && (
                      <Button color="primary" onClick={handleNext}>
                        {t("common.form.buttons.next")}
                      </Button>
                    )}
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

export default ProductForm;

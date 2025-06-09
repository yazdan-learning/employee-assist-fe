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
import PricingForm from "./PricingForm";

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
          categoryId: null,
          attributes: [],
          units: [],
          locations: [],
          images: [],
          prices: [],
          taxAmount: 0,
          minQuantity: 0,
          maxQuantity: 0,
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

    // General Info Validation
    attributes: Yup.array().of(
      Yup.object().shape({
        attributeId: Yup.number().required(),
        value: Yup.string().required(),
      })
    ),
    units: Yup.array().of(
      Yup.object().shape({
        unitId: Yup.number().required(),
        conversionRate: Yup.number().min(0).required(),
        weightPerUnit: Yup.number().min(0),
        isPrimary: Yup.boolean(),
      })
    ),
    locations: Yup.array().of(
      Yup.object().shape({
        locationId: Yup.number().required(),
        quantity: Yup.number().min(0).required(),
      })
    ),

    // Pricing Validation
    taxAmount: Yup.number()
      .min(0, t("validation.min", { min: 0 }))
      .max(100, t("validation.max", { max: 100 }))
      .required(t("validation.required")),
    minQuantity: Yup.number()
      .min(0, t("validation.min", { min: 0 }))
      .required(t("validation.required")),
    maxQuantity: Yup.number()
      .min(
        Yup.ref("minQuantity"),
        t("validation.greaterThan", { field: t("product.form.minQuantity") })
      )
      .required(t("validation.required")),
    barcode: Yup.string(),
    prices: Yup.array().of(
      Yup.object().shape({
        sellTypeId: Yup.number().required(),
        price: Yup.number().min(0).required(),
        currency: Yup.string().required(),
        discountPercentage: Yup.number().min(0).max(100),
      })
    ),
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
        return ["attributes", "units", "locations"];
      case 3:
        return ["taxAmount", "minQuantity", "maxQuantity", "barcode", "prices"];
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
                    <PricingForm
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

                  <div className="d-flex justify-content-between mt-4">
                    <Button
                      color="light"
                      onClick={handlePrevious}
                      disabled={currentStep === 1}
                    >
                      {t("common.back")}
                    </Button>
                    <div className="d-flex gap-2">
                      <Button
                        color="light"
                        onClick={() => navigate("/accountant/products")}
                      >
                        {t("common.cancel")}
                      </Button>
                      <Button
                        color="primary"
                        onClick={currentStep === 3 ? handleSave : handleNext}
                      >
                        {currentStep === 3
                          ? id
                            ? t("common.update")
                            : t("common.save")
                          : t("common.next")}
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

export default ProductForm;

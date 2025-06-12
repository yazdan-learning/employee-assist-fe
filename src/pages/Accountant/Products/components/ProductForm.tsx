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
import StepIndicator, { Step } from "../../../../Components/StepIndicator/StepIndicator";
import { Package, FileText, Settings } from 'react-feather';

const ProductForm: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [currentStep, setCurrentStep] = useState(1);
  const [invalidSteps, setInvalidSteps] = useState<number[]>([]);

  const steps: Step[] = [
    {
      icon: <Package size={20} />,
      title: t('product.form.steps.basicInfo'),
      description: t('product.form.steps.basicInfoDesc')
    },
    {
      icon: <FileText size={20} />,
      title: t('product.form.steps.generalInfo'),
      description: t('product.form.steps.generalInfoDesc')
    },
    {
      icon: <Settings size={20} />,
      title: t('product.form.steps.additionalInfo'),
      description: t('product.form.steps.additionalInfoDesc')
    }
  ];

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

  const validateStep = (stepNumber: number): boolean => {
    const fields = getFieldsForStep(stepNumber);
    
    // Touch all fields in the step to show validation errors
    fields.forEach((field) => {
      formik.setFieldTouched(field, true);
    });

    // For basic info step, also validate units
    if (stepNumber === 1) {
      formik.setFieldTouched("units", true);
    }

    // Check if there are any errors in the step's fields
    const hasErrors = fields.some((field) => formik.errors[field]);

    // For basic info step, also check units validation
    if (stepNumber === 1) {
      const unitsError = formik.errors.units;
      if (unitsError) {
        return false;
      }
    }

    return !hasErrors;
  };

  const validateCurrentStep = (): boolean => {
    return validateStep(currentStep);
  };

  const validateAllSteps = (): boolean => {
    const invalidStepsList: number[] = [];
    
    // Validate each step
    for (let step = 1; step <= 3; step++) {
      if (!validateStep(step)) {
        invalidStepsList.push(step);
      }
    }

    setInvalidSteps(invalidStepsList);
    return invalidStepsList.length === 0;
  };

  const handleStepChange = (targetStep: number) => {
    // Always validate current step before any navigation
    if (!validateCurrentStep()) {
      return;
    }
    
    setCurrentStep(targetStep);
  };

  const handleNext = () => {
    handleStepChange(currentStep + 1);
  };

  const handlePrevious = () => {
    handleStepChange(currentStep - 1);
  };

  const handleSave = async () => {
    try {
      // Validate all steps before saving
      if (!validateAllSteps()) {
        toast.error(t('product.form.messages.completeAllSteps'));
        return;
      }

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

  const getFieldsForStep = (stepNumber: number) => {
    switch (stepNumber) {
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
                </div>

                <StepIndicator 
                  currentStep={currentStep}
                  steps={steps}
                  onStepClick={handleStepChange}
                  allowStepClick={true}
                  invalidSteps={invalidSteps}
                />

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
                    <Button
                      color="light"
                      onClick={() => navigate("/accountant/products")}
                    >
                      {t("common.form.buttons.cancel")}
                    </Button>
                    {currentStep > 1 && (
                      <Button color="light" onClick={handlePrevious}>
                        {t("common.form.buttons.previous")}
                      </Button>
                    )}
                    {currentStep < 3 && (
                      <Button color="primary" onClick={handleNext}>
                        {t("common.form.buttons.next")}
                      </Button>
                    )}
                    <Button color="success" onClick={handleSave}>
                      {id
                        ? t("common.form.buttons.update")
                        : t("common.form.buttons.save")}
                    </Button>
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

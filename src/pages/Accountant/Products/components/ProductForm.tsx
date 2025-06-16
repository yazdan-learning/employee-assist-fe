import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Row, Col, Card, CardBody, Button } from "reactstrap";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Product } from "../types";
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
import { useFormSteps } from "../../../../hooks/useFormSteps";

const ProductForm: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

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
          isActive: true,
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
    isActive: Yup.boolean(),
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
          "units"
        ];
      case 2:
        return [];
      case 3:
        return ["taxAmount", "barcode"];
      default:
        return [];
    }
  };

  const {
    currentStep,
    invalidSteps,
    handleStepChange,
    handleNext,
    handlePrevious,
    handleSave,
  } = useFormSteps({
    formik,
    totalSteps: 3,
    getFieldsForStep,
  });

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
                      data={{
                        categoryId: formik.values.categoryId,
                        code: formik.values.code,
                        name: formik.values.name,
                        description: formik.values.description,
                        isActive: formik.values.isActive,
                        isService: formik.values.isService,
                        hasSerial: formik.values.hasSerial,
                        allowNegativeStock: formik.values.allowNegativeStock,
                        units: formik.values.units,
                      }}
                      onChange={(data) => {
                        Object.keys(data).forEach((key) => {
                          formik.setFieldValue(key, data[key as keyof typeof data]);
                        });
                      }}
                      errors={formik.errors}
                      touched={formik.touched}
                      isEdit={!!id}
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

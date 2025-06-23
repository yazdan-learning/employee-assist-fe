import React from "react";
import { Card, CardBody, Button } from "reactstrap";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import { Invoice, InvoiceType } from "../types";
import InvoiceHeader from "./InvoiceHeader";
import InvoiceDetailList from "./InvoiceDetailList";
import InvoiceFooter from "./InvoiceFooter";

interface InvoiceFormProps {
  type?: InvoiceType;
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({ type: propType }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { type: urlType, id } = useParams();

  // Use prop type if provided, otherwise use URL type
  const invoiceType = propType || (urlType?.toUpperCase() as InvoiceType);
  if (!invoiceType || !Object.values(InvoiceType).includes(invoiceType)) {
    navigate('/accountant/invoices');
    return null;
  }

  const formik = useFormik({
    initialValues: {
      type: invoiceType,
      number: "",
      date: new Date().toISOString().split("T")[0],
      description: "",
      partnerId: "",
      details: [],
    },
    validationSchema: Yup.object().shape({
      partnerId: Yup.number().required(t("common.required")),
      number: Yup.string().required(t("common.required")),
      date: Yup.string().required(t("common.required")),
      details: Yup.array()
        .of(
          Yup.object().shape({
            productId: Yup.number().required(t("common.required")),
            unitId: Yup.number().required(t("common.required")),
            quantity: Yup.number()
              .required(t("common.required"))
              .min(0, t("common.min", { value: 0 })),
            unitPrice: Yup.number()
              .required(t("common.required"))
              .min(0, t("common.min", { value: 0 })),
            discount: Yup.number()
              .required(t("common.required"))
              .min(0, t("common.min", { value: 0 })),
            vat: Yup.number()
              .required(t("common.required"))
              .min(0, t("common.min", { value: 0 })),
          })
        )
        .min(1, t("invoice.form.details.required")),
    }),
    onSubmit: async (values) => {
      try {
        // TODO: Implement invoice submission
        console.log('Submitting invoice:', values);
        navigate('/accountant/invoices');
      } catch (error) {
        console.error('Error submitting invoice:', error);
      }
    },
  });

  const handleCancel = () => {
    navigate('/accountant/invoices');
  };

  return (
    <div className="invoice-form">
      <Card>
        <CardBody>
          <h4 className="mb-4">
            {invoiceType === InvoiceType.BUY
              ? t("invoice.form.buyTitle")
              : t("invoice.form.sellTitle")}
          </h4>

          {/* Header */}
          <InvoiceHeader
            type={invoiceType}
            onHeaderChange={(values) => {
              Object.keys(values).forEach((key) => {
                formik.setFieldValue(key, values[key]);
              });
            }}
            initialValues={formik.values}
          />

          <hr className="my-4" />

          {/* Details */}
          <InvoiceDetailList
            details={formik.values.details}
            onChange={(details) => formik.setFieldValue("details", details)}
          />

          <hr className="my-4" />

          {/* Footer */}
          <InvoiceFooter details={formik.values.details} />

          {/* Form Actions */}
          <div className="d-flex justify-content-end gap-2 mt-4">
            <Button color="light" onClick={handleCancel}>
              {t("common.cancel")}
            </Button>
            <Button
              color="primary"
              onClick={() => formik.handleSubmit()}
              disabled={!formik.isValid || formik.values.details.length === 0}
            >
              {t("common.save")}
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default InvoiceForm; 
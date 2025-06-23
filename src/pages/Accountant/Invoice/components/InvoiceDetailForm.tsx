import React, { useEffect } from "react";
import { Row, Col, FormGroup, Label, Input, Button } from "reactstrap";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import * as Yup from "yup";
import RaDropdown from "../../../../Components/Common/RaDropdown";
import { InvoiceDetail } from "../types";
import { useProductList, useProductById, useUnits } from "../../../../hooks/useProducts";
import type { Product } from "../../Products/types";

interface InvoiceDetailFormProps {
  onSave: (detail: InvoiceDetail) => void;
  onCancel: () => void;
  initialValues?: Partial<InvoiceDetail>;
}

const InvoiceDetailForm: React.FC<InvoiceDetailFormProps> = ({
  onSave,
  onCancel,
  initialValues,
}) => {
  const { t } = useTranslation();
  const { data: productList } = useProductList({
    page: 1,
    pageSize: 1000,
  });
  const products = productList?.data?.items || [];
  const { data: units = [] } = useUnits();

  const validationSchema = Yup.object().shape({
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
  });

  const formik = useFormik({
    initialValues: {
      productId: initialValues?.productId || "",
      unitId: initialValues?.unitId || "",
      primaryUnitId: initialValues?.primaryUnitId || "",
      quantity: initialValues?.quantity || 0,
      unitPrice: initialValues?.unitPrice || 0,
      discount: initialValues?.discount || 0,
      vat: initialValues?.vat || 0,
      finalPrice: initialValues?.finalPrice || 0,
      conversionRate: initialValues?.conversionRate || 1,
    },
    validationSchema,
    onSubmit: (values) => {
      const finalPrice =
        values.quantity * values.unitPrice * (1 - values.discount / 100) * (1 + values.vat / 100);
      onSave({
        ...values,
        finalPrice,
      } as InvoiceDetail);
    },
  });

  // Get selected product details
  const { data: selectedProductResponse } = useProductById(
    formik.values.productId ? Number(formik.values.productId) : 0
  );
  const selectedProduct = selectedProductResponse?.data;

  // Update VAT when product changes
  useEffect(() => {
    if (selectedProduct) {
      formik.setFieldValue("vat", selectedProduct.taxAmount || 0);
    }
  }, [selectedProduct]);

  return (
    <div>
      <Row>
        <Col md={6}>
          <FormGroup>
            <Label>{t("invoice.form.product")}</Label>
            <RaDropdown
              value={formik.values.productId.toString()}
              onChange={(value) => formik.setFieldValue("productId", value ? parseInt(value, 10) : "")}
              options={products.map((p) => ({
                value: p.id?.toString() || "",
                label: p.name,
              }))}
              placeholder={t("common.select")}
              showClear
            />
            {formik.touched.productId && formik.errors.productId && (
              <div className="invalid-feedback d-block">
                {String(formik.errors.productId)}
              </div>
            )}
          </FormGroup>
        </Col>
        <Col md={6}>
          <FormGroup>
            <Label>{t("invoice.form.unit")}</Label>
            <RaDropdown
              value={formik.values.unitId.toString()}
              onChange={(value) => {
                const unitId = value ? parseInt(value, 10) : "";
                formik.setFieldValue("unitId", unitId);
                if (selectedProduct) {
                  const unit = selectedProduct.units.find((u) => u.unitId === unitId);
                  if (unit) {
                    formik.setFieldValue("primaryUnitId", unit.isPrimary ? unit.unitId : null);
                    formik.setFieldValue("conversionRate", unit.conversionRate);
                  }
                }
              }}
              options={
                selectedProduct?.units.map((u) => {
                  const unit = units.find((unit) => unit.id === u.unitId);
                  return {
                    value: u.unitId.toString(),
                    label: unit?.name || u.unitId.toString(),
                  };
                }) || []
              }
              placeholder={t("common.select")}
              showClear
              disabled={!selectedProduct}
            />
            {formik.touched.unitId && formik.errors.unitId && (
              <div className="invalid-feedback d-block">
                {String(formik.errors.unitId)}
              </div>
            )}
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <FormGroup>
            <Label>{t("invoice.form.quantity")}</Label>
            <Input
              type="number"
              name="quantity"
              value={formik.values.quantity}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              invalid={!!(formik.touched.quantity && formik.errors.quantity)}
            />
          </FormGroup>
        </Col>
        <Col md={6}>
          <FormGroup>
            <Label>{t("invoice.form.unitPrice")}</Label>
            <Input
              type="number"
              name="unitPrice"
              value={formik.values.unitPrice}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              invalid={!!(formik.touched.unitPrice && formik.errors.unitPrice)}
            />
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <FormGroup>
            <Label>{t("invoice.form.discount")}</Label>
            <Input
              type="number"
              name="discount"
              value={formik.values.discount}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              invalid={!!(formik.touched.discount && formik.errors.discount)}
            />
          </FormGroup>
        </Col>
        <Col md={6}>
          <FormGroup>
            <Label>{t("invoice.form.vat")}</Label>
            <Input
              type="number"
              name="vat"
              value={formik.values.vat}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              invalid={!!(formik.touched.vat && formik.errors.vat)}
              disabled
            />
          </FormGroup>
        </Col>
      </Row>
      <div className="d-flex justify-content-end gap-2 mt-3">
        <Button color="light" onClick={onCancel}>
          {t("common.cancel")}
        </Button>
        <Button color="primary" onClick={() => formik.handleSubmit()}>
          {t("common.save")}
        </Button>
      </div>
    </div>
  );
};

export default InvoiceDetailForm; 
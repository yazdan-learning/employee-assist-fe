import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button, FormGroup, Label, Row, Col, Input } from "reactstrap";
import { useTranslation } from "react-i18next";
import RaDropdown from "../../../../Components/Common/RaDropdown";
import { useSellTypes } from "../../../../hooks/useProducts";

interface Price {
  sellTypeId: number;
  price: number;
  currency: string;
  discountPercentage?: number;
}

interface PriceFormFieldsProps {
  price?: Price;
  onSave: (price: Price) => void;
  onCancel: () => void;
}

const CURRENCIES = [
  { value: "USD", label: "USD" },
  { value: "EUR", label: "EUR" },
  { value: "GBP", label: "GBP" },
];

const PriceFormFields: React.FC<PriceFormFieldsProps> = ({
  price,
  onSave,
  onCancel,
}) => {
  const { t } = useTranslation();
  const { data: sellTypes = [] } = useSellTypes();

  const validationSchema = Yup.object().shape({
    sellTypeId: Yup.number().required(t("validation.required")),
    price: Yup.number()
      .min(0, t("validation.min", { min: 0 }))
      .required(t("validation.required")),
    currency: Yup.string().required(t("validation.required")),
    discountPercentage: Yup.number()
      .min(0, t("validation.min", { min: 0 }))
      .max(100, t("validation.max", { max: 100 })),
  });

  const formik = useFormik({
    initialValues: price || {
      sellTypeId: 0,
      price: 0,
      currency: "USD",
      discountPercentage: 0,
    },
    validationSchema,
    onSubmit: (values) => {
      onSave(values);
    },
  });

  // Update discount percentage when sell type changes
  useEffect(() => {
    if (formik.values.sellTypeId) {
      const sellType = sellTypes.find(
        (st) => st.id === formik.values.sellTypeId
      );
      if (sellType) {
        formik.setFieldValue("discountPercentage", sellType.discountPercentage);
      }
    }
  }, [formik.values.sellTypeId, sellTypes]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Touch all fields to show validation errors
    Object.keys(formik.values).forEach((field) => {
      formik.setFieldTouched(field, true);
    });

    // Validate all fields
    const errors = await formik.validateForm();

    // If no errors, proceed with save
    if (Object.keys(errors).length === 0) {
      onSave(formik.values);
    }
  };

  return (
    <form>
      <Row>
        <Col md={6}>
          <FormGroup>
            <Label for="sellTypeId">{t("product.form.prices.sellType")}</Label>
            <RaDropdown
              options={sellTypes.map((st) => ({
                value: st.id.toString(),
                label: st.name,
              }))}
              value={formik.values.sellTypeId?.toString() || ""}
              onChange={(value) =>
                formik.setFieldValue("sellTypeId", value ? Number(value) : 0)
              }
              placeholder={t("product.form.prices.placeholders.sellType")}
            />
            {formik.touched.sellTypeId && formik.errors.sellTypeId && (
              <div className="invalid-feedback d-block">
                {formik.errors.sellTypeId}
              </div>
            )}
          </FormGroup>
        </Col>
        <Col md={6}>
          <FormGroup>
            <Label for="currency">{t("product.form.prices.currency")}</Label>
            <RaDropdown
              options={CURRENCIES}
              value={formik.values.currency}
              onChange={(value) => formik.setFieldValue("currency", value)}
              placeholder={t("product.form.prices.placeholders.currency")}
            />
            {formik.touched.currency && formik.errors.currency && (
              <div className="invalid-feedback d-block">
                {formik.errors.currency}
              </div>
            )}
          </FormGroup>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <FormGroup>
            <Label for="price">{t("product.form.prices.price")}</Label>
            <Input
              id="price"
              type="number"
              min={0}
              step="0.01"
              {...formik.getFieldProps("price")}
              invalid={formik.touched.price && Boolean(formik.errors.price)}
            />
            {formik.touched.price && formik.errors.price && (
              <div className="invalid-feedback">{formik.errors.price}</div>
            )}
          </FormGroup>
        </Col>
        <Col md={6}>
          <FormGroup>
            <Label for="discountPercentage">
              {t("product.form.prices.discount")} (%)
            </Label>
            <Input
              id="discountPercentage"
              type="number"
              min={0}
              max={100}
              {...formik.getFieldProps("discountPercentage")}
              invalid={
                formik.touched.discountPercentage &&
                Boolean(formik.errors.discountPercentage)
              }
            />
            {formik.touched.discountPercentage &&
              formik.errors.discountPercentage && (
                <div className="invalid-feedback">
                  {formik.errors.discountPercentage}
                </div>
              )}
          </FormGroup>
        </Col>
      </Row>

      <div className="d-flex justify-content-end gap-2 mt-3">
        <Button type="button" color="light" onClick={onCancel}>
          {t("common.cancel")}
        </Button>
        <Button type="submit" color="primary" onClick={handleSubmit}>
          {t("common.save")}
        </Button>
      </div>
    </form>
  );
};

export default PriceFormFields;

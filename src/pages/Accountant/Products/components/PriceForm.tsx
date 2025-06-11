import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button, FormGroup, Label, Row, Col, Input } from "reactstrap";
import { useTranslation } from "react-i18next";
import RaDropdown from "../../../../Components/Common/RaDropdown";
import { FormikErrors, FormikTouched } from "formik";
import { Product } from "../types";
import { useSellTypes, useCurrencies } from "../../../../hooks/useProducts";
import { formatNumber, parseFormattedNumber } from "../../../../helpers/number_helper";

interface Price {
  sellTypeId: number;
  price: number;
  currency: string;
  discountPercentage?: number;
}

interface PriceFormProps {
  price?: Price;
  onSave: (price: Price) => void;
  onCancel: () => void;
  errors?: FormikErrors<Product>;
  touched?: FormikTouched<Product>;
}

const PriceForm: React.FC<PriceFormProps> = ({
  price,
  onSave,
  onCancel
}) => {
  const { t } = useTranslation();
  const { data: sellTypes = [] } = useSellTypes();
  const { data: currencies = [] } = useCurrencies();

  const validationSchema = Yup.object().shape({
    sellTypeId: Yup.number()
      .required(t("validation.required"))
      .min(1, t("validation.required")),
    price: Yup.number()
      .required(t("validation.required"))
      .min(0, t("validation.min", { min: 0 })),
    currency: Yup.string()
      .required(t("validation.required"))
      .min(1, t("validation.required")),
    discountPercentage: Yup.number()
      .min(0, t("validation.min", { min: 0 }))
      .max(100, t("validation.max", { max: 100 }))
      .nullable(),
  });

  const formik = useFormik<Price>({
    initialValues: price || {
      sellTypeId: 0,
      price: 0,
      currency: "",
      discountPercentage: 0,
    },
    validationSchema,
    onSubmit: onSave,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    Object.keys(formik.values).forEach((field) => {
      formik.setFieldTouched(field, true);
    });
    const errors = await formik.validateForm();
    if (Object.keys(errors).length === 0) {
      onSave(formik.values);
    }
  };

  return (
    <form>
      <Row className="mb-3">
        <Col md={6}>
          <FormGroup>
            <Label for="sellTypeId">{t("product.form.prices.sellType")}</Label>
            <RaDropdown
              options={sellTypes.map((st) => ({
                value: st.id.toString(),
                label: st.name,
              }))}
              value={formik.values.sellTypeId?.toString() || ""}
              onChange={(value) => {
                const sellTypeId = value ? Number(value) : 0;
                formik.setFieldValue("sellTypeId", sellTypeId);
                // Set default discount from sell type
                const selectedSellType = sellTypes.find(st => st.id === sellTypeId);
                if (selectedSellType) {
                  formik.setFieldValue("discountPercentage", selectedSellType.discountPercentage);
                }
              }}
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
            <Label for="price">{t("product.form.prices.price")}</Label>
            <Input
              id="price"
              type="text"
              value={formatNumber(formik.values.price)}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, '');
                formik.setFieldValue("price", parseFormattedNumber(value));
              }}
              placeholder={t("product.form.prices.placeholders.price")}
            />
            {formik.touched.price && formik.errors.price && (
              <div className="invalid-feedback d-block">
                {formik.errors.price}
              </div>
            )}
          </FormGroup>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <FormGroup>
            <Label for="currency">{t("product.form.prices.currency")}</Label>
            <RaDropdown
              options={currencies.map((curr) => ({
                value: curr.code,
                label: `${curr.code} - ${curr.name}`,
              }))}
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
              value={formik.values.discountPercentage || ""}
              onChange={(e) =>
                formik.setFieldValue(
                  "discountPercentage",
                  e.target.value ? Number(e.target.value) : null
                )
              }
              placeholder={t("product.form.prices.placeholders.discount")}
            />
            {formik.touched.discountPercentage &&
              formik.errors.discountPercentage && (
                <div className="invalid-feedback d-block">
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

export default PriceForm;

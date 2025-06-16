import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button, FormGroup, Label, Row, Col, Input } from "reactstrap";
import { useTranslation } from "react-i18next";
import RaDropdown from "../../../../Components/Common/RaDropdown";
import { FormikErrors, FormikTouched } from "formik";
import { Product } from "../types";
import { useSellTypes } from "../../../../hooks/useProducts";
import { formatNumber, parseFormattedNumber } from "../../../../helpers/number_helper";

interface Price {
  sellTypeId: number;
  price: number;
  currency: string;
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

  const validationSchema = Yup.object().shape({
    sellTypeId: Yup.number()
      .required(t("product.form.prices.validation.sellTypeRequired"))
      .min(1, t("product.form.prices.validation.sellTypeRequired")),
    price: Yup.number()
      .required(t("product.form.prices.validation.priceRequired"))
      .min(0, t("product.form.prices.validation.priceMin")),
  });

  const formik = useFormik<Price>({
    initialValues: price || {
      sellTypeId: 0,
      price: 0,
      currency: "",
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

  const selectedSellType = sellTypes.find(st => st.id === formik.values.sellTypeId);

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
                const selectedSellType = sellTypes.find(st => st.id === sellTypeId);
                formik.setFieldValue("sellTypeId", sellTypeId);
                if (selectedSellType) {
                  formik.setFieldValue("currency", selectedSellType.currency);
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
              disabled={!formik.values.sellTypeId}
            />
            {formik.touched.price && formik.errors.price && (
              <div className="invalid-feedback d-block">
                {formik.errors.price}
              </div>
            )}
            {selectedSellType && (
              <small className="text-muted">
                {selectedSellType.currencySymbol} {selectedSellType.currency}
              </small>
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

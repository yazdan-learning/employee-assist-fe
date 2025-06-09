import React from "react";
import { Card, CardBody, Row, Col, FormGroup, Label, Input } from "reactstrap";
import { useTranslation } from "react-i18next";
import { PricingFormData } from "../types/forms";
import PriceList from "./PriceList";
import { FormikErrors, FormikTouched } from "formik";
import { Product } from "../types";

interface AdditionalInfoFormProps {
  data: PricingFormData;
  onChange: (data: PricingFormData) => void;
  errors?: FormikErrors<Product>;
  touched?: FormikTouched<Product>;
}

const AdditionalInfoForm: React.FC<AdditionalInfoFormProps> = ({
  data,
  onChange,
  errors = {},
  touched = {},
}) => {
  const { t } = useTranslation();

  const handlePricesChange = (prices: PricingFormData["prices"]) => {
    onChange({ ...data, prices });
  };

  const handleTaxAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...data, taxAmount: Number(e.target.value) });
  };

  const handleBarcodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...data, barcode: e.target.value });
  };

  const handleMinQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...data, minQuantity: Number(e.target.value) });
  };

  const handleMaxQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...data, maxQuantity: Number(e.target.value) });
  };

  return (
    <div>
      {/* Prices Section */}
      <Card className="mb-4">
        <CardBody>
          <h5 className="mb-4">{t("product.form.prices.title")}</h5>
          <PriceList
            prices={data.prices}
            onChange={handlePricesChange}
            errors={errors}
            touched={touched}
          />
        </CardBody>
      </Card>

      {/* Other Additional Info Fields */}
      <Card>
        <CardBody>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for="taxAmount">{t("product.form.taxAmount")} (%)</Label>
                <Input
                  id="taxAmount"
                  type="number"
                  min={0}
                  max={100}
                  value={data.taxAmount}
                  onChange={handleTaxAmountChange}
                  invalid={touched.taxAmount && Boolean(errors.taxAmount)}
                />
                {touched.taxAmount && errors.taxAmount && (
                  <div className="invalid-feedback">{errors.taxAmount}</div>
                )}
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="barcode">{t("product.form.barcode")}</Label>
                <Input
                  id="barcode"
                  type="text"
                  value={data.barcode || ""}
                  onChange={handleBarcodeChange}
                  invalid={touched.barcode && Boolean(errors.barcode)}
                />
                {touched.barcode && errors.barcode && (
                  <div className="invalid-feedback">{errors.barcode}</div>
                )}
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for="minQuantity">{t("product.form.minQuantity")}</Label>
                <Input
                  id="minQuantity"
                  type="number"
                  min={0}
                  value={data.minQuantity}
                  onChange={handleMinQuantityChange}
                  invalid={touched.minQuantity && Boolean(errors.minQuantity)}
                />
                {touched.minQuantity && errors.minQuantity && (
                  <div className="invalid-feedback">{errors.minQuantity}</div>
                )}
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="maxQuantity">{t("product.form.maxQuantity")}</Label>
                <Input
                  id="maxQuantity"
                  type="number"
                  min={0}
                  value={data.maxQuantity}
                  onChange={handleMaxQuantityChange}
                  invalid={touched.maxQuantity && Boolean(errors.maxQuantity)}
                />
                {touched.maxQuantity && errors.maxQuantity && (
                  <div className="invalid-feedback">{errors.maxQuantity}</div>
                )}
              </FormGroup>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </div>
  );
};

export default AdditionalInfoForm;

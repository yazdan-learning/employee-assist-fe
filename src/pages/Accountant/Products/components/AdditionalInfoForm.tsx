import React from "react";
import { Card, CardBody, Row, Col, FormGroup, Label, Input } from "reactstrap";
import { useTranslation } from "react-i18next";
import { FormikErrors, FormikTouched } from "formik";
import { Product } from "../types";
import PriceList from "./PriceList";
import { ProductPrice } from "../types";

export interface AdditionalInfo {
  prices: ProductPrice[];
  taxPercentage: number;
  barcode?: string;
}

interface AdditionalInfoFormProps {
  data: AdditionalInfo;
  onChange: (data: AdditionalInfo) => void;
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

  const handlePricesChange = (prices: ProductPrice[]) => {
    onChange({ ...data, prices });
  };

  const handleTaxPercentageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    onChange({ ...data, taxPercentage: Number(e.target.value) });
  };

  const handleBarcodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...data, barcode: e.target.value });
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
                <Label for="taxPercentage">
                  {t("product.form.fields.taxPercentage")} (%)
                </Label>
                <Input
                  id="taxPercentage"
                  type="number"
                  min={0}
                  max={100}
                  value={data.taxPercentage}
                  onChange={handleTaxPercentageChange}
                  invalid={
                    touched.taxPercentage && Boolean(errors.taxPercentage)
                  }
                />
                {touched.taxPercentage && errors.taxPercentage && (
                  <div className="invalid-feedback">{errors.taxPercentage}</div>
                )}
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="barcode">{t("product.form.fields.barcode")}</Label>
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
        </CardBody>
      </Card>
    </div>
  );
};

export default AdditionalInfoForm;

import React from "react";
import { Card, CardBody, Row, Col, FormGroup, Label, Input } from "reactstrap";
import { useTranslation } from "react-i18next";
import { PricingFormData } from "../types/forms";
import PriceForm from "./PriceForm";
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

  const handleInputChange = (field: keyof PricingFormData, value: any) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  const handlePricesChange = (prices: PricingFormData["prices"]) => {
    onChange({ ...data, prices });
  };

  return (
    <div>
      {/* Prices Section */}
      <Card className="mb-4">
        <CardBody>
          <h5 className="mb-4">{t("product.form.prices.title")}</h5>
          <PriceForm
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
                  onChange={(e) =>
                    handleInputChange("taxAmount", Number(e.target.value))
                  }
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
                  onChange={(e) => handleInputChange("barcode", e.target.value)}
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
                  onChange={(e) =>
                    handleInputChange("minQuantity", Number(e.target.value))
                  }
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
                  onChange={(e) =>
                    handleInputChange("maxQuantity", Number(e.target.value))
                  }
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

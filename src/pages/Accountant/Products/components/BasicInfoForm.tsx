import React from "react";
import { Row, Col, FormGroup, Label, Input } from "reactstrap";
import { useTranslation } from "react-i18next";
import RaDropdown from "../../../../Components/Common/RaDropdown";
import { useCategories } from "../../../../hooks/useProducts";
import { BasicInfoFormData } from "../types/forms";
import { ProductStatus } from "../types";
import { FormikErrors, FormikTouched } from "formik";
import { Product } from "../types";

interface BasicInfoFormProps {
  data: BasicInfoFormData;
  onChange: (data: BasicInfoFormData) => void;
  errors?: FormikErrors<Product>;
  touched?: FormikTouched<Product>;
}

const BasicInfoForm: React.FC<BasicInfoFormProps> = ({
  data,
  onChange,
  errors = {},
  touched = {},
}) => {
  const { t } = useTranslation();
  const { data: categories = [] } = useCategories();

  const handleInputChange = (field: keyof BasicInfoFormData, value: any) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  return (
    <div>
      <Row>
        <Col md={6}>
          <FormGroup>
            <Label for="categoryId">{t("product.form.category")}</Label>
            <RaDropdown
              options={categories.map((c) => ({
                value: c.id.toString(),
                label: c.name,
              }))}
              value={data.categoryId?.toString() || ""}
              onChange={(value) =>
                handleInputChange("categoryId", value ? Number(value) : null)
              }
              placeholder={t("product.form.placeholders.category")}
            />
            {touched.categoryId && errors.categoryId && (
              <div className="invalid-feedback d-block">
                {errors.categoryId}
              </div>
            )}
          </FormGroup>
        </Col>
        <Col md={6}>
          <FormGroup>
            <Label for="code">{t("product.form.code")}</Label>
            <Input
              id="code"
              type="text"
              value={data.code || ""}
              onChange={(e) => handleInputChange("code", e.target.value)}
              disabled={!data.categoryId}
              invalid={touched.code && Boolean(errors.code)}
            />
            {touched.code && errors.code && (
              <div className="invalid-feedback">{errors.code}</div>
            )}
          </FormGroup>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <FormGroup>
            <Label for="name">{t("product.form.name")}</Label>
            <Input
              id="name"
              type="text"
              value={data.name || ""}
              onChange={(e) => handleInputChange("name", e.target.value)}
              invalid={touched.name && Boolean(errors.name)}
            />
            {touched.name && errors.name && (
              <div className="invalid-feedback">{errors.name}</div>
            )}
          </FormGroup>
        </Col>
        <Col md={6}>
          <FormGroup>
            <Label for="status">{t("product.form.status")}</Label>
            <RaDropdown
              options={Object.values(ProductStatus).map((status) => ({
                value: status,
                label: t(`product.status.${status.toLowerCase()}`),
              }))}
              value={data.status}
              onChange={(value) => handleInputChange("status", value)}
              placeholder={t("product.form.placeholders.status")}
            />
            {touched.status && errors.status && (
              <div className="invalid-feedback d-block">{errors.status}</div>
            )}
          </FormGroup>
        </Col>
      </Row>

      <Row>
        <Col md={12}>
          <FormGroup>
            <Label for="description">{t("product.form.description")}</Label>
            <Input
              id="description"
              type="textarea"
              value={data.description || ""}
              onChange={(e) => handleInputChange("description", e.target.value)}
              invalid={touched.description && Boolean(errors.description)}
            />
            {touched.description && errors.description && (
              <div className="invalid-feedback">{errors.description}</div>
            )}
          </FormGroup>
        </Col>
      </Row>

      <Row>
        <Col md={4}>
          <FormGroup check>
            <Label check>
              <Input
                type="checkbox"
                checked={data.isService || false}
                onChange={(e) =>
                  handleInputChange("isService", e.target.checked)
                }
              />{" "}
              {t("product.form.isService")}
            </Label>
          </FormGroup>
        </Col>
        <Col md={4}>
          <FormGroup check>
            <Label check>
              <Input
                type="checkbox"
                checked={data.hasSerial || false}
                onChange={(e) =>
                  handleInputChange("hasSerial", e.target.checked)
                }
              />{" "}
              {t("product.form.hasSerial")}
            </Label>
          </FormGroup>
        </Col>
        <Col md={4}>
          <FormGroup check>
            <Label check>
              <Input
                type="checkbox"
                checked={data.allowNegativeStock || false}
                onChange={(e) =>
                  handleInputChange("allowNegativeStock", e.target.checked)
                }
              />{" "}
              {t("product.form.allowNegativeStock")}
            </Label>
          </FormGroup>
        </Col>
      </Row>
    </div>
  );
};

export default BasicInfoForm;

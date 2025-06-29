import React from "react";
import { Row, Col, FormGroup, Label, Input, Card, CardBody } from "reactstrap";
import { useTranslation } from "react-i18next";
import RaDropdown from "../../../../Components/Common/RaDropdown";
import { useCategories } from "../../../../hooks/useProducts";
import { ProductUnit } from "../types";
import { FormikErrors, FormikTouched } from "formik";
import { Product } from "../types";
import UnitList from "./UnitList";

export interface BasicInfoFormData {
  categoryId: number | null;
  code: string;
  name: string;
  description?: string;
  isActive: boolean;
  isService: boolean;
  hasSerial: boolean;
  allowNegativeStock: boolean;
  isPackaging: boolean;
  units: ProductUnit[];
}

interface BasicInfoFormProps {
  data: BasicInfoFormData;
  onChange: (data: BasicInfoFormData) => void;
  errors?: FormikErrors<Product>;
  touched?: FormikTouched<Product>;
  isEdit?: boolean;
}

const BasicInfoForm: React.FC<BasicInfoFormProps> = ({
  data,
  onChange,
  errors = {},
  touched = {},
  isEdit = false,
}) => {
  const { t } = useTranslation();
  const { data: categories = [] } = useCategories();

  const handleInputChange = (field: keyof BasicInfoFormData, value: any) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  const handleUnitsChange = (units: ProductUnit[]) => {
    onChange({
      ...data,
      units,
    });
  };

  // Handle category change
  const handleCategoryChange = (categoryId: string | null) => {
    const numericCategoryId = categoryId ? Number(categoryId) : null;
    const selectedCategory = categories.find((c) => c.id === numericCategoryId);

    // Get the current code without the prefix
    const currentCode = data.code || "";
    const existingCodeParts = currentCode.split("-");
    const codeWithoutPrefix =
      existingCodeParts.length > 1 ? existingCodeParts[1] : currentCode;

    // Set the new code with the category prefix
    const newCode = selectedCategory
      ? `${selectedCategory.code}-${codeWithoutPrefix}`
      : codeWithoutPrefix;

    onChange({
      ...data,
      categoryId: numericCategoryId,
      code: newCode,
    });
  };

  // Handle code change while preserving the prefix
  const handleCodeChange = (newCode: string) => {
    const selectedCategory = categories.find((c) => c.id === data.categoryId);
    if (selectedCategory) {
      // If there's a category, ensure the prefix remains
      const prefix = `${selectedCategory.code}-`;
      if (!newCode.startsWith(prefix)) {
        // If user deleted the prefix, add it back
        newCode = prefix + newCode;
      }
    }
    handleInputChange("code", newCode);
  };

  return (
    <div>
      <Row>
        <Col md={6}>
          <FormGroup>
            <Label for="categoryId">{t("product.form.fields.category")}</Label>
            <RaDropdown
              options={categories.map((c) => ({
                value: c.id.toString(),
                label: c.name,
              }))}
              value={data.categoryId?.toString() || ""}
              onChange={handleCategoryChange}
              placeholder={t("product.form.placeholders.category")}
            />
            {touched.categoryId && errors.categoryId && (
              <div className="invalid-feedback d-block">
                {t("product.form.validation.categoryRequired")}
              </div>
            )}
          </FormGroup>
        </Col>
        <Col md={6}>
          <FormGroup>
            <Label for="code">{t("product.form.fields.code")}</Label>
            <Input
              id="code"
              type="text"
              value={data.code || ""}
              onChange={(e) => handleCodeChange(e.target.value)}
              disabled={!data.categoryId}
              invalid={touched.code && Boolean(errors.code)}
              placeholder={t("product.form.placeholders.code")}
            />
            {touched.code && errors.code && (
              <div className="invalid-feedback">
                {t("product.form.validation.codeRequired")}
              </div>
            )}
          </FormGroup>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <FormGroup>
            <Label for="name">{t("product.form.fields.name")}</Label>
            <Input
              id="name"
              type="text"
              value={data.name || ""}
              onChange={(e) => handleInputChange("name", e.target.value)}
              invalid={touched.name && Boolean(errors.name)}
              placeholder={t("product.form.placeholders.name")}
            />
            {touched.name && errors.name && (
              <div className="invalid-feedback">
                {t("product.form.validation.nameRequired")}
              </div>
            )}
          </FormGroup>
        </Col>
      </Row>

      <Row>
        <Col md={12}>
          <FormGroup>
            <Label for="description">
              {t("product.form.fields.description")}
            </Label>
            <Input
              id="description"
              type="textarea"
              value={data.description || ""}
              onChange={(e) => handleInputChange("description", e.target.value)}
              invalid={touched.description && Boolean(errors.description)}
              placeholder={t("product.form.placeholders.description")}
            />
            {touched.description && errors.description && (
              <div className="invalid-feedback">{errors.description}</div>
            )}
          </FormGroup>
        </Col>
      </Row>

      <Row className="mt-2">
        <Col className="d-flex gap-4">
          <FormGroup check className="mb-0">
            <Label check className="d-flex align-items-center">
              <Input
                type="checkbox"
                checked={data.isService || false}
                onChange={(e) =>
                  handleInputChange("isService", e.target.checked)
                }
                className="me-2"
              />
              {t("product.form.fields.isService")}
            </Label>
          </FormGroup>

          <FormGroup check className="mb-0">
            <Label check className="d-flex align-items-center">
              <Input
                type="checkbox"
                checked={data.hasSerial || false}
                onChange={(e) =>
                  handleInputChange("hasSerial", e.target.checked)
                }
                className="me-2"
              />
              {t("product.form.fields.hasSerial")}
            </Label>
          </FormGroup>

          <FormGroup check className="mb-0">
            <Label check className="d-flex align-items-center">
              <Input
                type="checkbox"
                checked={data.allowNegativeStock || false}
                onChange={(e) =>
                  handleInputChange("allowNegativeStock", e.target.checked)
                }
                className="me-2"
              />
              {t("product.form.fields.allowNegativeStock")}
            </Label>
          </FormGroup>

          <FormGroup check className="mb-0">
            <Label check className="d-flex align-items-center">
              <Input
                type="checkbox"
                checked={data.isPackaging || false}
                onChange={(e) =>
                  handleInputChange("isPackaging", e.target.checked)
                }
                className="me-2"
              />
              {t("product.form.fields.isPackaging")}
            </Label>
          </FormGroup>

          {isEdit && (
            <FormGroup check className="mb-0">
              <Label check className="d-flex align-items-center">
                <Input
                  type="checkbox"
                  checked={data.isActive}
                  onChange={(e) =>
                    handleInputChange("isActive", e.target.checked)
                  }
                  className="me-2"
                />
                {t("product.form.fields.isActive")}
              </Label>
            </FormGroup>
          )}
        </Col>
      </Row>

      {/* Units Section */}
      <Card className="mt-4">
        <CardBody>
          <div className="d-flex align-items-center mb-4">
            <h5
              className={`mb-0 ${
                errors.units &&
                touched.units &&
                !data.units.some((unit) => unit.isPrimary)
                  ? "text-danger"
                  : ""
              }`}
            >
              {t("product.form.units.title")}
            </h5>
            {errors.units &&
              touched.units &&
              !data.units.some((unit) => unit.isPrimary) && (
                <small className="text-danger ms-2">
                  {t("product.form.units.validation.primaryRequired")}
                </small>
              )}
          </div>
          <UnitList
            units={data.units}
            onChange={handleUnitsChange}
            errors={errors}
            touched={touched}
          />
        </CardBody>
      </Card>
    </div>
  );
};

export default BasicInfoForm;

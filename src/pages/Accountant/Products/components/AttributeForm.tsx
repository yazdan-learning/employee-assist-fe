import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button, FormGroup, Label, Row, Col } from "reactstrap";
import { useTranslation } from "react-i18next";
import RaDropdown from "../../../../Components/Common/RaDropdown";
import { ProductAttribute, Attribute, AttributeValue } from "../types";
import { useAttributeValues } from "../../../../hooks/useProducts";
import { productService } from "../../../../services/ProductService";

interface AttributeFormProps {
  attribute?: ProductAttribute;
  onSave: (attribute: ProductAttribute) => void;
  onCancel: () => void;
}

const AttributeForm: React.FC<AttributeFormProps> = ({
  attribute,
  onSave,
  onCancel,
}) => {
  const { t } = useTranslation();
  const [attributes, setAttributes] = React.useState<Attribute[]>([]);

  React.useEffect(() => {
    const loadAttributes = async () => {
      const attrs = await productService.getAttributes();
      setAttributes(attrs);
    };
    loadAttributes();
  }, []);

  const validationSchema = Yup.object().shape({
    attributeId: Yup.number().required(t("validation.required")),
    valueId: Yup.number().required(t("validation.required")),
  });

  const formik = useFormik({
    initialValues: {
      attributeId: attribute?.attributeId || 0,
      valueId: attribute?.valueId || 0,
    },
    validationSchema,
    onSubmit: (values) => {
      console.log(values);
    },
  });

  // Load attribute values when attribute changes
  const { data: attributeValues = [] } = useAttributeValues(
    formik.values.attributeId || null
  );

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
            <Label for="attributeId">{t("product.form.attribute")}</Label>
            <RaDropdown
              options={attributes.map((a) => ({
                value: a.id.toString(),
                label: a.name,
              }))}
              value={formik.values.attributeId?.toString() || ""}
              onChange={(value) => {
                formik.setFieldValue("attributeId", value ? Number(value) : 0);
                formik.setFieldValue("valueId", 0);
              }}
              placeholder={t("product.form.placeholders.attribute")}
            />
            {formik.touched.attributeId && formik.errors.attributeId && (
              <div className="invalid-feedback d-block">
                {formik.errors.attributeId}
              </div>
            )}
          </FormGroup>
        </Col>
        <Col md={6}>
          <FormGroup>
            <Label for="valueId">{t("product.form.value")}</Label>
            <RaDropdown
              options={attributeValues.map((v) => ({
                value: v.id.toString(),
                label: v.value,
              }))}
              value={formik.values.valueId?.toString() || ""}
              onChange={(value) =>
                formik.setFieldValue("valueId", value ? Number(value) : 0)
              }
              placeholder={t("product.form.placeholders.value")}
              disabled={!formik.values.attributeId}
            />
            {formik.touched.valueId && formik.errors.valueId && (
              <div className="invalid-feedback d-block">
                {formik.errors.valueId}
              </div>
            )}
          </FormGroup>
        </Col>
      </Row>

      <div className="d-flex justify-content-end gap-2 mt-3">
        <Button type="button" color="secondary" onClick={onCancel}>
          {t("product.form.buttons.cancel")}
        </Button>
        <Button type="submit" color="primary" onClick={handleSubmit}>
          {t("product.form.buttons.save")}
        </Button>
      </div>
    </form>
  );
};

export default AttributeForm;

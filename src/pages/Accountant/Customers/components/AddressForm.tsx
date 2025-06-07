import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button, FormGroup, Label, Input, Row, Col } from "reactstrap";
import { useTranslation } from "react-i18next";
import { Address } from "../types";

interface AddressFormProps {
  address?: Address;
  onSave: (address: Address) => void;
  onCancel: () => void;
}

const AddressForm: React.FC<AddressFormProps> = ({
  address,
  onSave,
  onCancel,
}) => {
  const { t } = useTranslation();

  const validationSchema = Yup.object().shape({
    title: Yup.string(),
    value: Yup.string().required(t("validation.required")),
    postalCode: Yup.string().matches(
      /^\d{5,10}$/,
      t("validation.postalCodeFormat")
    ),
    isPrimary: Yup.boolean(),
  });

  const formik = useFormik({
    initialValues: {
      title: address?.title || "",
      value: address?.value || "",
      postalCode: address?.postalCode || "",
      isPrimary: address?.isPrimary || false,
    },
    validationSchema,
    onSubmit: (values) => {
      console.log(values);
    },
  });

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
      onSave({
        ...formik.values,
        id: address?.id,
      });
    }
  };

  return (
    <form>
      <Row>
        <Col md={6}>
          <FormGroup>
            <Label for="title">
              {t("customer.form.contactInfo.addresses.addressTitle")}
            </Label>
            <Input
              id="title"
              name="title"
              type="text"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              invalid={formik.touched.title && Boolean(formik.errors.title)}
              placeholder={t(
                "customer.form.contactInfo.placeholders.addressTitle"
              )}
            />
            {formik.touched.title && formik.errors.title && (
              <div className="invalid-feedback d-block">
                {formik.errors.title}
              </div>
            )}
          </FormGroup>
        </Col>
        <Col md={6}>
          <FormGroup>
            <Label for="postalCode">
              {t("customer.form.contactInfo.addresses.postalCode")}
            </Label>
            <Input
              id="postalCode"
              name="postalCode"
              type="text"
              value={formik.values.postalCode}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              invalid={
                formik.touched.postalCode && Boolean(formik.errors.postalCode)
              }
              placeholder={t(
                "customer.form.contactInfo.placeholders.postalCode"
              )}
            />
            {formik.touched.postalCode && formik.errors.postalCode && (
              <div className="invalid-feedback d-block">
                {formik.errors.postalCode}
              </div>
            )}
          </FormGroup>
        </Col>
      </Row>

      <Row>
        <Col md={12}>
          <FormGroup>
            <Label for="value">
              {t("customer.form.contactInfo.addresses.address")}
            </Label>
            <Input
              id="value"
              name="value"
              type="textarea"
              value={formik.values.value}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              invalid={formik.touched.value && Boolean(formik.errors.value)}
              placeholder={t("customer.form.contactInfo.placeholders.address")}
            />
            {formik.touched.value && formik.errors.value && (
              <div className="invalid-feedback d-block">
                {formik.errors.value}
              </div>
            )}
          </FormGroup>
        </Col>
      </Row>

      <Row>
        <Col md={12}>
          <FormGroup check>
            <Label check>
              <Input
                type="checkbox"
                name="isPrimary"
                checked={formik.values.isPrimary}
                onChange={formik.handleChange}
              />{" "}
              {t("customer.form.contactInfo.addresses.isPrimary")}
            </Label>
          </FormGroup>
        </Col>
      </Row>

      <div className="d-flex justify-content-end gap-2 mt-3">
        <Button type="button" color="secondary" onClick={onCancel}>
          {t("customer.form.buttons.cancel")}
        </Button>
        <Button type="submit" color="primary" onClick={handleSubmit}>
          {t("customer.form.buttons.save")}
        </Button>
      </div>
    </form>
  );
};

export default AddressForm;

import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button, FormGroup, Label, Row, Col, Input } from "reactstrap";
import { useTranslation } from "react-i18next";
import RaDropdown from "../../../../Components/Common/RaDropdown";
import {
  useWarehouses,
  useWarehouseAddresses,
} from "../../../../hooks/useProducts";
import { FormikErrors, FormikTouched } from "formik";
import { Product } from "../types";

interface Location {
  warehouseId: number;
  addressId?: number;
  minQuantity?: number;
  maxQuantity?: number;
}

interface LocationFormProps {
  location?: Location;
  onSave: (location: Location) => void;
  onCancel: () => void;
  errors?: FormikErrors<Product>;
  touched?: FormikTouched<Product>;
}

const LocationForm: React.FC<LocationFormProps> = ({
  location,
  onSave,
  onCancel,
  errors = {},
  touched = {},
}) => {
  const { t } = useTranslation();
  const { data: warehouses = [] } = useWarehouses();

  const validationSchema = Yup.object().shape({
    warehouseId: Yup.number()
      .required(t("product.form.locations.validation.warehouseRequired"))
      .min(1, t("product.form.locations.validation.warehouseRequired")),
    minQuantity: Yup.number()
      .min(0, t("validation.min", { min: 0 }))
      .nullable()
      .test('min', t("product.form.locations.validation.minQuantityLessThanMax"), function(value) {
        const maxQuantity = this.parent.maxQuantity;
        if (value && maxQuantity) {
          return value < maxQuantity;
        }
        return true;
      }),
    maxQuantity: Yup.number()
      .min(0, t("validation.min", { min: 0 }))
      .nullable()
      .test('max', t("product.form.locations.validation.maxQuantityGreaterThanMin"), function(value) {
        const minQuantity = this.parent.minQuantity;
        if (minQuantity && value) {
          return value > minQuantity;
        }
        return true;
      }),
  });

  const formik = useFormik<Location>({
    initialValues: location || {
      warehouseId: 0,
      addressId: undefined,
      minQuantity: undefined,
      maxQuantity: undefined,
    },
    validationSchema,
    onSubmit: onSave,
  });

  const { data: addresses = [] } = useWarehouseAddresses(
    formik.values.warehouseId || null
  );

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

  const handleWarehouseChange = (value: string | null) => {
    const numericValue = value ? Number(value) : null;
    formik.setFieldValue("warehouseId", numericValue);
    formik.setFieldValue("addressId", null); // Reset address when warehouse changes
  };

  const handleAddressChange = (value: string | null) => {
    const numericValue = value ? Number(value) : null;
    formik.setFieldValue("addressId", numericValue);
  };

  return (
    <form>
      <Row className="mb-3">
        <Col md={6}>
          <FormGroup>
            <Label for="warehouseId">{t("product.form.locations.warehouse")}</Label>
            <RaDropdown
              options={warehouses.map((w) => ({
                value: w.id.toString(),
                label: w.name,
              }))}
              value={formik.values.warehouseId?.toString() || ""}
              onChange={(value) =>
                formik.setFieldValue("warehouseId", value ? Number(value) : 0)
              }
              placeholder={t("product.form.locations.placeholders.warehouse")}
            />
            {formik.touched.warehouseId && formik.errors.warehouseId && (
              <div className="invalid-feedback d-block">
                {formik.errors.warehouseId}
              </div>
            )}
          </FormGroup>
        </Col>
        <Col md={6}>
          <FormGroup>
            <Label for="addressId">{t("product.form.locations.address")}</Label>
            <RaDropdown
              options={addresses.map((a) => ({
                value: a.id.toString(),
                label: a.address,
              }))}
              value={formik.values.addressId?.toString() || ""}
              onChange={(value) =>
                formik.setFieldValue("addressId", value ? Number(value) : undefined)
              }
              placeholder={t("product.form.locations.placeholders.address")}
            />
            {formik.touched.addressId && formik.errors.addressId && (
              <div className="invalid-feedback d-block">
                {formik.errors.addressId}
              </div>
            )}
          </FormGroup>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <FormGroup>
            <Label for="minQuantity">{t("product.form.locations.minQuantity")}</Label>
            <Input
              id="minQuantity"
              type="number"
              min={0}
              value={formik.values.minQuantity || ""}
              onChange={(e) => formik.setFieldValue("minQuantity", e.target.value ? Number(e.target.value) : undefined)}
              placeholder={t("product.form.locations.placeholders.minQuantity")}
              invalid={formik.touched.minQuantity && Boolean(formik.errors.minQuantity)}
            />
            {formik.touched.minQuantity && formik.errors.minQuantity && (
              <div className="invalid-feedback">{formik.errors.minQuantity}</div>
            )}
          </FormGroup>
        </Col>
        <Col md={6}>
          <FormGroup>
            <Label for="maxQuantity">{t("product.form.locations.maxQuantity")}</Label>
            <Input
              id="maxQuantity"
              type="number"
              min={formik.values.minQuantity || 0}
              value={formik.values.maxQuantity || ""}
              onChange={(e) => formik.setFieldValue("maxQuantity", e.target.value ? Number(e.target.value) : undefined)}
              placeholder={t("product.form.locations.placeholders.maxQuantity")}
              invalid={formik.touched.maxQuantity && Boolean(formik.errors.maxQuantity)}
            />
            {formik.touched.maxQuantity && formik.errors.maxQuantity && (
              <div className="invalid-feedback">{formik.errors.maxQuantity}</div>
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

export default LocationForm;

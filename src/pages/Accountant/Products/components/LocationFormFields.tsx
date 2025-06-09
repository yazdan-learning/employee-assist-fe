import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button, FormGroup, Label, Row, Col } from "reactstrap";
import { useTranslation } from "react-i18next";
import RaDropdown from "../../../../Components/Common/RaDropdown";
import {
  useWarehouses,
  useWarehouseAddresses,
} from "../../../../hooks/useProducts";

interface Location {
  warehouseId: number;
  addressId: number;
}

interface LocationFormFieldsProps {
  location?: Location;
  onSave: (location: Location) => void;
  onCancel: () => void;
}

const LocationFormFields: React.FC<LocationFormFieldsProps> = ({
  location,
  onSave,
  onCancel,
}) => {
  const { t } = useTranslation();
  const { data: warehouses = [] } = useWarehouses();

  const validationSchema = Yup.object().shape({
    warehouseId: Yup.number().required(t("validation.required")),
    addressId: Yup.number().required(t("validation.required")),
  });

  const formik = useFormik({
    initialValues: location || {
      warehouseId: 0,
      addressId: 0,
    },
    validationSchema,
    onSubmit: (values) => {
      onSave(values);
    },
  });

  const { data: addresses = [] } = useWarehouseAddresses(
    formik.values.warehouseId || null
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
            <Label for="warehouseId">
              {t("product.form.locations.warehouse")}
            </Label>
            <RaDropdown
              options={warehouses.map((w) => ({
                value: w.id.toString(),
                label: w.name,
              }))}
              value={formik.values.warehouseId?.toString() || ""}
              onChange={(value) => {
                formik.setFieldValue("warehouseId", value ? Number(value) : 0);
                formik.setFieldValue("addressId", 0); // Reset address when warehouse changes
              }}
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
                formik.setFieldValue("addressId", value ? Number(value) : 0)
              }
              placeholder={t("product.form.locations.placeholders.address")}
              disabled={!formik.values.warehouseId}
            />
            {formik.touched.addressId && formik.errors.addressId && (
              <div className="invalid-feedback d-block">
                {formik.errors.addressId}
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

export default LocationFormFields;

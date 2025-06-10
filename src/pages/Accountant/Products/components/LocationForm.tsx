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
import { FormikErrors, FormikTouched } from "formik";
import { Product } from "../types";

interface Location {
  warehouseId: number;
  addressId: number;
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
      console.log(values);
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
              onChange={handleWarehouseChange}
              placeholder={t("product.form.locations.placeholders.warehouse")}
              showClear={true}
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
              onChange={handleAddressChange}
              placeholder={t("product.form.locations.placeholders.address")}
              disabled={!formik.values.warehouseId}
              showClear={true}
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

export default LocationForm;

import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button, FormGroup, Label, Row, Col, Input } from "reactstrap";
import { useTranslation } from "react-i18next";
import RaDropdown from "../../../../Components/Common/RaDropdown";
import { ProductUnit, Unit } from "../types";
import { productService } from "../../../../services/ProductService";

interface UnitFormProps {
  unit?: ProductUnit;
  onSave: (unit: ProductUnit) => void;
  onCancel: () => void;
  existingUnits: ProductUnit[];
}

const UnitForm: React.FC<UnitFormProps> = ({
  unit,
  onSave,
  onCancel,
  existingUnits,
}) => {
  const { t } = useTranslation();
  const [units, setUnits] = React.useState<Unit[]>([]);

  React.useEffect(() => {
    const loadUnits = async () => {
      const unitList = await productService.getUnits();
      setUnits(unitList);
    };
    loadUnits();
  }, []);

  const validationSchema = Yup.object().shape({
    unitId: Yup.number()
      .required(t("product.form.units.validation.unitRequired"))
      .min(1, t("product.form.units.validation.unitRequired")),
    isPrimary: Yup.boolean(),
    conversionRate: Yup.number()
      .required(t("product.form.units.validation.conversionRateRequired"))
      .min(0.0001, t("product.form.units.validation.conversionRateMin")),
    weightPerUnit: Yup.number()
      .required(t("product.form.units.validation.weightPerUnitMin"))
      .min(0, t("product.form.units.validation.weightPerUnitMin")),
  });

  const formik = useFormik({
    initialValues: unit || {
      unitId: 0,
      isPrimary: existingUnits.length === 0, // First unit is automatically primary
      conversionRate: 1,
      weightPerUnit: 0,
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
      const values = formik.values;

      // If this is the first unit, force it to be primary
      if (existingUnits.length === 0) {
        values.isPrimary = true;
      }

      onSave({
        ...values,
        id: unit?.id,
      });
    }
  };

  // Check if there's already a primary unit (excluding the current unit being edited)
  const hasPrimaryUnit = existingUnits.some(
    (u) => u.isPrimary && u.id !== unit?.id
  );

  return (
    <form>
      <Row>
        <Col md={6}>
          <FormGroup>
            <Label for="unitId">{t("product.form.units.unit")}</Label>
            <RaDropdown
              options={units.map((u) => ({
                value: u.id.toString(),
                label: u.name,
              }))}
              value={formik.values.unitId?.toString() || ""}
              onChange={(value) =>
                formik.setFieldValue("unitId", value ? Number(value) : 0)
              }
              placeholder={t("product.form.units.placeholders.unit")}
            />
            {formik.touched.unitId && formik.errors.unitId && (
              <div className="invalid-feedback d-block">
                {formik.errors.unitId}
              </div>
            )}
          </FormGroup>
        </Col>
        <Col md={6}>
          <FormGroup>
            <Label for="conversionRate">
              {t("product.form.units.conversionRate")}
            </Label>
            <Input
              type="number"
              step="0.0001"
              id="conversionRate"
              {...formik.getFieldProps("conversionRate")}
              invalid={
                formik.touched.conversionRate &&
                Boolean(formik.errors.conversionRate)
              }
            />
            {formik.touched.conversionRate && formik.errors.conversionRate && (
              <div className="invalid-feedback">
                {formik.errors.conversionRate}
              </div>
            )}
          </FormGroup>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <FormGroup>
            <Label for="weightPerUnit">
              {t("product.form.units.weightPerUnit")}
            </Label>
            <Input
              type="number"
              step="0.01"
              id="weightPerUnit"
              {...formik.getFieldProps("weightPerUnit")}
              invalid={
                formik.touched.weightPerUnit &&
                Boolean(formik.errors.weightPerUnit)
              }
            />
            {formik.touched.weightPerUnit && formik.errors.weightPerUnit && (
              <div className="invalid-feedback">
                {formik.errors.weightPerUnit}
              </div>
            )}
          </FormGroup>
        </Col>
        <Col md={6}>
          <FormGroup className="mt-4">
            <div className="form-check">
              <Input
                type="checkbox"
                className="form-check-input"
                id="isPrimary"
                {...formik.getFieldProps("isPrimary")}
                checked={formik.values.isPrimary}
                disabled={existingUnits.length === 0 || formik.values.isPrimary} // Disable if it's the first unit or already primary
                onChange={(e) => {
                  if (e.target.checked && !hasPrimaryUnit) {
                    formik.setFieldValue("isPrimary", true);
                  } else if (!e.target.checked && !hasPrimaryUnit) {
                    // Don't allow unchecking if there's no other primary unit
                    e.preventDefault();
                  } else {
                    formik.setFieldValue("isPrimary", e.target.checked);
                  }
                }}
              />
              <Label className="form-check-label" for="isPrimary">
                {t("product.form.units.isPrimary")}
              </Label>
            </div>
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

export default UnitForm;

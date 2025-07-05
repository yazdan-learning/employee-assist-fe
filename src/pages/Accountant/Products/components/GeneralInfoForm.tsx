import React from "react";
import { Card, CardBody } from "reactstrap";
import { useTranslation } from "react-i18next";
import LocationList from "./LocationList";
import AttributeList from "./AttributeList";
import { FormikErrors, FormikTouched } from "formik";
import { Product, Location, ProductAttribute } from "../types";

export interface GeneralInfoFormData {
  locations: Location[];
  attributes: ProductAttribute[];
}

interface GeneralInfoFormProps {
  data: GeneralInfoFormData;
  onChange: (data: GeneralInfoFormData) => void;
  errors?: FormikErrors<Product>;
  touched?: FormikTouched<Product>;
}

const GeneralInfoForm: React.FC<GeneralInfoFormProps> = ({
  data,
  onChange,
  errors = {},
  touched = {},
}) => {
  const { t } = useTranslation();

  const handleLocationsChange = (
    locations: GeneralInfoFormData["locations"]
  ) => {
    onChange({ ...data, locations });
  };

  const handleAttributesChange = (
    attributes: GeneralInfoFormData["attributes"]
  ) => {
    onChange({ ...data, attributes });
  };

  return (
    <div>
      {/* Locations Section */}
      <Card className="mb-4">
        <CardBody>
          <div className="d-flex align-items-center mb-4">
            <h5
              className={`mb-0 ${
                errors.locations &&
                touched.locations &&
                data.locations.length === 0
                  ? "text-danger"
                  : ""
              }`}
            >
              {t("product.form.locations.title")}
            </h5>
            {errors.locations &&
              touched.locations &&
              data.locations.length === 0 && (
                <small className="text-danger ms-2">
                  {t("product.form.locations.validation.minRequired")}
                </small>
              )}
          </div>
          <LocationList
            locations={data.locations}
            onChange={handleLocationsChange}
            errors={errors}
            touched={touched}
          />
        </CardBody>
      </Card>

      {/* Attributes Section */}
      <Card className="mb-4">
        <CardBody>
          <h5 className="mb-4">{t("product.form.attributes.title")}</h5>
          <AttributeList
            attributes={data.attributes}
            onChange={handleAttributesChange}
            errors={errors}
            touched={touched}
          />
        </CardBody>
      </Card>
    </div>
  );
};

export default GeneralInfoForm;

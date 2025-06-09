import React from "react";
import { Card, CardBody } from "reactstrap";
import { useTranslation } from "react-i18next";
import { GeneralInfoFormData } from "../types/forms";
import LocationForm from "./LocationForm";
import UnitList from "./UnitList";
import AttributeList from "./AttributeList";
import { FormikErrors, FormikTouched } from "formik";
import { Product } from "../types";

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

  const handleUnitsChange = (units: GeneralInfoFormData["units"]) => {
    onChange({ ...data, units });
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
          <h5 className="mb-4">{t("product.form.locations.title")}</h5>
          <LocationForm
            locations={data.locations}
            onChange={handleLocationsChange}
            errors={errors}
            touched={touched}
          />
        </CardBody>
      </Card>

      {/* Units Section */}
      <Card className="mb-4">
        <CardBody>
          <h5 className="mb-4">{t("product.form.units.title")}</h5>
          <UnitList
            units={data.units}
            onChange={handleUnitsChange}
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

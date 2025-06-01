import React from "react";
import { Row, Col, FormGroup, Label, Input } from "reactstrap";
import { useTranslation } from "react-i18next";
import { Address } from "../types";
import AddressList from "./AddressList";

export interface ContactInfoFormData {
  phone: string[];
  fax?: string | null;
  email: string | null;
  website?: string | null;
  licensePlate?: string | null;
  addresses: Address[];
}

export interface ContactInfoFormProps {
  data: ContactInfoFormData;
  onChange: (data: ContactInfoFormData) => void;
  errors?: Record<string, string>;
  touched?: Record<string, boolean>;
}

const ContactInfoForm: React.FC<ContactInfoFormProps> = ({
  data,
  onChange,
  errors = {},
  touched = {},
}) => {
  const { t } = useTranslation();

  const handleInputChange = (field: keyof ContactInfoFormData, value: any) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  const handleAddressesChange = (addresses: Address[]) => {
    handleInputChange("addresses", addresses);
  };

  return (
    <div>
      <h5>{t("customer.form.contactInfo.title")}</h5>
      <Row>
        <Col md={6}>
          <FormGroup>
            <Label>{t("customer.form.contactInfo.email")}</Label>
            <Input
              type="email"
              id="email"
              value={data.email || ""}
              onChange={(e) =>
                handleInputChange("email", e.target.value || null)
              }
              invalid={touched.email && Boolean(errors.email)}
              placeholder={t("customer.form.contactInfo.placeholders.email")}
            />
            {touched.email && errors.email && (
              <div className="invalid-feedback d-block">{errors.email}</div>
            )}
          </FormGroup>
        </Col>
        <Col md={6}>
          <FormGroup>
            <Label>{t("customer.form.contactInfo.website")}</Label>
            <Input
              type="text"
              id="website"
              value={data.website || ""}
              onChange={(e) =>
                handleInputChange("website", e.target.value || null)
              }
              invalid={touched.website && Boolean(errors.website)}
              placeholder={t("customer.form.contactInfo.placeholders.website")}
            />
            {touched.website && errors.website && (
              <div className="invalid-feedback d-block">{errors.website}</div>
            )}
          </FormGroup>
        </Col>
        <Col md={6}>
          <FormGroup>
            <Label>{t("customer.form.contactInfo.fax")}</Label>
            <Input
              type="text"
              id="fax"
              value={data.fax || ""}
              onChange={(e) => handleInputChange("fax", e.target.value || null)}
              invalid={touched.fax && Boolean(errors.fax)}
              placeholder={t("customer.form.contactInfo.placeholders.fax")}
            />
            {touched.fax && errors.fax && (
              <div className="invalid-feedback d-block">{errors.fax}</div>
            )}
          </FormGroup>
        </Col>
        <Col md={6}>
          <FormGroup>
            <Label>{t("customer.form.contactInfo.licensePlate")}</Label>
            <Input
              type="text"
              id="licensePlate"
              value={data.licensePlate || ""}
              onChange={(e) =>
                handleInputChange("licensePlate", e.target.value || null)
              }
              invalid={touched.licensePlate && Boolean(errors.licensePlate)}
              placeholder={t(
                "customer.form.contactInfo.placeholders.licensePlate"
              )}
            />
            {touched.licensePlate && errors.licensePlate && (
              <div className="invalid-feedback d-block">
                {errors.licensePlate}
              </div>
            )}
          </FormGroup>
        </Col>
      </Row>

      {/* Phone Numbers */}
      <div className="mt-4">
        <h6>{t("customer.form.contactInfo.phones.title")}</h6>
        {/* Add phone number list component here */}
      </div>

      {/* Addresses */}
      <div className="mt-4">
        <AddressList
          addresses={data.addresses}
          onChange={handleAddressesChange}
        />
      </div>
    </div>
  );
};

export default ContactInfoForm;

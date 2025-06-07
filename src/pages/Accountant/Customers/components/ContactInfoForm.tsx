import React from "react";
import { Row, Col, FormGroup, Label, Input, Button } from "reactstrap";
import { useTranslation } from "react-i18next";
import { Address } from "../types";
import AddressList from "./AddressList";
import { FormikErrors, FormikTouched } from "formik";
import { Customer } from "../types";

export interface ContactInfoFormData {
  phones: string[];
  fax?: string | null;
  email: string | null;
  website?: string | null;
  licensePlate?: string | null;
  addresses: Address[];
}

export interface ContactInfoFormProps {
  data: ContactInfoFormData;
  onChange: (data: ContactInfoFormData) => void;
  errors?: FormikErrors<Customer>;
  touched?: FormikTouched<Customer>;
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

  const handlePhoneChange = (index: number, value: string) => {
    const newPhones = [...(data.phones || [])];
    newPhones[index] = value;
    handleInputChange("phones", newPhones);
  };

  const handleAddPhone = () => {
    handleInputChange("phones", [...(data.phones || []), ""]);
  };

  const handleRemovePhone = (index: number) => {
    const newPhones = (data.phones || []).filter((_, i) => i !== index);
    handleInputChange("phones", newPhones);
  };

  return (
    <div>
      <h5>{t("customer.form.contactInfo.title")}</h5>

      {/* Addresses */}
      <div className="mb-4">
        <AddressList
          addresses={data.addresses}
          onChange={handleAddressesChange}
        />
      </div>

      {/* Phone Numbers */}
      <div className="mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6>{t("customer.form.contactInfo.phones.title")}</h6>
          <Button color="primary" size="sm" onClick={handleAddPhone}>
            {t("customer.form.contactInfo.phones.add")}
          </Button>
        </div>
        {data.phones.map((phone, index) => (
          <Row key={index} className="mb-2">
            <Col md={11}>
              <FormGroup>
                <Input
                  type="text"
                  value={phone}
                  onChange={(e) => handlePhoneChange(index, e.target.value)}
                  placeholder={t(
                    "customer.form.contactInfo.placeholders.phone"
                  )}
                />
              </FormGroup>
            </Col>
            <Col md={1} className="d-flex align-items-center">
              <Button
                color="link"
                className="p-0 text-danger"
                onClick={() => handleRemovePhone(index)}
              >
                <i className="fas fa-times"></i>
              </Button>
            </Col>
          </Row>
        ))}
      </div>

      <Row>
        <Col md={6}>
          <FormGroup>
            <Label>{t("customer.form.contactInfo.email.label")}</Label>
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
            <Label>{t("customer.form.contactInfo.website.label")}</Label>
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
            <Label>{t("customer.form.contactInfo.fax.label")}</Label>
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
            <Label>{t("customer.form.contactInfo.licensePlate.label")}</Label>
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
    </div>
  );
};

export default ContactInfoForm;

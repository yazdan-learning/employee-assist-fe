import React from "react";
import { Row, Col, FormGroup, Label, Input } from "reactstrap";
import { useTranslation } from "react-i18next";
import { Address } from "../types";
import AddressList from "./AddressList";

export interface ContactInfoFormData {
  phone: string[];
  fax?: string;
  email: string;
  website?: string;
  licensePlate?: string;
  addresses: Address[];
}

export interface ContactInfoFormProps {
  data: ContactInfoFormData;
  onChange: (data: ContactInfoFormData) => void;
}

const ContactInfoForm: React.FC<ContactInfoFormProps> = ({
  data,
  onChange,
}) => {
  const { t } = useTranslation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onChange({
      ...data,
      [name]: value,
    });
  };

  const handleAddressesChange = (addresses: Address[]) => {
    onChange({
      ...data,
      addresses,
    });
  };

  const handlePhoneChange = (phone: string[]) => {
    onChange({
      ...data,
      phone,
    });
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
              name="email"
              value={data.email}
              onChange={handleChange}
              placeholder={t("customer.form.contactInfo.placeholders.email")}
            />
          </FormGroup>
        </Col>
        <Col md={6}>
          <FormGroup>
            <Label>{t("customer.form.contactInfo.website")}</Label>
            <Input
              type="text"
              name="website"
              value={data.website || ""}
              onChange={handleChange}
              placeholder={t("customer.form.contactInfo.placeholders.website")}
            />
          </FormGroup>
        </Col>
        <Col md={6}>
          <FormGroup>
            <Label>{t("customer.form.contactInfo.fax")}</Label>
            <Input
              type="text"
              name="fax"
              value={data.fax || ""}
              onChange={handleChange}
              placeholder={t("customer.form.contactInfo.placeholders.fax")}
            />
          </FormGroup>
        </Col>
        <Col md={6}>
          <FormGroup>
            <Label>{t("customer.form.contactInfo.licensePlate")}</Label>
            <Input
              type="text"
              name="licensePlate"
              value={data.licensePlate || ""}
              onChange={handleChange}
              placeholder={t(
                "customer.form.contactInfo.placeholders.licensePlate"
              )}
            />
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

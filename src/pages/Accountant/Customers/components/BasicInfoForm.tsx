import React from "react";
import { Row, Col, Card, CardBody, FormGroup, Label, Input } from "reactstrap";
import { useTranslation } from "react-i18next";
import { CustomerType, Gender, MaritalStatus } from "../types";
import RaDropdown, {
  DropdownOption,
} from "../../../../Components/Common/RaDropdown";

interface BasicInfoFormData {
  isCompany: boolean;
  title: string;
  firstName: string;
  lastName: string;
  nationalId: string;
  taxId: string;
  gender: Gender;
  nickname?: string;
  maritalStatus: MaritalStatus;
  tradeChamberNumber?: string;
  registrationNumber?: string;
  customerType: CustomerType;
  customerRiskLimit: number;
}

interface BasicInfoFormProps {
  data: BasicInfoFormData;
  onChange: (data: BasicInfoFormData) => void;
}

const BasicInfoForm: React.FC<BasicInfoFormProps> = ({ data, onChange }) => {
  const { t } = useTranslation();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    onChange({
      ...data,
      [name]: type === "number" ? Number(value) : value,
    });
  };

  const handleDropdownChange = (field: string) => (value: any) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  const customerTypeOptions: DropdownOption[] = Object.values(CustomerType).map(
    (type) => ({
      value: type.toString(),
      label: t(`customer.form.basicInfo.customerTypes.${type}`),
    })
  );

  const genderOptions: DropdownOption[] = Object.values(Gender).map(
    (gender) => ({
      value: gender.toString(),
      label: t(`customer.form.basicInfo.gender.${gender}`),
    })
  );

  const maritalStatusOptions: DropdownOption[] = Object.values(
    MaritalStatus
  ).map((status) => ({
    value: status.toString(),
    label: t(`customer.form.basicInfo.maritalStatus.${status}`),
  }));

  return (
    <Card>
      <CardBody>
        <h4 className="card-title mb-4">{t("customer.form.steps.basic")}</h4>

        <Row className="mb-3">
          <Col md={12}>
            <FormGroup check>
              <Input
                type="checkbox"
                id="isCompany"
                name="isCompany"
                checked={data.isCompany}
                onChange={handleChange}
              />
              <Label check for="isCompany">
                {t("customer.form.basicInfo.isCompany")}
              </Label>
            </FormGroup>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={12}>
            <FormGroup>
              <Label for="title">{t("customer.form.basicInfo.title")}</Label>
              <Input
                type="text"
                id="title"
                name="title"
                value={data.title}
                onChange={handleChange}
                placeholder={t("customer.form.basicInfo.placeholders.title")}
              />
            </FormGroup>
          </Col>
        </Row>

        {data.isCompany ? (
          // Company specific fields
          <>
            <Row className="mb-3">
              <Col md={6}>
                <FormGroup>
                  <Label for="tradeChamberNumber">
                    {t("customer.form.basicInfo.tradeChamberNumber")}
                  </Label>
                  <Input
                    type="text"
                    id="tradeChamberNumber"
                    name="tradeChamberNumber"
                    value={data.tradeChamberNumber || ""}
                    onChange={handleChange}
                    placeholder={t(
                      "customer.form.basicInfo.placeholders.tradeChamberNumber"
                    )}
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="registrationNumber">
                    {t("customer.form.basicInfo.registrationNumber")}
                  </Label>
                  <Input
                    type="text"
                    id="registrationNumber"
                    name="registrationNumber"
                    value={data.registrationNumber || ""}
                    onChange={handleChange}
                    placeholder={t(
                      "customer.form.basicInfo.placeholders.registrationNumber"
                    )}
                  />
                </FormGroup>
              </Col>
            </Row>
          </>
        ) : (
          // Individual specific fields
          <>
            <Row className="mb-3">
              <Col md={6}>
                <FormGroup>
                  <Label for="firstName">
                    {t("customer.form.basicInfo.firstName")}
                  </Label>
                  <Input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={data.firstName}
                    onChange={handleChange}
                    placeholder={t(
                      "customer.form.basicInfo.placeholders.firstName"
                    )}
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="lastName">
                    {t("customer.form.basicInfo.lastName")}
                  </Label>
                  <Input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={data.lastName}
                    onChange={handleChange}
                    placeholder={t(
                      "customer.form.basicInfo.placeholders.lastName"
                    )}
                  />
                </FormGroup>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <FormGroup>
                  <Label for="gender">
                    {t("customer.form.basicInfo.gender.label")}
                  </Label>
                  <RaDropdown
                    options={genderOptions}
                    value={data.gender.toString()}
                    onChange={(value) =>
                      handleDropdownChange("gender")(Number(value))
                    }
                    placeholder={t(
                      "customer.form.basicInfo.gender.placeholder"
                    )}
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="maritalStatus">
                    {t("customer.form.basicInfo.maritalStatus.label")}
                  </Label>
                  <RaDropdown
                    options={maritalStatusOptions}
                    value={data.maritalStatus.toString()}
                    onChange={(value) =>
                      handleDropdownChange("maritalStatus")(Number(value))
                    }
                    placeholder={t(
                      "customer.form.basicInfo.maritalStatus.placeholder"
                    )}
                  />
                </FormGroup>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={12}>
                <FormGroup>
                  <Label for="nickname">
                    {t("customer.form.basicInfo.nickname")}
                  </Label>
                  <Input
                    type="text"
                    id="nickname"
                    name="nickname"
                    value={data.nickname || ""}
                    onChange={handleChange}
                    placeholder={t(
                      "customer.form.basicInfo.placeholders.nickname"
                    )}
                  />
                </FormGroup>
              </Col>
            </Row>
          </>
        )}

        <Row className="mb-3">
          <Col md={6}>
            <FormGroup>
              <Label for="nationalId">
                {data.isCompany
                  ? t("customer.form.basicInfo.companyId")
                  : t("customer.form.basicInfo.nationalId")}
              </Label>
              <Input
                type="text"
                id="nationalId"
                name="nationalId"
                value={data.nationalId}
                onChange={handleChange}
                placeholder={
                  data.isCompany
                    ? t("customer.form.basicInfo.placeholders.companyId")
                    : t("customer.form.basicInfo.placeholders.nationalId")
                }
              />
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup>
              <Label for="taxId">{t("customer.form.basicInfo.taxId")}</Label>
              <Input
                type="text"
                id="taxId"
                name="taxId"
                value={data.taxId}
                onChange={handleChange}
                placeholder={t("customer.form.basicInfo.placeholders.taxId")}
              />
            </FormGroup>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={6}>
            <FormGroup>
              <Label for="customerType">
                {t("customer.form.basicInfo.customerType")}
              </Label>
              <RaDropdown
                options={customerTypeOptions}
                value={data.customerType.toString()}
                onChange={(value) =>
                  handleDropdownChange("customerType")(Number(value))
                }
                placeholder={t(
                  "customer.form.basicInfo.customerTypes.placeholder"
                )}
              />
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup>
              <Label for="customerRiskLimit">
                {t("customer.form.basicInfo.customerRiskLimit")}
              </Label>
              <Input
                type="number"
                id="customerRiskLimit"
                name="customerRiskLimit"
                value={data.customerRiskLimit}
                onChange={handleChange}
                placeholder={t(
                  "customer.form.basicInfo.placeholders.customerRiskLimit"
                )}
              />
            </FormGroup>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

export default BasicInfoForm;

import React from "react";
import { Row, Col, Card, CardBody, FormGroup, Label, Input } from "reactstrap";
import { useTranslation } from "react-i18next";
import { CustomerType, Gender, MaritalStatus } from "../types";
import RaDropdown, {
  DropdownOption,
} from "../../../../Components/Common/RaDropdown";
import { FormikErrors, FormikTouched } from "formik";
import { Customer } from "../types";

interface BasicInfoFormData {
  isCompany: boolean;
  title: string | null;
  firstName: string | null;
  lastName: string | null;
  nationalId: string | null;
  taxId: string | null;
  gender: Gender | null;
  nickname?: string | null;
  maritalStatus: MaritalStatus | null;
  tradeChamberNumber?: string | null;
  registrationNumber?: string | null;
  customerType: CustomerType | null;
  customerRiskLimit: number | null;
}

interface BasicInfoFormProps {
  data: BasicInfoFormData;
  onChange: (data: BasicInfoFormData) => void;
  errors?: FormikErrors<Customer>;
  touched?: FormikTouched<Customer>;
}

const BasicInfoForm: React.FC<BasicInfoFormProps> = ({
  data,
  onChange,
  errors = {},
  touched = {},
}) => {
  const { t } = useTranslation();

  console.log(errors);

  const getEnumKeys = (enumObj: any) => {
    return Object.keys(enumObj).filter((key) => isNaN(Number(key)));
  };

  const handleInputChange = (field: keyof BasicInfoFormData, value: any) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  const customerTypeOptions: DropdownOption[] = [
    {
      value: "",
      label: t("customer.form.basicInfo.customerTypes.placeholder"),
    },
    ...getEnumKeys(CustomerType).map((type) => ({
      value: CustomerType[type].toString(),
      label: t(`customer.form.basicInfo.customerTypes.${type}`),
    })),
  ];

  const genderOptions: DropdownOption[] = [
    { value: "", label: t("customer.form.basicInfo.gender.placeholder") },
    ...getEnumKeys(Gender).map((gender) => ({
      value: Gender[gender].toString(),
      label: t(`customer.form.basicInfo.gender.${gender}`),
    })),
  ];

  const maritalStatusOptions: DropdownOption[] = [
    {
      value: "",
      label: t("customer.form.basicInfo.maritalStatus.placeholder"),
    },
    ...getEnumKeys(MaritalStatus).map((status) => ({
      value: MaritalStatus[status].toString(),
      label: t(`customer.form.basicInfo.maritalStatus.${status}`),
    })),
  ];

  return (
    <Card>
      <CardBody>
        <h4 className="card-title mb-4">{t("customer.form.steps.basic")}</h4>
        <div>
          <Row className="mb-3">
            <Col md={12}>
              <FormGroup>
                <div className="form-check">
                  <Input
                    type="checkbox"
                    className="form-check-input"
                    id="isCompany"
                    checked={data.isCompany || false}
                    onChange={(e) =>
                      handleInputChange("isCompany", e.target.checked)
                    }
                  />
                  <Label className="form-check-label" htmlFor="isCompany">
                    {t("customer.form.basicInfo.isCompany")}
                  </Label>
                </div>
              </FormGroup>
            </Col>
          </Row>

          {data.isCompany ? (
            // Company specific fields
            <>
              <Row className="mb-3">
                <Col md={12}>
                  <FormGroup>
                    <Label for="title">
                      {t("customer.form.basicInfo.companyName")}
                    </Label>
                    <Input
                      type="text"
                      id="title"
                      value={data.title || ""}
                      onChange={(e) =>
                        handleInputChange("title", e.target.value || null)
                      }
                      invalid={touched.title && Boolean(errors.title)}
                      placeholder={t(
                        "customer.form.basicInfo.placeholders.companyName"
                      )}
                    />
                    {touched.title && errors.title && (
                      <div className="invalid-feedback d-block">
                        {errors.title}
                      </div>
                    )}
                  </FormGroup>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={6}>
                  <FormGroup>
                    <Label for="tradeChamberNumber">
                      {t("customer.form.basicInfo.tradeChamberNumber")}
                    </Label>
                    <Input
                      type="text"
                      id="tradeChamberNumber"
                      value={data.tradeChamberNumber || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "tradeChamberNumber",
                          e.target.value || null
                        )
                      }
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
                      value={data.registrationNumber || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "registrationNumber",
                          e.target.value || null
                        )
                      }
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
                      value={data.firstName || ""}
                      onChange={(e) =>
                        handleInputChange("firstName", e.target.value || null)
                      }
                      invalid={touched.firstName && Boolean(errors.firstName)}
                      placeholder={t(
                        "customer.form.basicInfo.placeholders.firstName"
                      )}
                    />
                    {touched.firstName && errors.firstName && (
                      <div className="invalid-feedback d-block">
                        {errors.firstName}
                      </div>
                    )}
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
                      value={data.lastName || ""}
                      onChange={(e) =>
                        handleInputChange("lastName", e.target.value || null)
                      }
                      invalid={touched.lastName && Boolean(errors.lastName)}
                      placeholder={t(
                        "customer.form.basicInfo.placeholders.lastName"
                      )}
                    />
                    {touched.lastName && errors.lastName && (
                      <div className="invalid-feedback d-block">
                        {errors.lastName}
                      </div>
                    )}
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
                      value={data.gender?.toString() || ""}
                      onChange={(value) =>
                        handleInputChange(
                          "gender",
                          value ? Number(value) : null
                        )
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
                      value={data.maritalStatus?.toString() || ""}
                      onChange={(value) =>
                        handleInputChange(
                          "maritalStatus",
                          value ? Number(value) : null
                        )
                      }
                      placeholder={t(
                        "customer.form.basicInfo.maritalStatus.placeholder"
                      )}
                    />
                  </FormGroup>
                </Col>
              </Row>
            </>
          )}

          {/* Common fields */}
          <Row className="mb-3">
            <Col md={6}>
              <FormGroup>
                <Label for="nationalId">
                  {t("customer.form.basicInfo.nationalCode")}
                </Label>
                <Input
                  type="text"
                  id="nationalId"
                  value={data.nationalId || ""}
                  onChange={(e) =>
                    handleInputChange("nationalId", e.target.value || null)
                  }
                  placeholder={t(
                    "customer.form.basicInfo.placeholders.nationalCode"
                  )}
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="taxId">{t("customer.form.basicInfo.taxId")}</Label>
                <Input
                  type="text"
                  id="taxId"
                  value={data.taxId || ""}
                  onChange={(e) =>
                    handleInputChange("taxId", e.target.value || null)
                  }
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
                  value={data.customerType?.toString() || ""}
                  onChange={(value) =>
                    handleInputChange(
                      "customerType",
                      value ? Number(value) : null
                    )
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
                  value={data.customerRiskLimit ?? ""}
                  onChange={(e) =>
                    handleInputChange(
                      "customerRiskLimit",
                      e.target.value ? Number(e.target.value) : null
                    )
                  }
                  placeholder={t(
                    "customer.form.basicInfo.placeholders.customerRiskLimit"
                  )}
                />
              </FormGroup>
            </Col>
          </Row>
        </div>
      </CardBody>
    </Card>
  );
};

export default BasicInfoForm;

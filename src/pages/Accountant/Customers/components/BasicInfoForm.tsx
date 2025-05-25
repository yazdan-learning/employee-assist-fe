import React from 'react';
import { Row, Col, Card, CardBody,  FormGroup, Label, Input } from 'reactstrap';
import { useTranslation } from 'react-i18next';
import { CustomerBasicInfo, CustomerType } from '../types';
import RaDropdown, { DropdownOption } from '../../../../Components/Common/RaDropdown';

interface BasicInfoFormProps {
  basicInfo: CustomerBasicInfo;
  onChange: (basicInfo: CustomerBasicInfo) => void;
}

const BasicInfoForm: React.FC<BasicInfoFormProps> = ({ basicInfo, onChange }) => {
  const { t } = useTranslation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    onChange({
      ...basicInfo,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const dropdownOptions: DropdownOption[] = Object.values(CustomerType)
    .filter(type => type !== CustomerType.NONE)
    .map(type => ({
      value: type,
      label: t(`customer.form.basicInfo.customerTypes.${type}`)
    }));

  const handleCustomerTypeChange = (value: string) => {
    onChange({
      ...basicInfo,
      customerType: value as CustomerType
    });
  };

  return (
    <Card>
      <CardBody>
        <h4 className="card-title mb-4">{t('customer.form.steps.basic')}</h4>
        
        <Row>
          <Col md={12}>
            <FormGroup check>
              <Input
                type="checkbox"
                id="isFirm"
                name="isFirm"
                checked={basicInfo.isFirm}
                onChange={handleChange}
              />
              <Label check for="isFirm">
                {t('customer.form.basicInfo.isFirm')}
              </Label>
            </FormGroup>
          </Col>
        </Row>

        {basicInfo.isFirm ? (
          <Row>
            <Col md={12}>
              <FormGroup>
                <Label for="companyName">{t('customer.form.basicInfo.companyName')}</Label>
                <Input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={basicInfo.companyName || ''}
                  onChange={handleChange}
                  placeholder={t('customer.form.basicInfo.placeholders.companyName')}
                />
              </FormGroup>
            </Col>
          </Row>
        ) : (
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for="firstName">{t('customer.form.basicInfo.firstName')}</Label>
                <Input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={basicInfo.firstName || ''}
                  onChange={handleChange}
                  placeholder={t('customer.form.basicInfo.placeholders.firstName')}
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="lastName">{t('customer.form.basicInfo.lastName')}</Label>
                <Input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={basicInfo.lastName || ''}
                  onChange={handleChange}
                  placeholder={t('customer.form.basicInfo.placeholders.lastName')}
                />
              </FormGroup>
            </Col>
          </Row>
        )}

        <Row>
          <Col md={6}>
            <FormGroup>
              <Label for="nationalCode">
                {basicInfo.isFirm 
                  ? t('customer.form.basicInfo.companyId')
                  : t('customer.form.basicInfo.nationalCode')}
              </Label>
              <Input
                type="text"
                id="nationalCode"
                name="nationalCode"
                value={basicInfo.nationalCode}
                onChange={handleChange}
                placeholder={basicInfo.isFirm 
                  ? t('customer.form.basicInfo.placeholders.companyId')
                  : t('customer.form.basicInfo.placeholders.nationalCode')}
              />
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup>
              <Label for="taxId">{t('customer.form.basicInfo.taxId')}</Label>
              <Input
                type="text"
                id="taxId"
                name="taxId"
                value={basicInfo.taxId}
                onChange={handleChange}
                placeholder={t('customer.form.basicInfo.placeholders.taxId')}
              />
            </FormGroup>
          </Col>
        </Row>

        <Row>
          <Col md={12}>
            <FormGroup>
              <Label for="customerType">{t('customer.form.basicInfo.customerType')}</Label>
              <RaDropdown
                options={dropdownOptions}
                value={basicInfo.customerType}
                onChange={handleCustomerTypeChange}
                placeholder={t('customer.form.basicInfo.customerTypes.NONE')}
                showClear={true}
              />
            </FormGroup>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

export default BasicInfoForm; 
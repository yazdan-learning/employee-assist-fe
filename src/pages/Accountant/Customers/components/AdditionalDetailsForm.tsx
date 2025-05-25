import React from 'react';
import { Row, Col, Card, CardBody, Form, FormGroup, Label, Input } from 'reactstrap';
import { useTranslation } from 'react-i18next';
import { CustomerAdditionalDetails } from '../types';

interface AdditionalDetailsFormProps {
  additionalDetails: CustomerAdditionalDetails;
  onChange: (additionalDetails: CustomerAdditionalDetails) => void;
}

const AdditionalDetailsForm: React.FC<AdditionalDetailsFormProps> = ({ additionalDetails, onChange }) => {
  const { t } = useTranslation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onChange({
      ...additionalDetails,
      [name]: value
    });
  };

  return (
    <Card>
      <CardBody>
        <h4 className="card-title mb-4">{t('customer.form.steps.additional')}</h4>
        
        <Row>
          <Col md={12}>
            <FormGroup>
              <Label>{t('customer.form.additionalDetails.notes')}</Label>
              <textarea
                className="form-control"
                name="notes"
                value={additionalDetails.notes || ''}
                onChange={handleChange}
                placeholder={t('customer.form.additionalDetails.placeholders.notes')}
                rows={4}
              />
            </FormGroup>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <FormGroup>
              <Label>{t('customer.form.additionalDetails.preferredContactMethod')}</Label>
              <Input
                type="select"
                name="preferredContactMethod"
                value={additionalDetails.preferredContactMethod || ''}
                onChange={handleChange}
              >
                <option value="">{t('customer.form.additionalDetails.placeholders.selectContactMethod')}</option>
                <option value="email">{t('customer.form.additionalDetails.contactMethods.email')}</option>
                <option value="phone">{t('customer.form.additionalDetails.contactMethods.phone')}</option>
                <option value="sms">{t('customer.form.additionalDetails.contactMethods.sms')}</option>
              </Input>
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup>
              <Label>{t('customer.form.additionalDetails.tags')}</Label>
              <Input
                type="text"
                name="tags"
                value={additionalDetails.tags || ''}
                onChange={handleChange}
                placeholder={t('customer.form.additionalDetails.placeholders.tags')}
              />
            </FormGroup>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

export default AdditionalDetailsForm; 
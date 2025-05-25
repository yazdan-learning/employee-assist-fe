import React from 'react';
import { Row, Col, Card, CardBody, Form, FormGroup, Label, Input, Button } from 'reactstrap';
import { useTranslation } from 'react-i18next';
import { CustomerContactInfo, Address } from '../types';
import AddressForm from './AddressForm';

interface ContactInfoFormProps {
  contactInfo: CustomerContactInfo;
  onChange: (contactInfo: CustomerContactInfo) => void;
}

const ContactInfoForm: React.FC<ContactInfoFormProps> = ({ contactInfo, onChange }) => {
  const { t } = useTranslation();

  const handleAddressChange = (index: number, address: { address: string; postalCode: string; city: string }) => {
    const newAddresses = [...contactInfo.addresses];
    newAddresses[index] = address;
    onChange({
      ...contactInfo,
      addresses: newAddresses
    });
  };

  const handleAddAddress = () => {
    onChange({
      ...contactInfo,
      addresses: [...contactInfo.addresses, { address: '', postalCode: '', city: '' }]
    });
  };

  const handleRemoveAddress = (index: number) => {
    const newAddresses = contactInfo.addresses.filter((_, i) => i !== index);
    onChange({
      ...contactInfo,
      addresses: newAddresses
    });
  };

  const handlePhoneChange = (index: number, value: string) => {
    const newPhones = [...contactInfo.phones];
    newPhones[index] = value;
    onChange({
      ...contactInfo,
      phones: newPhones
    });
  };

  const handleAddPhone = () => {
    onChange({
      ...contactInfo,
      phones: [...contactInfo.phones, '']
    });
  };

  const handleRemovePhone = (index: number) => {
    const newPhones = contactInfo.phones.filter((_, i) => i !== index);
    onChange({
      ...contactInfo,
      phones: newPhones
    });
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...contactInfo,
      email: e.target.value
    });
  };

  const handleWebsiteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...contactInfo,
      website: e.target.value
    });
  };

  return (
    <Card>
      <CardBody>
        <h4 className="card-title mb-4">{t('customer.form.steps.contact')}</h4>
        
        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5>{t('customer.form.contactInfo.addresses')}</h5>
            <Button color="primary" size="sm" onClick={handleAddAddress}>
              {t('customer.form.contactInfo.buttons.addAddress')}
            </Button>
          </div>
          {contactInfo.addresses.map((address, index) => (
            <div key={index} className="mb-3">
              <AddressForm
                address={address}
                onChange={(newAddress) => handleAddressChange(index, newAddress)}
                onRemove={() => handleRemoveAddress(index)}
                showRemove={contactInfo.addresses.length > 1}
              />
            </div>
          ))}
        </div>

        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5>{t('customer.form.contactInfo.phones')}</h5>
            <Button color="primary" size="sm" onClick={handleAddPhone}>
              {t('customer.form.contactInfo.buttons.addPhone')}
            </Button>
          </div>
          {contactInfo.phones.map((phone, index) => (
            <Row key={index} className="mb-3">
              <Col md={11}>
                <Input
                  type="tel"
                  value={phone}
                  onChange={(e) => handlePhoneChange(index, e.target.value)}
                  placeholder={t('customer.form.contactInfo.placeholders.phone')}
                />
              </Col>
              {contactInfo.phones.length > 1 && (
                <Col md={1}>
                  <Button
                    color="danger"
                    size="sm"
                    onClick={() => handleRemovePhone(index)}
                  >
                    {t('customer.form.contactInfo.buttons.remove')}
                  </Button>
                </Col>
              )}
            </Row>
          ))}
        </div>

        <Row>
          <Col md={6}>
            <FormGroup>
              <Label>{t('customer.form.contactInfo.email')}</Label>
              <Input
                type="email"
                value={contactInfo.email}
                onChange={handleEmailChange}
                placeholder={t('customer.form.contactInfo.placeholders.email')}
              />
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup>
              <Label>{t('customer.form.contactInfo.website')}</Label>
              <Input
                type="url"
                value={contactInfo.website || ''}
                onChange={handleWebsiteChange}
                placeholder={t('customer.form.contactInfo.placeholders.website')}
              />
            </FormGroup>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

export default ContactInfoForm; 
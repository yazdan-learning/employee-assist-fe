import React from 'react';
import { Row, Col, FormGroup, Label, Input, Button } from 'reactstrap';
import { useTranslation } from 'react-i18next';
import { Address } from '../types';

interface AddressFormProps {
  address: Address;
  onChange: (address: Address) => void;
  onRemove: () => void;
  showRemove?: boolean;
}

const AddressForm: React.FC<AddressFormProps> = ({ address, onChange, onRemove, showRemove = true }) => {
  const { t } = useTranslation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onChange({
      ...address,
      [name]: value
    });
  };

  return (
    <div className="border p-3 rounded">
      <Row>
        <Col md={12}>
          <FormGroup>
            <Label>{t('customer.form.contactInfo.address')}</Label>
            <Input
              type="textarea"
              name="address"
              value={address.address}
              onChange={handleChange}
              placeholder={t('customer.form.contactInfo.placeholders.address')}
            />
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <FormGroup>
            <Label>{t('customer.form.contactInfo.postalCode')}</Label>
            <Input
              type="text"
              name="postalCode"
              value={address.postalCode}
              onChange={handleChange}
              placeholder={t('customer.form.contactInfo.placeholders.postalCode')}
            />
          </FormGroup>
        </Col>
        <Col md={6}>
          <FormGroup>
            <Label>{t('customer.form.contactInfo.city')}</Label>
            <Input
              type="text"
              name="city"
              value={address.city}
              onChange={handleChange}
              placeholder={t('customer.form.contactInfo.placeholders.city')}
            />
          </FormGroup>
        </Col>
      </Row>
      {showRemove && (
        <div className="text-end mt-3">
          <Button color="danger" size="sm" onClick={onRemove}>
            {t('customer.form.contactInfo.buttons.remove')}
          </Button>
        </div>
      )}
    </div>
  );
};

export default AddressForm; 
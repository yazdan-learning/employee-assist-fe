import React, { useState, useMemo } from 'react';
import { Row, Col, Card, CardBody, Form, FormGroup, Label, Input, Button, Container } from 'reactstrap';
import { useTranslation } from 'react-i18next';
import { CustomerContactInfo } from '../types';
import AddressList from './AddressList';
import TableContainer from '../../../../Components/Common/TableContainer';

interface ContactInfoFormProps {
  contactInfo: CustomerContactInfo;
  onChange: (contactInfo: CustomerContactInfo) => void;
}

const ContactInfoForm: React.FC<ContactInfoFormProps> = ({ contactInfo, onChange }) => {
  const { t } = useTranslation();
  const [showPhoneForm, setShowPhoneForm] = useState(false);
  const [editingPhoneIndex, setEditingPhoneIndex] = useState<number | null>(null);
  const [formPhone, setFormPhone] = useState('');

  const handleAddressesChange = (addresses: { address: string; postalCode: string; city: string }[]) => {
    onChange({
      ...contactInfo,
      addresses
    });
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormPhone(e.target.value);
  };

  const handleAddPhone = () => {
    if (formPhone) {
      if (editingPhoneIndex !== null) {
        // Update existing phone
        const newPhones = [...contactInfo.phones];
        newPhones[editingPhoneIndex] = formPhone;
        onChange({
          ...contactInfo,
          phones: newPhones
        });
        setEditingPhoneIndex(null);
      } else {
        // Add new phone
        onChange({
          ...contactInfo,
          phones: [...contactInfo.phones, formPhone]
        });
      }
      // Clear form and hide it
      setFormPhone('');
      setShowPhoneForm(false);
    }
  };

  const handleEditPhone = (index: number) => {
    setFormPhone(contactInfo.phones[index]);
    setEditingPhoneIndex(index);
    setShowPhoneForm(true);
  };

  const handleRemovePhone = (index: number) => {
    const newPhones = contactInfo.phones.filter((_, i) => i !== index);
    onChange({
      ...contactInfo,
      phones: newPhones
    });
    if (editingPhoneIndex === index) {
      setEditingPhoneIndex(null);
      setFormPhone('');
      setShowPhoneForm(false);
    }
  };

  const handleCancelPhone = () => {
    setEditingPhoneIndex(null);
    setFormPhone('');
    setShowPhoneForm(false);
  };

  const handleAddNewPhone = () => {
    setEditingPhoneIndex(null);
    setFormPhone('');
    setShowPhoneForm(true);
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

  const phoneColumns = useMemo(() => [
    {
      header: t('customer.form.contactInfo.phones.title'),
      accessorKey: 'phone',
      enableColumnFilter: false,
      enableSorting: false,
      cell: (row: any) => row.getValue(),
    },
    {
      header: t('customer.form.buttons.actions'),
      accessorKey: 'actions',
      enableColumnFilter: false,
      enableSorting: false,
      cell: (row: any) => {
        const index = row.row.index;
        return (
          <div className="d-flex gap-3">
            <button
              className="btn btn-sm btn-soft-primary"
              onClick={() => handleEditPhone(index)}
              disabled={showPhoneForm}
            >
              <i className="fas fa-edit font-size-14"></i>
            </button>
            <button
              className="btn btn-sm btn-soft-danger"
              onClick={() => handleRemovePhone(index)}
              disabled={showPhoneForm}
            >
              <i className="fas fa-trash-alt font-size-14"></i>
            </button>
          </div>
        );
      },
    },
  ], [t, showPhoneForm, contactInfo.phones]);

  return (
    <Card>
      <CardBody>
        <h4 className="card-title mb-4">{t('customer.form.steps.contact')}</h4>
        
        <AddressList
          addresses={contactInfo.addresses}
          onChange={handleAddressesChange}
        />

        <div className="mb-4">
          <div className="mb-3">
            <h5>{t('customer.form.contactInfo.phones.title')}</h5>
            {!showPhoneForm && (
              <Button color="primary" size="sm" onClick={handleAddNewPhone} className="mt-2">
                <i className="fas fa-plus me-1"></i>
                {t('customer.form.contactInfo.buttons.addPhone')}
              </Button>
            )}
          </div>

          {/* Phone Form */}
          {showPhoneForm && (
            <Card className="mb-4">
              <CardBody>
                <h6 className="mb-3">
                  {editingPhoneIndex !== null 
                    ? t('customer.form.contactInfo.phones.edit')
                    : t('customer.form.contactInfo.phones.add')}
                </h6>
                <Row>
                  <Col md={12}>
                    <Input
                      type="tel"
                      value={formPhone}
                      onChange={handlePhoneChange}
                      placeholder={t('customer.form.contactInfo.placeholders.phone')}
                    />
                  </Col>
                </Row>
                <div className="text-end mt-3">
                  <Button 
                    color="primary" 
                    size="sm" 
                    onClick={handleAddPhone}
                    disabled={!formPhone}
                  >
                    <i className="fas fa-save me-1"></i>
                    {editingPhoneIndex !== null 
                      ? t('customer.form.buttons.update')
                      : t('customer.form.contactInfo.buttons.addPhone')}
                  </Button>
                  <Button 
                    color="secondary" 
                    size="sm" 
                    className="ms-2"
                    onClick={handleCancelPhone}
                  >
                    <i className="fas fa-times me-1"></i>
                    {t('customer.form.buttons.cancel')}
                  </Button>
                </div>
              </CardBody>
            </Card>
          )}

          {/* Phone List */}
          {contactInfo.phones.length > 0 && (
            <Container fluid>
              <TableContainer
                columns={phoneColumns}
                data={contactInfo.phones.map(phone => ({ phone }))}
                isGlobalFilter={false}
                isPagination={false}
                pageSize={10}
              />
            </Container>
          )}
        </div>

        <Row>
          <Col md={6}>
            <FormGroup>
              <Label>{t('customer.form.contactInfo.email.label')}</Label>
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
              <Label>{t('customer.form.contactInfo.website.label')}</Label>
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
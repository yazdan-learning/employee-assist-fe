import React, { useState } from 'react';
import { Row, Col, Card, CardBody, Button } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Customer, CustomerBasicInfo, CustomerContactInfo, CustomerAdditionalDetails, CustomerType } from '../types';
import { createCustomer, updateCustomerById } from '../../../../slices/customers/thunk';
import BasicInfoForm from './BasicInfoForm';
import ContactInfoForm from './ContactInfoForm';
import AdditionalDetailsForm from './AdditionalDetailsForm';
import { AppDispatch } from '../../../../store';

interface CustomerFormProps {
  customer?: Customer;
  isEdit?: boolean;
}

const CustomerForm: React.FC<CustomerFormProps> = ({ customer, isEdit = false }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Customer>(customer || {
    id: '',
    basicInfo: {
      isFirm: false,
      nationalCode: '',
      taxId: '',
      customerType: CustomerType.NONE
    },
    contactInfo: {
      addresses: [{ address: '', postalCode: '', city: '' }],
      phones: [''],
      email: ''
    },
    additionalDetails: {}
  });

  const handleBasicInfoChange = (basicInfo: CustomerBasicInfo) => {
    setFormData(prev => ({
      ...prev,
      basicInfo
    }));
  };

  const handleContactInfoChange = (contactInfo: CustomerContactInfo) => {
    setFormData(prev => ({
      ...prev,
      contactInfo
    }));
  };

  const handleAdditionalDetailsChange = (additionalDetails: CustomerAdditionalDetails) => {
    setFormData(prev => ({
      ...prev,
      additionalDetails
    }));
  };

  const handleNext = () => {
    setCurrentStep(prev => prev + 1);
  };

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    try {
      if (isEdit && customer) {
        await dispatch(updateCustomerById({
          id: customer.id,
          basicInfo: formData.basicInfo,
          contactInfo: formData.contactInfo,
          additionalDetails: formData.additionalDetails
        }));
      } else {
        await dispatch(createCustomer({
          basicInfo: formData.basicInfo,
          contactInfo: formData.contactInfo,
          additionalDetails: formData.additionalDetails
        }));
      }
      navigate('/accountant/customers');
    } catch (error) {
      console.error('Error saving customer:', error);
    }
  };

  return (
    <div className="page-content">
      <div className="container-fluid">
        <Row>
          <Col lg={12}>
            <Card>
              <CardBody>
                <h4 className="card-title mb-4">
                  {isEdit ? t('customer.form.title.edit') : t('customer.form.title.new')}
                </h4>

                {currentStep === 1 && (
                  <BasicInfoForm
                    basicInfo={formData.basicInfo}
                    onChange={handleBasicInfoChange}
                  />
                )}

                {currentStep === 2 && (
                  <ContactInfoForm
                    contactInfo={formData.contactInfo}
                    onChange={handleContactInfoChange}
                  />
                )}

                {currentStep === 3 && (
                  <AdditionalDetailsForm
                    additionalDetails={formData.additionalDetails}
                    onChange={handleAdditionalDetailsChange}
                  />
                )}

                <div className="d-flex justify-content-end mt-4">
                  <div className="d-flex gap-2">
                    {currentStep > 1 && (
                      <Button color="secondary" onClick={handlePrevious}>
                        {t('customer.form.buttons.previous')}
                      </Button>
                    )}
                    {currentStep < 3 ? (
                      <Button color="primary" onClick={handleNext}>
                        {t('customer.form.buttons.next')}
                      </Button>
                    ) : null}
                    <Button color="success" onClick={handleSubmit}>
                      {isEdit ? t('customer.form.buttons.update') : t('customer.form.buttons.save')}
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default CustomerForm; 
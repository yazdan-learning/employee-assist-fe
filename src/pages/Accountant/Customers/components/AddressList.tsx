import React, { useState } from "react";
import { Button, Card, CardBody, Row, Col } from "reactstrap";
import { useTranslation } from "react-i18next";
import { Address } from "../types";
import AddressForm from "./AddressForm";

interface AddressListProps {
  addresses: Address[];
  onChange: (addresses: Address[]) => void;
}

const AddressList: React.FC<AddressListProps> = ({
  addresses = [],
  onChange,
}) => {
  const { t } = useTranslation();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleSave = (address: Address, index?: number) => {
    let newAddresses: Address[];

    if (typeof index === "number") {
      // Editing existing address
      newAddresses = [...addresses];
      newAddresses[index] = address;
    } else {
      // Adding new address
      newAddresses = [...addresses, address];
    }

    // If the new/edited address is primary, update other addresses
    if (address.isPrimary) {
      newAddresses = newAddresses.map((addr, i) => ({
        ...addr,
        isPrimary:
          typeof index === "number"
            ? i === index
            : i === newAddresses.length - 1,
      }));
    }

    onChange(newAddresses);
    setShowAddForm(false);
    setEditingIndex(null);
  };

  const handleRemove = (index: number) => {
    const newAddresses = addresses.filter((_, i) => i !== index);
    onChange(newAddresses);
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setShowAddForm(false);
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6>{t("customer.form.contactInfo.addresses.title")}</h6>
        <Button
          color="primary"
          size="sm"
          onClick={() => {
            setShowAddForm(true);
            setEditingIndex(null);
          }}
        >
          {t("customer.form.contactInfo.addresses.add")}
        </Button>
      </div>

      {/* Add new address form */}
      {showAddForm && (
        <div className="mb-3">
          <Card>
            <CardBody>
              <AddressForm
                onSave={(address) => handleSave(address)}
                onCancel={() => setShowAddForm(false)}
              />
            </CardBody>
          </Card>
        </div>
      )}

      {/* List of existing addresses */}
      {addresses.length > 0 && (
        <Row>
          {addresses.map((address, index) => (
            <Col md={12} key={index} className="mb-3">
              <Card>
                <CardBody>
                  {editingIndex === index ? (
                    <AddressForm
                      address={address}
                      onSave={(updatedAddress) =>
                        handleSave(updatedAddress, index)
                      }
                      onCancel={() => setEditingIndex(null)}
                    />
                  ) : (
                    <div>
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <h6 className="mb-0">{address.title}</h6>
                        <div className="d-flex gap-2">
                          <Button
                            color="primary"
                            size="sm"
                            onClick={() => handleEdit(index)}
                          >
                            <i className="bx bx-edit"></i>
                          </Button>
                          <Button
                            color="danger"
                            size="sm"
                            onClick={() => handleRemove(index)}
                          >
                            <i className="bx bx-trash"></i>
                          </Button>
                        </div>
                      </div>
                      <Row>
                        <Col md={6}>
                          <div className="address-details">
                            <div className="mb-2">
                              <small className="text-muted">
                                {t(
                                  "customer.form.contactInfo.addresses.address"
                                )}
                                :
                              </small>
                              <div>{address.value}</div>
                            </div>
                          </div>
                        </Col>
                        <Col md={6}>
                          <div className="address-details">
                            <div className="mb-2">
                              <small className="text-muted">
                                {t(
                                  "customer.form.contactInfo.addresses.postalCode"
                                )}
                                :
                              </small>
                              <div>{address.postalCode}</div>
                            </div>
                            {address.isPrimary && (
                              <div className="mt-2">
                                <span className="badge bg-success">
                                  {t(
                                    "customer.form.contactInfo.addresses.primary"
                                  )}
                                </span>
                              </div>
                            )}
                          </div>
                        </Col>
                      </Row>
                    </div>
                  )}
                </CardBody>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default AddressList;

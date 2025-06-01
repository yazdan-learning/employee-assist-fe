import React, { useState } from "react";
import { Button, Card, CardBody } from "reactstrap";
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
        <Card className="mb-3">
          <CardBody>
            <AddressForm
              onSave={(address) => handleSave(address)}
              onCancel={() => setShowAddForm(false)}
            />
          </CardBody>
        </Card>
      )}

      {/* List of existing addresses */}
      {addresses.map((address, index) => (
        <Card key={index} className="mb-3">
          <CardBody>
            {editingIndex === index ? (
              <AddressForm
                address={address}
                onSave={(updatedAddress) => handleSave(updatedAddress, index)}
                onCancel={() => setEditingIndex(null)}
              />
            ) : (
              <div>
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h6>{address.title}</h6>
                    <p className="mb-1">{address.value}</p>
                    <p className="mb-1">{address.postalCode}</p>
                    {address.isPrimary && (
                      <span className="badge bg-success">
                        {t("customer.form.contactInfo.addresses.primary")}
                      </span>
                    )}
                  </div>
                  <div>
                    <Button
                      color="link"
                      className="p-0 me-2"
                      onClick={() => handleEdit(index)}
                    >
                      {t("customer.form.buttons.edit")}
                    </Button>
                    <Button
                      color="link"
                      className="p-0 text-danger"
                      onClick={() => handleRemove(index)}
                    >
                      {t("customer.form.buttons.remove")}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardBody>
        </Card>
      ))}
    </div>
  );
};

export default AddressList;

import React, { useState } from "react";
import { Button, Card, CardBody } from "reactstrap";
import { useTranslation } from "react-i18next";
import { Address } from "../types";
import AddressForm from "./AddressForm";
import CardListContainer from "../../../../Components/Common/CardListContainer";

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

  const columns = [
    {
      key: "title",
      header: t("customer.form.contactInfo.addresses.addressTitle"),
      width: 3,
      render: (address: Address) => (
        <span className="fw-medium">{address.title}</span>
      ),
    },
    {
      key: "address",
      header: t("customer.form.contactInfo.addresses.address"),
      width: 3,
      render: (address: Address) => <span>{address.value}</span>,
    },
    {
      key: "postalCode",
      header: t("customer.form.contactInfo.addresses.postalCode"),
      width: 2,
      render: (address: Address) => <span>{address.postalCode}</span>,
    },
    {
      key: "primary",
      header: t("customer.form.contactInfo.addresses.primary"),
      width: 2,
      align: "center" as const,
      render: (address: Address) =>
        address.isPrimary ? (
          <span className="badge bg-success">
            {t("customer.form.contactInfo.addresses.primary")}
          </span>
        ) : null,
    },
  ];

  const actions = [
    {
      icon: "bx bx-edit-alt",
      color: "primary",
      onClick: (_: any, index: number) => handleEdit(index),
    },
    {
      icon: "bx bx-trash",
      color: "danger",
      onClick: (_: any, index: number) => handleRemove(index),
    },
  ];

  return (
    <div className="mb-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">
          {t("customer.form.contactInfo.addresses.title")}
        </h5>
        <Button
          color="primary"
          size="sm"
          onClick={() => {
            setShowAddForm(true);
            setEditingIndex(null);
          }}
        >
          <i className="bx bx-plus me-1"></i>
          {t("customer.form.contactInfo.addresses.add")}
        </Button>
      </div>

      {/* Add/Edit Form */}
      {(showAddForm || editingIndex !== null) && (
        <Card className="mb-3">
          <CardBody>
            <h6 className="mb-3">
              {editingIndex !== null
                ? t("customer.form.contactInfo.addresses.edit")
                : t("customer.form.contactInfo.addresses.add")}
            </h6>
            <AddressForm
              address={
                editingIndex !== null ? addresses[editingIndex] : undefined
              }
              onSave={(address) =>
                handleSave(
                  address,
                  editingIndex !== null ? editingIndex : undefined
                )
              }
              onCancel={() => {
                setShowAddForm(false);
                setEditingIndex(null);
              }}
            />
          </CardBody>
        </Card>
      )}

      {/* Addresses List */}
      <CardListContainer
        items={addresses}
        columns={columns}
        actions={actions}
        keyField="id"
      />
    </div>
  );
};

export default AddressList;

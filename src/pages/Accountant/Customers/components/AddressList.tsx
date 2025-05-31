import React, { useState, useMemo } from "react";
import { Button, Card, CardBody, Container } from "reactstrap";
import { useTranslation } from "react-i18next";
import { Address } from "../types";
import AddressForm from "./AddressForm";
import TableContainer from "../../../../Components/Common/TableContainer";

const AddressList: React.FC<{
  addresses: Address[];
  onChange: (addresses: Address[]) => void;
}> = ({ addresses, onChange }) => {
  const { t } = useTranslation();
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formAddress, setFormAddress] = useState<Address>({
    title: "",
    value: "",
    postalCode: "",
    isPrimary: false,
  });

  const handleFormChange = (address: Address) => {
    setFormAddress(address);
  };

  const handleAddAddress = () => {
    if (formAddress.value && formAddress.postalCode) {
      if (editingIndex !== null) {
        // Update existing address
        const newAddresses = [...addresses];
        newAddresses[editingIndex] = formAddress;

        // If this address is being set as primary, update other addresses
        if (formAddress.isPrimary) {
          newAddresses.forEach((addr, idx) => {
            if (idx !== editingIndex) {
              addr.isPrimary = false;
            }
          });
        }

        onChange(newAddresses);
        setEditingIndex(null);
      } else {
        // Add new address
        const newAddresses = [...addresses];

        // If this is the first address or is being set as primary, update other addresses
        if (formAddress.isPrimary) {
          newAddresses.forEach((addr) => {
            addr.isPrimary = false;
          });
        }
        // If this is the first address, make it primary by default
        if (newAddresses.length === 0) {
          formAddress.isPrimary = true;
        }

        newAddresses.push(formAddress);
        onChange(newAddresses);
      }
      // Clear form and hide it
      setFormAddress({
        title: "",
        value: "",
        postalCode: "",
        isPrimary: false,
      });
      setShowForm(false);
    }
  };

  const handleEditAddress = (index: number) => {
    setFormAddress(addresses[index]);
    setEditingIndex(index);
    setShowForm(true);
  };

  const handleRemoveAddress = (index: number) => {
    const newAddresses = addresses.filter((_, i) => i !== index);

    // If we're removing the primary address and there are other addresses,
    // make the first remaining address primary
    if (addresses[index].isPrimary && newAddresses.length > 0) {
      newAddresses[0].isPrimary = true;
    }

    onChange(newAddresses);
    if (editingIndex === index) {
      setEditingIndex(null);
      setFormAddress({
        title: "",
        value: "",
        postalCode: "",
        isPrimary: false,
      });
      setShowForm(false);
    }
  };

  const handleCancel = () => {
    setEditingIndex(null);
    setFormAddress({ title: "", value: "", postalCode: "", isPrimary: false });
    setShowForm(false);
  };

  const handleAddNew = () => {
    setEditingIndex(null);
    setFormAddress({ title: "", value: "", postalCode: "", isPrimary: false });
    setShowForm(true);
  };

  const columns = useMemo(
    () => [
      {
        header: t("customer.form.contactInfo.addressTitle"),
        accessorKey: "title",
        enableColumnFilter: true,
        enableSorting: true,
        cell: (row: any) => row.getValue(),
        size: 20,
      },
      {
        header: t("customer.form.contactInfo.address"),
        accessorKey: "value",
        enableColumnFilter: true,
        enableSorting: false,
        cell: (row: any) => row.getValue(),
        size: 40,
      },
      {
        header: t("customer.form.contactInfo.postalCode"),
        accessorKey: "postalCode",
        enableColumnFilter: false,
        enableSorting: false,
        cell: (row: any) => row.getValue(),
        size: 15,
      },
      {
        header: t("customer.form.contactInfo.isPrimary"),
        accessorKey: "isPrimary",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (row: any) => (
          <span className={row.getValue() ? "text-success" : "text-muted"}>
            <i className={`fas fa-${row.getValue() ? "check" : "times"}`}></i>
          </span>
        ),
        size: 10,
      },
      {
        header: t("customer.form.buttons.actions"),
        accessorKey: "actions",
        enableColumnFilter: false,
        enableSorting: false,
        size: 10,
        cell: (row: any) => {
          const index = row.row.index;
          return (
            <div className="d-flex gap-3">
              <button
                className="btn btn-sm btn-soft-primary"
                onClick={() => handleEditAddress(index)}
                disabled={showForm}
              >
                <i className="fas fa-edit font-size-14"></i>
              </button>
              <button
                className="btn btn-sm btn-soft-danger"
                onClick={() => handleRemoveAddress(index)}
                disabled={showForm}
              >
                <i className="fas fa-trash-alt font-size-14"></i>
              </button>
            </div>
          );
        },
      },
    ],
    [t, showForm]
  );

  return (
    <div className="mb-4">
      <div className="mb-3">
        <h5>{t("customer.form.contactInfo.addresses.title")}</h5>
        {!showForm && (
          <Button
            color="primary"
            size="sm"
            onClick={handleAddNew}
            className="mt-2"
          >
            <i className="fas fa-plus me-1"></i>
            {t("customer.form.contactInfo.buttons.addAddress")}
          </Button>
        )}
      </div>

      {/* Address Form */}
      {showForm && (
        <Card className="mb-4">
          <CardBody>
            <h6 className="mb-3">
              {editingIndex !== null
                ? t("customer.form.contactInfo.addresses.edit")
                : t("customer.form.contactInfo.addresses.add")}
            </h6>
            <AddressForm
              address={formAddress}
              onChange={handleFormChange}
              onRemove={handleCancel}
              showRemove={false}
            />
            <div className="text-end mt-3">
              <Button
                color="primary"
                size="sm"
                onClick={handleAddAddress}
                disabled={
                  !formAddress.value ||
                  !formAddress.postalCode ||
                  !formAddress.title
                }
              >
                <i className="fas fa-save me-1"></i>
                {editingIndex !== null
                  ? t("customer.form.buttons.update")
                  : t("customer.form.contactInfo.buttons.addAddress")}
              </Button>
              <Button
                color="secondary"
                size="sm"
                className="ms-2"
                onClick={handleCancel}
              >
                <i className="fas fa-times me-1"></i>
                {t("customer.form.buttons.cancel")}
              </Button>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Address List */}
      {addresses.length > 0 && (
        <Container fluid>
          <TableContainer
            columns={columns}
            data={addresses}
            isGlobalFilter={false}
            isPagination={false}
            pageSize={10}
          />
        </Container>
      )}
    </div>
  );
};

export default AddressList;

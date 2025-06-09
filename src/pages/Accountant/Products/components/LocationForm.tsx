import React, { useState } from "react";
import { Button, Card, CardBody } from "reactstrap";
import { useTranslation } from "react-i18next";
import LocationFormFields from "./LocationFormFields";
import CardListContainer from "../../../../Components/Common/CardListContainer";
import { FormikErrors, FormikTouched } from "formik";
import { Product } from "../types";

interface Location {
  warehouseId: number;
  addressId: number;
}

interface LocationFormProps {
  locations: { warehouseId: number; addressId: number }[];
  onChange: (locations: { warehouseId: number; addressId: number }[]) => void;
  errors?: FormikErrors<Product>;
  touched?: FormikTouched<Product>;
}

const LocationForm: React.FC<LocationFormProps> = ({
  locations,
  onChange,
  errors = {},
  touched = {},
}) => {
  const { t } = useTranslation();
  const [showForm, setShowForm] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const handleAdd = () => {
    setShowForm(true);
    setEditIndex(null);
  };

  const handleEdit = (index: number) => {
    setShowForm(true);
    setEditIndex(index);
  };

  const handleRemove = (index: number) => {
    const newLocations = locations.filter((_, i) => i !== index);
    onChange(newLocations);
  };

  const handleSave = (location: Location) => {
    let newLocations: Location[];
    if (editIndex !== null) {
      newLocations = [...locations];
      newLocations[editIndex] = location;
    } else {
      newLocations = [...locations, location];
    }
    onChange(newLocations);
    setShowForm(false);
    setEditIndex(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditIndex(null);
  };

  const columns = [
    {
      key: "warehouse",
      header: t("product.form.locations.warehouse"),
      width: 3,
      render: (location: Location) => (
        <span className="fw-medium">{location.warehouseId}</span>
      ),
    },
    {
      key: "address",
      header: t("product.form.locations.address"),
      width: 7,
      render: (location: Location) => <span>{location.addressId}</span>,
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
    <div>
      <div className="d-flex justify-content-end mb-3">
        <Button color="primary" size="sm" onClick={handleAdd}>
          <i className="bx bx-plus me-1"></i>
          {t("product.form.locations.add")}
        </Button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <Card className="mb-3">
          <CardBody>
            <h6 className="mb-3">
              {editIndex !== null
                ? t("product.form.locations.edit")
                : t("product.form.locations.add")}
            </h6>
            <LocationFormFields
              location={editIndex !== null ? locations[editIndex] : undefined}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          </CardBody>
        </Card>
      )}

      {/* Locations List */}
      <CardListContainer
        items={locations}
        columns={columns}
        actions={actions}
        keyField="warehouseId"
      />
    </div>
  );
};

export default LocationForm;

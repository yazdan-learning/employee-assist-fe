import React, { useState } from "react";
import { Button, Card, CardBody } from "reactstrap";
import { useTranslation } from "react-i18next";
import LocationForm from "./LocationForm";
import CardListContainer from "../../../../Components/Common/CardListContainer";
import { FormikErrors, FormikTouched } from "formik";
import { Product } from "../types";
import {
  useWarehouses,
  useWarehouseAddresses,
} from "../../../../hooks/useProducts";

interface Location {
  warehouseId: number;
  addressId?: number;
  minQuantity?: number;
  maxQuantity?: number;
}

interface LocationListProps {
  locations: Location[];
  onChange: (locations: Location[]) => void;
  errors?: FormikErrors<Product>;
  touched?: FormikTouched<Product>;
}

const LocationList: React.FC<LocationListProps> = ({
  locations,
  onChange,
  errors = {},
  touched = {},
}) => {
  const { t } = useTranslation();
  const [showForm, setShowForm] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const { data: warehouses = [] } = useWarehouses();

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

  // Find warehouse and address names for display
  const getLocationDisplay = (location: Location) => {
    const warehouse = warehouses.find((w) => w.id === location.warehouseId);
    const { data: addresses = [] } = useWarehouseAddresses(
      location.warehouseId
    );
    const address = addresses.find((a) => a.id === location.addressId);

    return {
      warehouseName: warehouse?.name || location.warehouseId.toString(),
      addressName: address?.name || location.addressId?.toString() || "",
    };
  };

  const columns = [
    {
      key: "warehouse",
      header: t("product.form.locations.warehouse"),
      width: 2,
      render: (location: Location) => (
        <span>{getLocationDisplay(location).warehouseName}</span>
      ),
    },
    {
      key: "address",
      header: t("product.form.locations.address"),
      width: 4,
      render: (location: Location) => (
        <span>{getLocationDisplay(location).addressName}</span>
      ),
    },
    {
      key: "minQuantity",
      header: t("product.form.locations.minQuantity"),
      width: 2,
      render: (location: Location) => (
        <span>{location.minQuantity || "-"}</span>
      ),
    },
    {
      key: "maxQuantity",
      header: t("product.form.locations.maxQuantity"),
      width: 2,
      render: (location: Location) => (
        <span>{location.maxQuantity || "-"}</span>
      ),
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
            <LocationForm
              location={editIndex !== null ? locations[editIndex] : undefined}
              onSave={handleSave}
              onCancel={handleCancel}
              errors={errors}
              touched={touched}
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

export default LocationList;

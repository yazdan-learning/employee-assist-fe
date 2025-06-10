import React, { useState } from "react";
import { Button, Card, CardBody } from "reactstrap";
import { useTranslation } from "react-i18next";
import { ProductUnit } from "../types";
import UnitForm from "./UnitForm";
import CardListContainer from "../../../../Components/Common/CardListContainer";
import { FormikErrors, FormikTouched } from "formik";
import { Product } from "../types";
import { useUnits } from "../../../../hooks/useProducts";

interface UnitListProps {
  units: ProductUnit[];
  onChange: (units: ProductUnit[]) => void;
  errors?: FormikErrors<Product>;
  touched?: FormikTouched<Product>;
}

const UnitList: React.FC<UnitListProps> = ({
  units = [],
  onChange,
  errors = {},
  touched = {},
}) => {
  const { t } = useTranslation();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const { data: unitsList = [] } = useUnits();

  const handleSave = (unit: ProductUnit, index?: number) => {
    let newUnits: ProductUnit[];

    if (typeof index === "number") {
      // Editing existing unit
      newUnits = [...units];
      newUnits[index] = unit;
    } else {
      // Adding new unit
      newUnits = [...units, unit];
    }

    onChange(newUnits);
    setShowAddForm(false);
    setEditingIndex(null);
  };

  const handleRemove = (index: number) => {
    // Don't allow removing if it's the last unit
    if (units.length === 1) {
      return;
    }

    // Don't allow removing if it's the primary unit and there are other units
    if (units[index].isPrimary && units.length > 1) {
      return;
    }

    const newUnits = units.filter((_, i) => i !== index);
    onChange(newUnits);
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setShowAddForm(false);
  };

  const columns = [
    {
      key: "unit",
      header: t("product.form.units.unit"),
      width: 2,
      render: (unit: ProductUnit) => {
        const unitName = unitsList.find((u) => u.id === unit.unitId)?.name;
        return <span className="fw-medium">{unitName || "-"}</span>;
      },
    },
    {
      key: "conversionRate",
      header: t("product.form.units.conversionRate"),
      width: 3,
      render: (unit: ProductUnit) => <span>{unit.conversionRate}</span>,
    },
    {
      key: "weightPerUnit",
      header: t("product.form.units.weightPerUnit"),
      width: 3,
      render: (unit: ProductUnit) => <span>{unit.weightPerUnit}</span>,
    },
    {
      key: "primary",
      header: t("product.form.units.primaryBadge"),
      width: 2,
      align: "center" as const,
      render: (unit: ProductUnit) =>
        unit.isPrimary ? (
          <span className="badge bg-success">
            {t("product.form.units.primaryBadge")}
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
      disabled: (unit: ProductUnit) => units.length === 1 || unit.isPrimary,
      tooltip:
        units.length === 1
          ? t("product.form.units.cantRemoveLastUnit")
          : t("product.form.units.cantRemovePrimary"),
    },
  ];

  return (
    <div className="mb-4">
      <div className="d-flex justify-content-end mb-3">
        <Button
          color="primary"
          size="sm"
          onClick={() => {
            setShowAddForm(true);
            setEditingIndex(null);
          }}
        >
          <i className="bx bx-plus me-1"></i>
          {t("product.form.units.add")}
        </Button>
      </div>

      {/* Add/Edit Form */}
      {(showAddForm || editingIndex !== null) && (
        <Card className="mb-3">
          <CardBody>
            <h6 className="mb-3">
              {editingIndex !== null
                ? t("product.form.units.edit")
                : t("product.form.units.add")}
            </h6>
            <UnitForm
              unit={editingIndex !== null ? units[editingIndex] : undefined}
              existingUnits={units}
              onSave={(unit) =>
                handleSave(
                  unit,
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

      {/* Units List */}
      <CardListContainer
        items={units}
        columns={columns}
        actions={actions}
        keyField="id"
      />
    </div>
  );
};

export default UnitList;

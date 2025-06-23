import React, { useState } from "react";
import { Button, Card, CardBody } from "reactstrap";
import { useTranslation } from "react-i18next";
import CardListContainer from "../../../../Components/Common/CardListContainer";
import { InvoiceDetail } from "../types";
import InvoiceDetailForm from "./InvoiceDetailForm";
import { useProductById, useUnits } from "../../../../hooks/useProducts";

interface InvoiceDetailListProps {
  details: InvoiceDetail[];
  onChange: (details: InvoiceDetail[]) => void;
}

const InvoiceDetailList: React.FC<InvoiceDetailListProps> = ({
  details,
  onChange,
}) => {
  const { t } = useTranslation();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const { data: units = [] } = useUnits();

  const handleSave = (detail: InvoiceDetail, index?: number) => {
    let newDetails: InvoiceDetail[];

    if (typeof index === "number") {
      // Editing existing detail
      newDetails = [...details];
      newDetails[index] = detail;
    } else {
      // Adding new detail
      newDetails = [...details, detail];
    }

    onChange(newDetails);
    setShowAddForm(false);
    setEditingIndex(null);
  };

  const handleRemove = (index: number) => {
    const newDetails = details.filter((_, i) => i !== index);
    onChange(newDetails);
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setShowAddForm(false);
  };

  const columns = [
    {
      key: "product",
      header: t("invoice.form.product"),
      width: 3,
      render: (detail: InvoiceDetail) => {
        const { data: productResponse } = useProductById(detail.productId);
        const product = productResponse?.data;
        return product?.name || detail.productId;
      },
    },
    {
      key: "unit",
      header: t("invoice.form.unit"),
      width: 2,
      render: (detail: InvoiceDetail) => {
        const unit = units.find((u) => u.id === detail.unitId);
        return unit?.name || detail.unitId;
      },
    },
    {
      key: "quantity",
      header: t("invoice.form.quantity"),
      width: 1,
      render: (detail: InvoiceDetail) => detail.quantity,
      align: "end" as const,
    },
    {
      key: "unitPrice",
      header: t("invoice.form.unitPrice"),
      width: 2,
      render: (detail: InvoiceDetail) => detail.unitPrice.toLocaleString(),
      align: "end" as const,
    },
    {
      key: "discount",
      header: t("invoice.form.discount"),
      width: 1,
      render: (detail: InvoiceDetail) => `${detail.discount}%`,
      align: "end" as const,
    },
    {
      key: "vat",
      header: t("invoice.form.vat"),
      width: 1,
      render: (detail: InvoiceDetail) => `${detail.vat}%`,
      align: "end" as const,
    },
    {
      key: "finalPrice",
      header: t("invoice.form.finalPrice"),
      width: 2,
      render: (detail: InvoiceDetail) => detail.finalPrice.toLocaleString(),
      align: "end" as const,
    },
  ];

  const actions = [
    {
      icon: "bx bx-edit-alt",
      onClick: (_: any, index: number) => handleEdit(index),
      color: "primary",
    },
    {
      icon: "bx bx-trash",
      onClick: (_: any, index: number) => handleRemove(index),
      color: "danger",
    },
  ];

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6>{t("invoice.form.details.title")}</h6>
        <Button
          color="primary"
          size="sm"
          onClick={() => {
            setShowAddForm(true);
            setEditingIndex(null);
          }}
        >
          <i className="bx bx-plus me-1"></i>
          {t("invoice.form.details.add")}
        </Button>
      </div>

      {/* Add/Edit form */}
      {(showAddForm || editingIndex !== null) && (
        <div className="mb-3">
          <Card>
            <CardBody>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="mb-0">
                  {editingIndex !== null
                    ? t("invoice.form.details.edit")
                    : t("invoice.form.details.add")}
                </h6>
              </div>
              <InvoiceDetailForm
                initialValues={
                  editingIndex !== null ? details[editingIndex] : undefined
                }
                onSave={(detail) =>
                  handleSave(
                    detail,
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
        </div>
      )}

      {/* List of details */}
      <CardListContainer
        items={details}
        columns={columns}
        actions={actions}
        keyField="id"
      />
    </div>
  );
};

export default InvoiceDetailList; 
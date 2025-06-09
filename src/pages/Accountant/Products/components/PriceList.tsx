import React, { useState } from "react";
import { Button, Card, CardBody } from "reactstrap";
import { useTranslation } from "react-i18next";
import PriceForm from "./PriceForm";
import CardListContainer from "../../../../Components/Common/CardListContainer";
import { FormikErrors, FormikTouched } from "formik";
import { Product } from "../types";

interface Price {
  sellTypeId: number;
  price: number;
  currency: string;
  discountPercentage?: number;
}

interface PriceListProps {
  prices: Price[];
  onChange: (prices: Price[]) => void;
  errors?: FormikErrors<Product>;
  touched?: FormikTouched<Product>;
}

const PriceList: React.FC<PriceListProps> = ({
  prices,
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
    const newPrices = prices.filter((_, i) => i !== index);
    onChange(newPrices);
  };

  const handleSave = (price: Price) => {
    let newPrices: Price[];
    if (editIndex !== null) {
      newPrices = [...prices];
      newPrices[editIndex] = price;
    } else {
      newPrices = [...prices, price];
    }
    onChange(newPrices);
    setShowForm(false);
    setEditIndex(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditIndex(null);
  };

  const columns = [
    {
      key: "sellType",
      header: t("product.form.prices.sellType"),
      width: 3,
      render: (price: Price) => (
        <span className="fw-medium">{price.sellTypeId}</span>
      ),
    },
    {
      key: "price",
      header: t("product.form.prices.price"),
      width: 3,
      render: (price: Price) => (
        <span>
          {price.price} {price.currency}
        </span>
      ),
    },
    {
      key: "discount",
      header: t("product.form.prices.discount"),
      width: 4,
      render: (price: Price) => (
        <span>
          {price.discountPercentage ? `${price.discountPercentage}%` : "-"}
        </span>
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
          {t("product.form.prices.add")}
        </Button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <Card className="mb-3">
          <CardBody>
            <h6 className="mb-3">
              {editIndex !== null
                ? t("product.form.prices.edit")
                : t("product.form.prices.add")}
            </h6>
            <PriceForm
              price={editIndex !== null ? prices[editIndex] : undefined}
              onSave={handleSave}
              onCancel={handleCancel}
              errors={errors}
              touched={touched}
            />
          </CardBody>
        </Card>
      )}

      {/* Prices List */}
      <CardListContainer
        items={prices}
        columns={columns}
        actions={actions}
        keyField="sellTypeId"
      />
    </div>
  );
};

export default PriceList;

import React, { useState, useEffect } from "react";
import { Button, Card, CardBody, Row, Col } from "reactstrap";
import { useTranslation } from "react-i18next";
import { ProductAttribute, Attribute, AttributeValue, Product } from "../types";
import AttributeForm from "./AttributeForm";
import { useAttributes, useAttributeValues } from "../../../../hooks/useProducts";
import { FormikErrors, FormikTouched } from "formik";

interface AttributeListProps {
  attributes: { attributeId: number; valueId: number }[];
  onChange: (attributes: { attributeId: number; valueId: number }[]) => void;
  errors?: FormikErrors<Product>;
  touched?: FormikTouched<Product>;
}

const AttributeList: React.FC<AttributeListProps> = ({
  attributes,
  onChange,
  errors = {},
  touched = {},
}) => {
  const { t } = useTranslation();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  
  // Use the hooks properly
  const { data: attributeList = [] } = useAttributes();
  
  // If we're editing an attribute, we need its values
  const editingAttributeId = editingIndex !== null ? attributes[editingIndex]?.attributeId : null;
  const { data: currentAttributeValues = [] } = useAttributeValues(editingAttributeId);

  const handleSave = (attribute: ProductAttribute, index?: number) => {
    let newAttributes: ProductAttribute[];

    if (typeof index === "number") {
      // Editing existing attribute
      newAttributes = [...attributes];
      newAttributes[index] = attribute;
    } else {
      // Check if attribute type already exists
      const exists = attributes.some(
        (a) => a.attributeId === attribute.attributeId
      );
      if (exists) {
        // Update existing attribute
        newAttributes = attributes.map((a) =>
          a.attributeId === attribute.attributeId ? attribute : a
        );
      } else {
        // Add new attribute
        newAttributes = [...attributes, attribute];
      }
    }

    onChange(newAttributes);
    setShowAddForm(false);
    setEditingIndex(null);
  };

  const handleRemove = (index: number) => {
    const newAttributes = attributes.filter((_, i) => i !== index);
    onChange(newAttributes);
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setShowAddForm(false);
  };

  const getAttributeName = (attributeId: number) => {
    return attributeList.find((a) => a.id === attributeId)?.name || "";
  };

  const getValueName = (valueId: number) => {
    const attribute = attributes.find(a => a.valueId === valueId);
    if (!attribute) return "";
    
    // If this is the attribute we're currently editing, use the current values
    if (attribute.attributeId === editingAttributeId) {
      return currentAttributeValues.find(v => v.id === valueId)?.value || "";
    }
    
    // Otherwise, just show the ID until it's edited
    return `Value ${valueId}`;
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6>{t("product.form.attributes.title")}</h6>
        <Button
          color="primary"
          size="sm"
          onClick={() => {
            setShowAddForm(true);
            setEditingIndex(null);
          }}
        >
          <i className="bx bx-plus me-1"></i>
          {t("product.form.attributes.add")}
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
                    ? t("product.form.attributes.edit")
                    : t("product.form.attributes.add")}
                </h6>
              </div>
              <AttributeForm
                attribute={
                  editingIndex !== null ? attributes[editingIndex] : undefined
                }
                onSave={(attribute) =>
                  handleSave(
                    attribute,
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

      {/* List of existing attributes */}
      <Row className="justify-content-start">
        {attributes.map((attribute, index) => (
          <Col
            key={index}
            lg={3}
            md={4}
            sm={6}
            className="mb-2"
            style={{ maxWidth: "280px" }}
          >
            <Card
              className="border shadow-none"
              style={{ backgroundColor: "var(--bs-light)" }}
            >
              <CardBody className="p-2">
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    <span className="text-muted me-2">
                      {getAttributeName(attribute.attributeId)}:
                    </span>
                    <span className="fw-medium">
                      {getValueName(attribute.valueId)}
                    </span>
                  </div>
                  <div className="d-flex gap-2">
                    <Button
                      color="link"
                      className="p-0 text-primary"
                      onClick={() => handleEdit(index)}
                    >
                      <i className="bx bx-edit-alt fs-4"></i>
                    </Button>
                    <Button
                      color="link"
                      className="p-0 text-danger"
                      onClick={() => handleRemove(index)}
                    >
                      <i className="bx bx-x fs-4"></i>
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default AttributeList;

import React, { useState } from "react";
import { Button, Card, CardBody, Row, Col } from "reactstrap";
import { useTranslation } from "react-i18next";
import { ProductAttribute, Attribute, AttributeValue } from "../types";
import AttributeForm from "./AttributeForm";
import { productService } from "../../../../services/ProductService";

interface AttributeListProps {
  attributes: ProductAttribute[];
  onChange: (attributes: ProductAttribute[]) => void;
}

const AttributeList: React.FC<AttributeListProps> = ({
  attributes = [],
  onChange,
}) => {
  const { t } = useTranslation();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [attributeList, setAttributeList] = useState<Attribute[]>([]);
  const [attributeValues, setAttributeValues] = useState<AttributeValue[]>([]);

  React.useEffect(() => {
    const loadData = async () => {
      const attrs = await productService.getAttributes();
      const values = await Promise.all(
        attrs.map((a) => productService.getAttributeValues(a.id))
      );
      setAttributeList(attrs);
      setAttributeValues(values.flat());
    };
    loadData();
  }, []);

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
    return attributeValues.find((v) => v.id === valueId)?.value || "";
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

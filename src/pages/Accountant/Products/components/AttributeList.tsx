import React, { useState } from "react";
import { Button, Card, CardBody } from "reactstrap";
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
          {t("product.form.attributes.add")}
        </Button>
      </div>

      {/* Add new attribute form */}
      {showAddForm && (
        <div className="mb-3">
          <Card>
            <CardBody>
              <AttributeForm
                onSave={(attribute) => handleSave(attribute)}
                onCancel={() => setShowAddForm(false)}
              />
            </CardBody>
          </Card>
        </div>
      )}

      {/* List of existing attributes */}
      {attributes.map((attribute, index) => (
        <Card key={index} className="mb-2">
          <CardBody>
            {editingIndex === index ? (
              <AttributeForm
                attribute={attribute}
                onSave={(updatedAttribute) =>
                  handleSave(updatedAttribute, index)
                }
                onCancel={() => setEditingIndex(null)}
              />
            ) : (
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <strong>{getAttributeName(attribute.attributeId)}:</strong>{" "}
                  {getValueName(attribute.valueId)}
                </div>
                <div>
                  <Button
                    color="link"
                    className="p-0 me-2"
                    onClick={() => handleEdit(index)}
                  >
                    {t("product.form.buttons.edit")}
                  </Button>
                  <Button
                    color="link"
                    className="p-0 text-danger"
                    onClick={() => handleRemove(index)}
                  >
                    {t("product.form.buttons.remove")}
                  </Button>
                </div>
              </div>
            )}
          </CardBody>
        </Card>
      ))}
    </div>
  );
};

export default AttributeList;

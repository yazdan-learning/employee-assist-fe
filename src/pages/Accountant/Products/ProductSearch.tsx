import React from "react";
import { Input } from "reactstrap";
import { useTranslation } from "react-i18next";

interface ProductSearchProps {
  value: string;
  onChange: (value: string) => void;
}

const ProductSearch: React.FC<ProductSearchProps> = ({ value, onChange }) => {
  const { t } = useTranslation();

  return (
    <Input
      type="search"
      className="form-control"
      placeholder={t("Search products...")}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};

export default ProductSearch;

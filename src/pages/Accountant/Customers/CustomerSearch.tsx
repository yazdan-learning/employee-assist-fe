import React from "react";
import { Input } from "reactstrap";
import { useTranslation } from "react-i18next";

interface CustomerSearchProps {
  value: string;
  onChange: (value: string) => void;
}

const CustomerSearch: React.FC<CustomerSearchProps> = ({ value, onChange }) => {
  const { t } = useTranslation();

  return (
    <Input
      type="search"
      className="form-control"
      placeholder={t("Search customers...")}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};

export default CustomerSearch;

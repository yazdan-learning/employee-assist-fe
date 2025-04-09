import React from "react";
import { Input } from "reactstrap";
import { useTranslation } from "react-i18next";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholderKey: string;
  className?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholderKey,
  className = "",
}) => {
  const { t } = useTranslation();

  return (
    <Input
      type="search"
      className={`form-control ${className}`}
      placeholder={t(placeholderKey)}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};

export default SearchInput;

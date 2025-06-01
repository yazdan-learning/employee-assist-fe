import React, { useState } from "react";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { useTranslation } from "react-i18next";

export interface DropdownOption {
  value: string;
  label: string;
}

interface RaDropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  showClear?: boolean;
  className?: string;
  disabled?: boolean;
}

const RaDropdown: React.FC<RaDropdownProps> = ({
  options,
  value,
  onChange,
  placeholder,
  showClear = true,
  className = "",
  disabled = false,
}) => {
  const { t } = useTranslation();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => setDropdownOpen((prevState) => !prevState);

  const handleSelect = (selectedValue: string) => {
    onChange(selectedValue);
  };

  const selectedOption = options.find((option) => option.value === value);
  const displayValue = selectedOption ? selectedOption.label : placeholder;

  return (
    <Dropdown
      isOpen={dropdownOpen}
      toggle={toggleDropdown}
      className={`w-100 ${className}`}
    >
      <DropdownToggle
        tag="div"
        className="form-control d-flex justify-content-between align-items-center"
        style={{ backgroundColor: "#fff", color: "#495057", cursor: "pointer" }}
        disabled={disabled}
      >
        <span>{displayValue}</span>
        <div className="d-flex align-items-center">
          {showClear && value && (
            <div
              role="button"
              className="btn-close btn-close-white me-2"
              onClick={(e) => {
                e.stopPropagation();
                onChange("");
              }}
              aria-label="Clear"
              style={{ fontSize: "0.7rem", cursor: "pointer" }}
            />
          )}
          <i className="mdi mdi-chevron-down" />
        </div>
      </DropdownToggle>
      <DropdownMenu className="w-100">
        {showClear && value && (
          <>
            <DropdownItem
              onClick={() => handleSelect("")}
              className="py-2 text-danger"
              style={{
                color: "#dc3545",
                backgroundColor: "#fff",
              }}
            >
              {t("Clear")}
            </DropdownItem>
            <DropdownItem divider />
          </>
        )}
        {options.map((option) => (
          <DropdownItem
            key={option.value}
            onClick={() => handleSelect(option.value)}
            active={value === option.value}
            className="py-2"
            style={{
              color: value === option.value ? "#fff" : "#495057",
              backgroundColor: value === option.value ? "#556ee6" : "#fff",
            }}
          >
            {option.label}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
};

export default RaDropdown;

import React, { useState, useMemo } from "react";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Input,
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
  searchable?: boolean;
  defaultShowCount?: number;
  searchPlaceholder?: string;
}

const RaDropdown: React.FC<RaDropdownProps> = ({
  options,
  value,
  onChange,
  placeholder,
  showClear = true,
  className = "",
  disabled = false,
  searchable = false,
  defaultShowCount = 50,
  searchPlaceholder = "Search...",
}) => {
  const { t } = useTranslation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleDropdown = () => {
    if (dropdownOpen) {
      // Closing dropdown
      setDropdownOpen(false);
      setSearchTerm(""); // Reset search when closing
    } else {
      // Opening dropdown
      setDropdownOpen(true);
      setSearchTerm(""); // Reset search when opening
    }
  };

  const closeDropdown = () => {
    setDropdownOpen(false);
    setSearchTerm(""); // Reset search when closing
  };

  const handleSelect = (selectedValue: string) => {
    onChange(selectedValue);
    closeDropdown();
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
    closeDropdown();
  };

  // Filter and limit options based on search and default count
  const filteredOptions = useMemo(() => {
    let filtered = options;

    // Apply search filter if searchable and search term exists
    if (searchable && searchTerm.trim()) {
      filtered = options.filter(
        (option) =>
          option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
          option.value.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // If no search term and searchable, show only default count
    if (searchable && !searchTerm.trim()) {
      filtered = options.slice(0, defaultShowCount);
    }

    return filtered;
  }, [options, searchTerm, searchable, defaultShowCount]);

  const selectedOption = options.find((option) => option.value === value);
  const displayValue = selectedOption ? selectedOption.label : placeholder;

  const hasMoreItems =
    searchable && !searchTerm.trim() && options.length > defaultShowCount;

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
              onClick={handleClear}
              aria-label="Clear"
              style={{ fontSize: "0.7rem", cursor: "pointer" }}
            />
          )}
          <i className="mdi mdi-chevron-down" />
        </div>
      </DropdownToggle>
      {dropdownOpen && (
        <DropdownMenu
          className="w-100"
          style={{ maxHeight: "300px", overflowY: "auto" }}
        >
          {searchable && (
            <>
              <div className="px-3 py-2">
                <Input
                  type="text"
                  placeholder={searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  autoFocus
                />
              </div>
              <DropdownItem divider />
            </>
          )}

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
                {t("common.clear")}
              </DropdownItem>
              <DropdownItem divider />
            </>
          )}

          {filteredOptions.length === 0 ? (
            <DropdownItem disabled className="py-2 text-muted">
              {searchTerm
                ? t("common.noResultsFound")
                : t("common.noOptionsAvailable")}
            </DropdownItem>
          ) : (
            filteredOptions.map((option) => (
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
            ))
          )}

          {hasMoreItems && (
            <DropdownItem disabled className="py-2 text-muted text-center">
              <small>
                Showing {defaultShowCount} of {options.length} items. Search to
                find more...
              </small>
            </DropdownItem>
          )}
        </DropdownMenu>
      )}
    </Dropdown>
  );
};

export default RaDropdown;

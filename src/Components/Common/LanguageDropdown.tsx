import React, { useEffect, useState } from "react";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "reactstrap";

import { get, map } from "lodash";
import { withTranslation } from "react-i18next";

//i18n
import i18n from "../../i18n";
import languages from "../../common/languages";

//img
import usflag from "../../assets/images/flags/us.jpg";

const LanguageDropdown = () => {
  const [selectedLang, setSelectedLang] = useState<string>("en");
  const [menu, setMenu] = useState<boolean>(false);

  useEffect(() => {
    const currentLanguage: any = localStorage.getItem("I18N_LANGUAGE");
    if (currentLanguage) {
      setSelectedLang(currentLanguage);
    } else {
      setSelectedLang("en"); // Default to English
      localStorage.setItem("I18N_LANGUAGE", "en");
    }
  }, []);

  const changeLanguageAction = (lang: string) => {
    try {
      //set language as i18n
      i18n.changeLanguage(lang);
      localStorage.setItem("I18N_LANGUAGE", lang);
      setSelectedLang(lang);

      // Set RTL/LTR based on language
      const dir = lang === "fa" ? "rtl" : "ltr";
      document.documentElement.dir = dir;
      document.body.dir = dir;

      // Toggle RTL-specific class for Skote template
      if (dir === "rtl") {
        document.body.classList.add("rtl");
      } else {
        document.body.classList.remove("rtl");
      }
    } catch (error) {
      console.error("Error changing language:", error);
    }
  };

  const toggle = () => {
    setMenu(!menu);
  };

  // Helper function to get flag image with fallback
  const getFlagImage = (lang: string) => {
    try {
      const flagImg = get(languages, `${lang}.flag`);
      return flagImg || null;
    } catch (error) {
      console.error("Error loading flag image:", error);
      return null;
    }
  };

  return (
    <React.Fragment>
      <Dropdown
        isOpen={menu}
        toggle={toggle}
        className="d-inline-block language-switch"
        direction="down"
      >
        <DropdownToggle className="btn header-item" tag="button">
          {getFlagImage(selectedLang) ? (
            <img
              src={getFlagImage(selectedLang)}
              alt={`${selectedLang} flag`}
              height="16"
            />
          ) : (
            <span>{get(languages, `${selectedLang}.label`)}</span>
          )}
        </DropdownToggle>
        <DropdownMenu
          className="dropdown-menu-end"
          style={{ minWidth: "150px" }}
        >
          {map(Object.keys(languages), (key) => (
            <DropdownItem
              key={key}
              onClick={() => changeLanguageAction(key)}
              className={`notify-item ${
                selectedLang === key ? "active" : "none"
              }`}
              style={{ padding: "8px 12px" }}
            >
              {getFlagImage(key) ? (
                <img
                  src={getFlagImage(key)}
                  alt={`${key} flag`}
                  className="me-1"
                  height="12"
                />
              ) : null}
              <span className="align-middle">
                {get(languages, `${key}.label`)}
              </span>
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
    </React.Fragment>
  );
};

export default withTranslation()(LanguageDropdown);

import i18n from "i18next";
import detector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import translationGr from "./locales/gr/translation.json";
import translationIT from "./locales/it/translation.json";
import translationRS from "./locales/rs/translation.json";
import translationSP from "./locales/sp/translation.json";
import translationENG from "./locales/eng/translation.json";
import translationFA from "./locales/fa/translation.json";

// the translations
const resources: any = {
  gr: {
    translation: translationGr,
    dir: 'ltr'
  },
  it: {
    translation: translationIT,
    dir: 'ltr'
  },
  rs: {
    translation: translationRS,
    dir: 'ltr'
  },
  sp: {
    translation: translationSP,
    dir: 'ltr'
  },
  eng: {
    translation: translationENG,
    dir: 'ltr'
  },
  fa: {
    translation: translationFA,
    dir: 'rtl'
  }
};

const language: any = localStorage.getItem("I18N_LANGUAGE");
if (!language) {
  localStorage.setItem("I18N_LANGUAGE", "en");
}

// Function to set document direction based on language
const setDocumentDirection = (lng: string) => {
  const dir = resources[lng]?.dir || 'ltr';
  document.documentElement.dir = dir;
  document.body.dir = dir;
  
  // Toggle RTL-specific class for Skote template
  if (dir === 'rtl') {
    document.body.classList.add('rtl');
  } else {
    document.body.classList.remove('rtl');
  }
};

i18n
  .use(detector)
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem("I18N_LANGUAGE") || "en",
    fallbackLng: "en",
    keySeparator: false,
    interpolation: {
      escapeValue: false,
    },
  });

// Set initial direction
setDocumentDirection(i18n.language);

// Listen for language changes
i18n.on('languageChanged', (lng) => {
  setDocumentDirection(lng);
});

export default i18n;
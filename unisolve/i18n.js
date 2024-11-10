import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import ko from "./lang/ko_KR.json";
import en from "./lang/en_US.json";

i18n.use(initReactI18next).init({
  compatibilityJSON: "v3",
  resources: {
    en: { translation: en },
    ko: { translation: ko },
  },
  lng: "ko",
  fallbackLng: "ko",
  interpolation: {
    escapeValue: false,
  },
});

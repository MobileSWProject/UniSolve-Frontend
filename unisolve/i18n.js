import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import ko from "./lang/ko_KR.json";
import en from "./lang/en_US.json";
import ja from "./lang/ja_JP.json";
import zh from "./lang/zh_CN.json";

i18n.use(initReactI18next).init({
  compatibilityJSON: "v3",
  resources: {
    en: { translation: en },
    ko: { translation: ko },
    ja: { translation: ja },
    zh: { translation: zh },
  },
  lng: "ko",
  fallbackLng: "ko",
  interpolation: {
    escapeValue: false,
  },
});

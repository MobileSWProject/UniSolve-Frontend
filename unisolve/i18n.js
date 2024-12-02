import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import ko from "./lang/ko_KR.json";
import en from "./lang/en_US.json";
import ja from "./lang/ja_JP.json";
import zh from "./lang/zh_CN.json";
import _axios from "./api";

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

async function getLang() {
  try {
    const response = await _axios.get("/app/language");
    return response.data.lang;
  } catch { }
}

getLang().then((lang) => { i18n.changeLanguage(lang || "ko"); })
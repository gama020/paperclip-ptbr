import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import ptBR from "./locales/pt-BR.json";

export const resources = {
  en,
  "pt-BR": ptBR,
} as const;

i18n.use(initReactI18next).init({
  resources,
  lng: "pt-BR",
  fallbackLng: "en",
  defaultNS: "translation",
  nsSeparator: ".",
  keySeparator: ".",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;

import { OauthAppProvider } from "./context/OauthApp";
import { AppTheme } from "./App.Theme";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    resources: {
      en: {
        translation: {
          "Welcome to React": "Welcome to React and react-i18next",
        },
      },
    },
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

export const App = () => {
  return (
    <OauthAppProvider>
      <AppTheme />
    </OauthAppProvider>
  );
};

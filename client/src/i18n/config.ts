import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enTranslations from './locales/en.json';
import ukTranslations from './locales/uk.json';

const savedLanguage = localStorage.getItem('appLanguage') || 'uk';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslations },
      uk: { translation: ukTranslations }
    },
    lng: savedLanguage,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

i18n.on('languageChanged', (lng) => {
  localStorage.setItem('appLanguage', lng);
});

export default i18n;
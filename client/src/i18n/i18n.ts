import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { fetchTranslations } from '../api/translations';

const loadTranslations = async (language: string) => {
  try {
    const translations = await fetchTranslations(language);
    i18n.addResourceBundle(language, 'translation', translations, true, true);
    console.log(`Translations loaded for ${language}:`, translations);
  } catch (error) {
    console.error(`Failed to load translations for ${language}:`, error);
  }
};

i18n
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    lng: 'en',
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
    resources: {
      en: { translation: {} },
      es: { translation: {} }
    },
    debug: true,
    saveMissing: true,
    missingKeyHandler: (lngs, ns, key, fallbackValue) => {
      console.warn(`Missing translation key - langs: ${lngs.join(',')}, namespace: ${ns}, key: ${key}, fallback: ${fallbackValue}`);
    }
  }, (err, t) => {
    if (err) {
      console.error('Error initializing i18n:', err);
      console.error(err.stack);
    } else {
      console.log('i18n initialized successfully');
      loadTranslations(i18n.language);
    }
  });

i18n.on('languageChanged', (lng) => {
  console.log(`Language changed to: ${lng}`);
  loadTranslations(lng);
});

i18n.on('loaded', (loaded) => {
  console.log('i18n resources loaded:', loaded);
});

i18n.on('failedLoading', (lng, ns, msg) => {
  console.error(`Failed loading translation - language: ${lng}, namespace: ${ns}, message: ${msg}`);
});

export default i18n;
const i18next = require('i18next');
const i18nextMiddleware = require('i18next-http-middleware');
const pino = require('pino')();

// Initialize i18next
i18next
  .use(i18nextMiddleware.LanguageDetector)
  .init({
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    resources: {
      en: {
        translation: require('./locales/en.json')
      },
      es: {
        translation: require('./locales/es.json') 
      }
    },
    detection: {
      // Order of language detection
      order: ['header', 'querystring', 'cookie'],
      // Look for the Accept-Language header
      lookupHeader: 'accept-language',
      // Look for ?lng= in query string
      lookupQuerystring: 'lng',
      // Look for i18next cookie
      lookupCookie: 'i18next',
      // Cache user language preference in cookie
      caches: ['cookie']
    }
  }, (err) => {
    if (err) {
      pino.error('Error initializing i18next:');
      pino.error(err);
    } else {
      pino.info('i18next initialized successfully');
    }
  });

// Handle errors
i18next.on('failedLoading', (lng, ns, msg) => {
  pino.error(`Failed to load translations - language: ${lng}, namespace: ${ns}, message: ${msg}`);
});

i18next.on('missingKey', (lng, ns, key, fallbackValue) => {
  pino.warn(`Missing translation key - language: ${lng}, namespace: ${ns}, key: ${key}, fallback: ${fallbackValue}`);
});

module.exports = i18next;
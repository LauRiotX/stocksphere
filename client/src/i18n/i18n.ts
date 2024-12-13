import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      home: 'Home',
      stockResearch: 'Stock Research',
      logout: 'Logout',
      search: 'Search',
      daily: 'Daily',
      weekly: 'Weekly',
      monthly: 'Monthly',
      addToFavorites: 'Add to Favorites',
      removeFromFavorites: 'Remove from Favorites',
      stockPerformance: 'Stock Performance',
      lastBusinessDay: 'Last Business Day',
      monthlyAverage: 'Monthly Average',
      stockCode: 'Stock Code',
      'Close Price': 'Close Price',
      'Open Price': 'Open Price',
      'High Price': 'High Price',
      'Low Price': 'Low Price',
      'Volume': 'Volume',
      'Dividend Amount': 'Dividend Amount',
      open: 'Open',
      high: 'High',
      low: 'Low',
      close: 'Close',
      volume: 'Volume',
      dividend: 'Dividend',
    },
  },
  es: {
    translation: {
      home: 'Inicio',
      stockResearch: 'Investigación de Acciones',
      logout: 'Cerrar Sesión',
      search: 'Buscar',
      daily: 'Diario',
      weekly: 'Semanal',
      monthly: 'Mensual',
      addToFavorites: 'Añadir a Favoritos',
      removeFromFavorites: 'Eliminar de Favoritos',
      stockPerformance: 'Rendimiento de Acciones',
      lastBusinessDay: 'Último Día Hábil',
      monthlyAverage: 'Promedio Mensual',
      stockCode: 'Código de Acción',
      'Close Price': 'Precio de Cierre',
      'Open Price': 'Precio de Apertura',
      'High Price': 'Precio Máximo',
      'Low Price': 'Precio Mínimo',
      'Volume': 'Volumen',
      'Dividend Amount': 'Monto del Dividendo',
      open: 'Apertura',
      high: 'Alto',
      low: 'Bajo',
      close: 'Cierre',
      volume: 'Volumen',
      dividend: 'Dividendo',
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
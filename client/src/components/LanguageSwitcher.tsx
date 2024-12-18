import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Languages } from 'lucide-react';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const [, updateState] = useState({});

  useEffect(() => {
    const handleLanguageChange = () => {
      console.log('Language changed to:', i18n.language);
      updateState({}); // Force re-render
    };

    i18n.on('languageChanged', handleLanguageChange);

    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);

  const toggleLanguage = async () => {
    try {
      const newLang = i18n.language === 'en' ? 'es' : 'en';
      console.log(`Attempting to change language to: ${newLang}`);
      await i18n.changeLanguage(newLang);
      console.log(`Language successfully changed to ${newLang}`);
      console.log('Translation test - home:', i18n.t('home'));
    } catch (error) {
      console.error('Error changing language:', error);
      console.error('Error stack:', error.stack);
    }
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center justify-center p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      aria-label={i18n.language === 'en' ? 'Switch to Spanish' : 'Switch to English'}
    >
      <Languages className="w-5 h-5" />
      <span className="ml-2 text-sm">
        {i18n.language === 'en' ? 'ES' : 'EN'}
      </span>
    </button>
  );
};

export default LanguageSwitcher;
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const SomeComponent: React.FC = () => {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    console.log('SomeComponent re-rendered. Current language:', i18n.language);
    console.log('Sample translated text:', {
      home: t('home'),
      search: t('search'),
      stockResearch: t('stockResearch')
    });
  }, [t, i18n.language]);

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-2">{t('home')}</h2>
      <p className="mb-2">{t('search')}</p>
      <p>{t('stockResearch')}</p>
    </div>
  );
};

export default SomeComponent;
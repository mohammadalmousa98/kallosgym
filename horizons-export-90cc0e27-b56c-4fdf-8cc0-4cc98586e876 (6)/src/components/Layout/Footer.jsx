import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useData } from '@/contexts/DataContext';

const Footer = () => {
  const { language, t } = useLanguage();
  const { generalContent } = useData();

  return (
    <footer className="bg-gray-900 border-t border-gray-800 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <div className="mb-4">
            {generalContent?.logo_url ? (
              <img src={generalContent.logo_url} alt="Kallos Logo" className="h-8 w-auto mx-auto" />
            ) : (
              <span className="text-2xl font-bold" style={{ color: 'var(--primary)' }}>
                {generalContent?.logo_text || 'Kallos'}
              </span>
            )}
          </div>
          <p className="text-gray-400 text-sm">
            {generalContent?.footer_text?.[language] || t('footerText')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
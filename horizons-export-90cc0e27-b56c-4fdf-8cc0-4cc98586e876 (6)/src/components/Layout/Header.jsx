import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Globe } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useData } from '@/contexts/DataContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { language, toggleLanguage, t } = useLanguage();
  const location = useLocation();
  const { generalContent } = useData();

  const navigation = [
    { name: t('home'), href: '/' },
    { name: t('about'), href: '/about' },
    { name:t('coaches'), href: '/coaches' },
    { name: t('schedule'), href: '/schedule' },
    { name: t('contact'), href: '/contact' }
  ];

  const isActive = (href) => location.pathname === href;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center">
            {generalContent?.logo_url ? (
              <img src={generalContent.logo_url} alt="Kallos Logo" className="h-8 w-auto" />
            ) : (
              <span className="text-2xl font-bold" style={{ color: 'var(--primary)' }}>
                {generalContent?.logo_text || 'Kallos'}
              </span>
            )}
          </Link>

          <nav className="hidden md:flex items-center" style={{ gap: '2rem' }}>
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-medium transition-colors`}
                style={{
                  color: isActive(item.href) ? 'var(--primary)' : '#E5E7EB',
                  ['--hover-color']: 'var(--primary)'
                }}
                onMouseOver={e => e.currentTarget.style.color = 'var(--hover-color)'}
                onMouseOut={e => e.currentTarget.style.color = isActive(item.href) ? 'var(--primary)' : '#E5E7EB'}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <button
              onClick={toggleLanguage}
              className="language-switcher flex items-center space-x-2 rtl:space-x-reverse"
              title="Switch Language"
            >
              <Globe size={16} />
              <span className="text-sm font-medium">
                {language === 'en' ? 'العربية' : 'English'}
              </span>
            </button>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-800">
            <nav className="flex flex-col space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block text-sm font-medium transition-colors`}
                  style={{ color: isActive(item.href) ? 'var(--primary)' : '#E5E7EB' }}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('kallos-language') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('kallos-language', language);
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ar' : 'en');
  };

  const translations = {
    en: {
      // Navigation
      home: 'Home',
      about: 'About',
      coaches: 'Coaches',
      schedule: 'Schedule',
      contact: 'Contact',
      
      // Common
      learnMore: 'Learn More',
      getStarted: 'Get Started',
      joinNow: 'Join Now',
      contactUs: 'Contact Us',
      
      // Homepage
      heroTitle: 'Transform Your Body with Calisthenics',
      heroSubtitle: 'Join Qatar\'s premier calisthenics gym and unlock your true potential with bodyweight training',
      ctaTitle: 'Ready to Transform Your Body?',
      ctaSubtitle: 'Join hundreds of members who have already transformed their lives with calisthenics training.',
      
      // Features
      featuresTitle: 'Why Choose Kallos?',
      
      // Testimonials
      testimonialsTitle: 'What Our Members Say',
      
      // Footer
      footerText: '© 2025 Kallos Calisthenics Gym. All rights reserved.',
      
      // About
      aboutTitle: 'About Kallos',
      
      // Coaches
      coachesTitle: 'Meet Our Expert Coaches',
      
      // Schedule
      scheduleTitle: 'Weekly Schedule',
      
      // Contact
      contactTitle: 'Get in Touch',
      
      // Days
      saturday: 'Saturday',
      sunday: 'Sunday',
      monday: 'Monday',
      tuesday: 'Tuesday',
      wednesday: 'Wednesday',
      thursday: 'Thursday',
      friday: 'Friday'
    },
    ar: {
      // Navigation
      home: 'الرئيسية',
      about: 'من نحن',
      coaches: 'المدربين',
      schedule: 'الجدول',
      contact: 'اتصل بنا',
      
      // Common
      learnMore: 'اعرف المزيد',
      getStarted: 'ابدأ الآن',
      joinNow: 'انضم الآن',
      contactUs: 'اتصل بنا',
      
      // Homepage
      heroTitle: 'حوّل جسمك مع الكاليسثينيكس',
      heroSubtitle: 'انضم إلى أفضل صالة كاليسثينيكس في قطر واكتشف إمكاناتك الحقيقية مع تدريب وزن الجسم',
      ctaTitle: 'هل أنت مستعد لتغيير جسدك؟',
      ctaSubtitle: 'انضم إلى مئات الأعضاء الذين غيروا حياتهم بالفعل من خلال تدريب الكاليسثينيكس.',

      // Features
      featuresTitle: 'لماذا تختار كالوس؟',
      
      // Testimonials
      testimonialsTitle: 'ماذا يقول أعضاؤنا',
      
      // Footer
      footerText: '© 2025 صالة كالوس للكاليسثينيكس. جميع الحقوق محفوظة.',
      
      // About
      aboutTitle: 'عن كالوس',
      
      // Coaches
      coachesTitle: 'تعرف على مدربينا الخبراء',
      
      // Schedule
      scheduleTitle: 'الجدول الأسبوعي',
      
      // Contact
      contactTitle: 'تواصل معنا',
      
      // Days
      saturday: 'السبت',
      sunday: 'الأحد',
      monday: 'الاثنين',
      tuesday: 'الثلاثاء',
      wednesday: 'الأربعاء',
      thursday: 'الخميس',
      friday: 'الجمعة'
    }
  };

  const t = (key) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import ScrollAnimation from '@/components/ScrollAnimation';
import { useLanguage } from '@/contexts/LanguageContext';
import { useData } from '@/contexts/DataContext';
import { motion } from 'framer-motion';

const CoachesPage = () => {
  const { language, t } = useLanguage();
  const { coaches, loading } = useData();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-900">Loading...</div>;
  }

  return (
    <>
      <Helmet>
        <title>{t('coachesTitle')} - Kallos Calisthenics Gym</title>
        <meta name="description" content="Meet our expert calisthenics coaches at Kallos. Certified professionals dedicated to helping you achieve your fitness goals." />
      </Helmet>

      <Header />

      <main className="pt-16">
        {/* Hero Section */}
        <section className="section-padding" style={{ backgroundColor: 'var(--primary)' }}>
          <div className="container mx-auto px-4 text-center">
            <ScrollAnimation>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
                {t('coachesTitle')}
              </h1>
            </ScrollAnimation>
            
            <ScrollAnimation delay={200}>
              <p className="text-xl max-w-3xl mx-auto text-gray-200">
                {language === 'en' 
                  ? 'Our team of certified professionals is dedicated to helping you achieve your fitness goals through expert guidance and personalized training.'
                  : 'فريقنا من المحترفين المعتمدين مكرس لمساعدتك في تحقيق أهدافك في اللياقة البدنية من خلال التوجيه الخبير والتدريب الشخصي.'
                }
              </p>
            </ScrollAnimation>
          </div>
        </section>

        {/* Coaches Section */}
        <section className="section-padding">
          <div className="container mx-auto px-4">
            <div className="coach-grid">
              {coaches.map((coach, index) => (
                <ScrollAnimation key={coach.id} delay={index * 100}>
                  <div className="coach-card card">
                    <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
                      {coach.image_url ? (
                        <img 
                          src={coach.image_url} 
                          alt={coach.name?.[language] || coach.name?.en || 'Coach'}
                          className="coach-image"
                        />
                      ) : (
                        <div className="coach-image bg-gray-700" />
                      )}
                    </motion.div>
                    
                    <h3 className="coach-name">{coach.name?.[language] || coach.name?.en}</h3>
                    <p className="coach-bio">
                      {coach.bio[language] || coach.bio.en}
                    </p>
                  </div>
                </ScrollAnimation>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section-padding bg-gray-800">
          <div className="container mx-auto px-4 text-center">
            <ScrollAnimation>
              <h2 className="text-4xl font-bold mb-6">
                {language === 'en' ? 'Ready to Train with Our Experts?' : 'مستعد للتدريب مع خبرائنا؟'}
              </h2>
            </ScrollAnimation>
            
            <ScrollAnimation delay={200}>
              <p className="text-xl mb-8 max-w-2xl mx-auto text-gray-300">
                {language === 'en'
                  ? 'Book a consultation with one of our certified coaches and start your transformation journey today.'
                  : 'احجز استشارة مع أحد مدربينا المعتمدين وابدأ رحلة التحول اليوم.'
                }
              </p>
            </ScrollAnimation>
            
            <ScrollAnimation delay={400}>
              <Link to="/contact" className="btn-primary">
                {t('contactUs')}
              </Link>
            </ScrollAnimation>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default CoachesPage;
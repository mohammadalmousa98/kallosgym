import React from 'react';
import { Helmet } from 'react-helmet';
import { Star } from 'lucide-react';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import ScrollAnimation from '@/components/ScrollAnimation';
import { useLanguage } from '@/contexts/LanguageContext';
import { useData } from '@/contexts/DataContext';
import { motion } from 'framer-motion';
import SmartLink from '@/components/SmartLink';

const HomePage = () => {
  const { language, t } = useLanguage();
  const { generalContent, features, testimonials, loading } = useData();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-900">Loading...</div>;
  }

  const ctaTitle = generalContent?.cta_title?.[language] || t('ctaTitle');
  const ctaSubtitle = generalContent?.cta_subtitle?.[language] || t('ctaSubtitle');

  return (
    <>
      <Helmet>
        <title>Kallos Calisthenics Gym - Transform Your Body with Bodyweight Training</title>
        <meta name="description" content="Join Qatar's premier calisthenics gym. Expert training, professional coaches, and state-of-the-art facilities for all fitness levels." />
      </Helmet>

      <Header />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center hero-gradient">
        <div className="absolute inset-0 bg-black/50"></div>
        
        {/* Hero Media */}
        {generalContent?.hero_media_url && (
          <motion.div 
            className="absolute inset-0"
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          >
            {generalContent.hero_media_type === 'video' ? (
              <video
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
                src={generalContent.hero_media_url}
              />
            ) : (
              <img
                className="w-full h-full object-cover"
                alt="Kallos Calisthenics Gym Hero"
                src={generalContent.hero_media_url} />
            )}
          </motion.div>
        )}

        <div className="relative z-10 container mx-auto px-4 text-center">
          <ScrollAnimation>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-white shadow-lg">
              {t('heroTitle')}
            </h1>
          </ScrollAnimation>
          
          <ScrollAnimation delay={200}>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-gray-200">
              {t('heroSubtitle')}
            </p>
          </ScrollAnimation>
          
          <ScrollAnimation delay={400}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <SmartLink to="/contact" className="btn-primary">
                {t('joinNow')}
              </SmartLink>
              <SmartLink to="/about" className="btn-secondary">
                {t('learnMore')}
              </SmartLink>
            </div>
          </ScrollAnimation>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-gray-800">
        <div className="container mx-auto px-4">
          <ScrollAnimation>
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
              {t('featuresTitle')}
            </h2>
          </ScrollAnimation>
          
          <div className="feature-grid">
            {features.map((feature, index) => (
              <ScrollAnimation key={feature.id} delay={index * 100}>
                <div className="feature-card card">
                  <div className="feature-icon">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-4">
                    {feature.title?.[language] || feature.title?.en}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {feature.description?.[language] || feature.description?.en}
                  </p>
                </div>
              </ScrollAnimation>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      {testimonials.length > 0 && (
        <section className="section-padding">
          <div className="container mx-auto px-4">
            <ScrollAnimation>
              <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
                {t('testimonialsTitle')}
              </h2>
            </ScrollAnimation>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <ScrollAnimation key={testimonial.id} delay={index * 100}>
                  <div className="testimonial-card">
                    <div className="flex justify-center mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="testimonial-quote">
                      {testimonial.quote[language] || testimonial.quote.en}
                    </p>
                    <p className="testimonial-author">
                      {testimonial.name}
                    </p>
                  </div>
                </ScrollAnimation>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="section-padding" style={{ backgroundColor: 'var(--primary)' }}>
        <div className="container mx-auto px-4 text-center">
          <ScrollAnimation>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              {ctaTitle}
            </h2>
          </ScrollAnimation>
          
          <ScrollAnimation delay={200}>
            <p className="text-xl mb-8 max-w-2xl mx-auto text-gray-100">
               {ctaSubtitle}
            </p>
          </ScrollAnimation>
          
          <ScrollAnimation delay={400}>
            <SmartLink to="/contact" className="btn-primary bg-white text-blue-600 hover:bg-gray-100">
              {t('getStarted')}
            </SmartLink>
          </ScrollAnimation>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default HomePage;
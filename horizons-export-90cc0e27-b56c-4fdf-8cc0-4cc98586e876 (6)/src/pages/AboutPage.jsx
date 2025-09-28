import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import ScrollAnimation from '@/components/ScrollAnimation';
import { useLanguage } from '@/contexts/LanguageContext';
import { useData } from '@/contexts/DataContext';

const AboutPage = () => {
  const { language, t } = useLanguage();
  const { pages, valuesData, achievements, loading } = useData();
  const pageContent = pages['about'];

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-900">Loading...</div>;
  }

  return (
    <>
      <Helmet>
        <title>{t('aboutTitle')} - Kallos Calisthenics Gym</title>
        <meta name="description" content="Learn about Kallos, Qatar's premier calisthenics gym. Our mission, values, and commitment to your fitness journey." />
      </Helmet>

      <Header />

      <main className="pt-16">
        {/* Hero Section */}
        <section className="section-padding" style={{ backgroundColor: 'var(--primary)' }}>
          <div className="container mx-auto px-4 text-center">
            <ScrollAnimation>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
                {pageContent?.title?.[language] || t('aboutTitle')}
              </h1>
            </ScrollAnimation>
            
            <ScrollAnimation delay={200}>
              <p className="text-xl max-w-3xl mx-auto text-gray-200">
                {language === 'en' 
                  ? 'Discover the philosophy behind Kallos and our commitment to building a stronger, healthier community through the art of calisthenics.'
                  : 'اكتشف الفلسفة وراء كالوس والتزامنا ببناء مجتمع أقوى وأكثر صحة من خلال فن الكاليسثينيكس.'
                }
              </p>
            </ScrollAnimation>
          </div>
        </section>

        {/* About Content Section */}
        <section className="section-padding">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <ScrollAnimation>
                <div className="prose prose-invert max-w-none text-gray-300 text-lg leading-relaxed">
                  <p>{pageContent?.content?.[language] || 'Loading content...'}</p>
                </div>
              </ScrollAnimation>
              
              <ScrollAnimation delay={200}>
                {pageContent?.image_url ? (
                  <img 
                    src={pageContent.image_url} 
                    alt="Kallos Gym Interior"
                    className="rounded-lg shadow-2xl w-full h-auto object-cover"
                  />
                ) : (
                  <div className="rounded-lg shadow-2xl w-full h-96 bg-gray-800" />
                )}
              </ScrollAnimation>
            </div>
          </div>
        </section>

        {/* Values Section */}
        {valuesData && valuesData.length > 0 && (
          <section className="section-padding bg-gray-800">
            <div className="container mx-auto px-4">
              <ScrollAnimation>
                <h2 className="text-4xl font-bold text-center mb-12">
                  {language === 'en' ? 'Our Core Values' : 'قيمنا الأساسية'}
                </h2>
              </ScrollAnimation>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {valuesData.map((value, index) => (
                  <ScrollAnimation key={value.id} delay={index * 100}>
                    <div className="card text-center">
                      <div className="feature-icon">
                        {value.icon}
                      </div>
                      <h3 className="text-2xl font-bold mb-4" style={{ color: 'var(--primary)' }}>
                        {value.title?.[language] || value.title?.en}
                      </h3>
                      <p className="text-gray-400">
                        {value.description?.[language] || value.description?.en}
                      </p>
                    </div>
                  </ScrollAnimation>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Achievements Section */}
        {achievements && achievements.length > 0 && (
          <section className="section-padding">
            <div className="container mx-auto px-4">
              <ScrollAnimation>
                <h2 className="text-4xl font-bold text-center mb-12">
                  {language === 'en' ? 'Our Achievements' : 'إنجازاتنا'}
                </h2>
              </ScrollAnimation>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {achievements.map((achievement, index) => (
                  <ScrollAnimation key={achievement.id} delay={index * 100}>
                    <div className="card text-center">
                      <div className="feature-icon">
                        {achievement.icon}
                      </div>
                      <h3 className="text-2xl font-bold mb-4" style={{ color: 'var(--primary)' }}>
                        {achievement.title?.[language] || achievement.title?.en}
                      </h3>
                      <p className="text-gray-400">
                        {achievement.description?.[language] || achievement.description?.en}
                      </p>
                    </div>
                  </ScrollAnimation>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="section-padding bg-gray-900">
          <div className="container mx-auto px-4 text-center">
            <ScrollAnimation>
              <h2 className="text-4xl font-bold mb-6">
                {language === 'en' ? 'Ready to Join Our Community?' : 'مستعد للانضمام إلى مجتمعنا؟'}
              </h2>
            </ScrollAnimation>
            
            <ScrollAnimation delay={200}>
              <p className="text-xl mb-8 max-w-2xl mx-auto text-gray-300">
                {language === 'en'
                  ? 'Become a part of the Kallos family and start your journey towards strength, discipline, and excellence.'
                  : 'كن جزءًا من عائلة كالوس وابدأ رحلتك نحو القوة والانضباط والتميز.'
                }
              </p>
            </ScrollAnimation>
            
            <ScrollAnimation delay={400}>
              <Link to="/contact" className="btn-primary">
                {t('joinNow')}
              </Link>
            </ScrollAnimation>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default AboutPage;
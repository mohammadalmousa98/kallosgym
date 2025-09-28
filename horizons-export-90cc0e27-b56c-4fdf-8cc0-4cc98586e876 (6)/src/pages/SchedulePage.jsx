
import React from 'react';
import { Helmet } from 'react-helmet';
import { Clock, User, Smile } from 'lucide-react';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import ScrollAnimation from '@/components/ScrollAnimation';
import { useLanguage } from '@/contexts/LanguageContext';
import { useData } from '@/contexts/DataContext';
import { motion } from 'framer-motion';

const SchedulePage = () => {
  const { language, t } = useLanguage();
  const { schedule, loading } = useData();

  const days = ['saturday', 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday'];

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-900">Loading...</div>;
  }

  const renderClasses = (classes, type) => {
    if (!classes || classes.length === 0) {
      return (
        <p className="text-gray-400">
          {language === 'en' ? 'No classes scheduled' : 'لا توجد فصول مجدولة'}
        </p>
      );
    }
    return (
      <div className="space-y-3">
        {classes.map((classItem, classIndex) => (
          <motion.div 
            key={classIndex} 
            className="class-item"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: classIndex * 0.1 }}
          >
            <div className="flex items-center">
              <Clock className="w-5 h-5 mr-3 flex-shrink-0" style={{ color: 'var(--primary)' }} />
              <span className="font-medium">{classItem[language] || classItem.en}</span>
            </div>
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <>
      <Helmet>
        <title>{t('scheduleTitle')} - Kallos Calisthenics Gym</title>
        <meta name="description" content="Check out our weekly calisthenics training schedule. Classes for all levels from beginner to advanced." />
      </Helmet>

      <Header />

      <main className="pt-16">
        {/* Hero Section */}
        <section className="section-padding" style={{ backgroundColor: 'var(--primary)' }}>
          <div className="container mx-auto px-4 text-center">
            <ScrollAnimation>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
                {t('scheduleTitle')}
              </h1>
            </ScrollAnimation>
            
            <ScrollAnimation delay={200}>
              <p className="text-xl max-w-3xl mx-auto text-gray-200">
                {language === 'en' 
                  ? 'Find the perfect class for your schedule and fitness level. All classes are led by our certified instructors.'
                  : 'اعثر على الفصل المثالي لجدولك الزمني ومستوى لياقتك البدنية. جميع الفصول يقودها مدربونا المعتمدون.'
                }
              </p>
            </ScrollAnimation>
          </div>
        </section>

        {/* Schedule Section */}
        <section className="section-padding">
          <div className="container mx-auto px-4">
            <div className="space-y-16">
              {days.map((day, index) => (
                <ScrollAnimation key={day} delay={index * 100}>
                  <div className="grid lg:grid-cols-2 gap-8 items-stretch">
                    <div className={`lg:col-span-1 ${index % 2 === 0 ? 'lg:order-1' : 'lg:order-2'}`}>
                      {schedule[day]?.image_url ? (
                        <motion.div 
                          className="overflow-hidden rounded-lg h-full"
                          whileHover={{ scale: 1.03 }}
                          transition={{ duration: 0.4 }}
                        >
                            <img 
                              src={schedule[day].image_url} 
                              alt={`${t(day)} training`}
                              className="rounded-lg w-full h-full object-cover min-h-[300px]"
                            />
                        </motion.div>
                      ) : (
                        <div className="rounded-lg w-full h-full bg-gray-800 min-h-[300px]" />
                      )}
                    </div>
                    <div className={`lg:col-span-1 flex flex-col justify-center ${index % 2 === 0 ? 'lg:order-2' : 'lg:order-1'}`}>
                      <div className="schedule-day">
                        <h3 className="text-3xl font-bold mb-6" style={{ color: 'var(--primary)' }}>
                          {t(day)}
                        </h3>
                        
                        <div className="space-y-8">
                          <div>
                            <h4 className="flex items-center text-2xl font-semibold mb-4">
                              <User className="w-6 h-6 mr-3" style={{ color: 'var(--primary)' }} />
                              {language === 'en' ? 'Adults' : 'الكبار'}
                            </h4>
                            {renderClasses(schedule[day]?.classes, 'adults')}
                          </div>
                          
                          {(schedule[day]?.kids_classes?.length > 0) && (
                            <div>
                              <h4 className="flex items-center text-2xl font-semibold mb-4">
                                <Smile className="w-6 h-6 mr-3" style={{ color: 'var(--primary)' }} />
                                {language === 'en' ? 'Kids' : 'الأطفال'}
                              </h4>
                              {renderClasses(schedule[day]?.kids_classes, 'kids')}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </ScrollAnimation>
              ))}
            </div>
          </div>
        </section>

        {/* Info Section */}
        <section className="section-padding bg-gray-800">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12">
              <ScrollAnimation>
                <div>
                  <h2 className="text-3xl font-bold mb-6" style={{ color: 'var(--primary)' }}>
                    {language === 'en' ? 'Class Information' : 'معلومات الفصول'}
                  </h2>
                  <ul className="space-y-4 text-gray-300">
                    <li className="flex items-start">
                      <span className="mr-3" style={{ color: 'var(--primary)' }}>•</span>
                      {language === 'en' 
                        ? 'All classes are 60 minutes long'
                        : 'جميع الفصول مدتها 60 دقيقة'
                      }
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3" style={{ color: 'var(--primary)' }}>•</span>
                      {language === 'en' 
                        ? 'Equipment is provided for all sessions'
                        : 'يتم توفير المعدات لجميع الجلسات'
                      }
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3" style={{ color: 'var(--primary)' }}>•</span>
                      {language === 'en' 
                        ? 'Advance booking is recommended'
                        : 'يُنصح بالحجز المسبق'
                      }
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3" style={{ color: 'var(--primary)' }}>•</span>
                      {language === 'en' 
                        ? 'First class is free for new members'
                        : 'الفصل الأول مجاني للأعضاء الجدد'
                      }
                    </li>
                  </ul>
                </div>
              </ScrollAnimation>
              
              <ScrollAnimation delay={200}>
                <div>
                  <h2 className="text-3xl font-bold mb-6" style={{ color: 'var(--primary)' }}>
                    {language === 'en' ? 'Class Levels' : 'مستويات الفصول'}
                  </h2>
                  <div className="space-y-4">
                    <div className="card">
                      <h4 className="font-bold text-green-400 mb-2">
                        {language === 'en' ? 'Beginner' : 'مبتدئ'}
                      </h4>
                      <p className="text-gray-400 text-sm">
                        {language === 'en' 
                          ? 'Perfect for those new to calisthenics'
                          : 'مثالي للمبتدئين في الكاليسثينيكس'
                        }
                      </p>
                    </div>
                    <div className="card">
                      <h4 className="font-bold text-yellow-400 mb-2">
                        {language === 'en' ? 'Intermediate' : 'متوسط'}
                      </h4>
                      <p className="text-gray-400 text-sm">
                        {language === 'en' 
                          ? 'For those with basic movement experience'
                          : 'لمن لديهم خبرة أساسية في الحركات'
                        }
                      </p>
                    </div>
                    <div className="card">
                      <h4 className="font-bold text-red-400 mb-2">
                        {language === 'en' ? 'Advanced' : 'متقدم'}
                      </h4>
                      <p className="text-gray-400 text-sm">
                        {language === 'en' 
                          ? 'For experienced practitioners'
                          : 'للممارسين ذوي الخبرة'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </ScrollAnimation>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default SchedulePage;

import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import ScrollAnimation from '@/components/ScrollAnimation';
import { useLanguage } from '@/contexts/LanguageContext';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';

const ContactPage = () => {
  const { language, t } = useLanguage();
  const { toast } = useToast();
  const { pages, loading } = useData();
  const pageContent = pages['contact'];
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('messages').insert([formData]);

    if (error) {
      toast({
        variant: 'destructive',
        title: language === 'en' ? 'Error' : 'خطأ',
        description: language === 'en' 
          ? 'Could not send message. Please try again.'
          : 'لم نتمكن من إرسال الرسالة. يرجى المحاولة مرة أخرى.'
      });
    } else {
      toast({
        title: language === 'en' ? 'Message Sent!' : 'تم إرسال الرسالة!',
        description: language === 'en' 
          ? 'Thank you for your message. We\'ll get back to you soon!'
          : 'شكراً لرسالتك. سنتواصل معك قريباً!'
      });
      setFormData({ name: '', email: '', phone: '', message: '' });
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-900">Loading...</div>;
  }

  return (
    <>
      <Helmet>
        <title>{t('contactTitle')} - Kallos Calisthenics Gym</title>
        <meta name="description" content="Get in touch with Kallos Calisthenics Gym. Visit us, call us, or send us a message to start your fitness journey." />
      </Helmet>

      <Header />

      <main className="pt-16">
        {/* Hero Section */}
        <section className="section-padding" style={{ backgroundColor: 'var(--primary)' }}>
          <div className="container mx-auto px-4 text-center">
            <ScrollAnimation>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
                {t('contactTitle')}
              </h1>
            </ScrollAnimation>
            
            <ScrollAnimation delay={200}>
              <p className="text-xl max-w-3xl mx-auto text-gray-200">
                {language === 'en' 
                  ? 'Ready to start your calisthenics journey? Get in touch with us today and take the first step towards transforming your body and mind.'
                  : 'مستعد لبدء رحلة الكاليسثينيكس؟ تواصل معنا اليوم واتخذ الخطوة الأولى نحو تحويل جسمك وعقلك.'
                }
              </p>
            </ScrollAnimation>
          </div>
        </section>

        {/* Contact Section */}
        <section className="section-padding">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <ScrollAnimation>
                <div className="card">
                  <h2 className="text-3xl font-bold mb-6" style={{ color: 'var(--primary)' }}>
                    {language === 'en' ? 'Send us a Message' : 'أرسل لنا رسالة'}
                  </h2>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {language === 'en' ? 'Full Name' : 'الاسم الكامل'}
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="admin-input"
                        placeholder={language === 'en' ? 'Enter your full name' : 'أدخل اسمك الكامل'}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {language === 'en' ? 'Email Address' : 'عنوان البريد الإلكتروني'}
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="admin-input"
                        placeholder={language === 'en' ? 'Enter your email' : 'أدخل بريدك الإلكتروني'}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {language === 'en' ? 'Phone Number' : 'رقم الهاتف'}
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="admin-input"
                        placeholder={language === 'en' ? 'Enter your phone number' : 'أدخل رقم هاتفك'}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {language === 'en' ? 'Message' : 'الرسالة'}
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        className="admin-textarea"
                        placeholder={language === 'en' ? 'Tell us about your fitness goals...' : 'أخبرنا عن أهدافك في اللياقة البدنية...'}
                      />
                    </div>
                    
                    <button type="submit" className="btn-primary w-full">
                      {language === 'en' ? 'Send Message' : 'إرسال الرسالة'}
                    </button>
                  </form>
                </div>
              </ScrollAnimation>

              {/* Contact Info */}
              <ScrollAnimation delay={200}>
                <div>
                  <h2 className="text-3xl font-bold mb-6" style={{ color: 'var(--primary)' }}>
                    {language === 'en' ? 'Visit Our Gym' : 'زر صالتنا الرياضية'}
                  </h2>
                  
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4 rtl:space-x-reverse">
                      <MapPin className="w-6 h-6 mt-1 flex-shrink-0" style={{ color: 'var(--primary)' }} />
                      <div>
                        <h3 className="font-bold mb-2">
                          {language === 'en' ? 'Address' : 'العنوان'}
                        </h3>
                        <p className="text-gray-400">
                          {language === 'en' 
                            ? 'West Bay, Doha, Qatar'
                            : 'الخليج الغربي، الدوحة، قطر'
                          }
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4 rtl:space-x-reverse">
                      <Phone className="w-6 h-6 mt-1 flex-shrink-0" style={{ color: 'var(--primary)' }} />
                      <div>
                        <h3 className="font-bold mb-2">
                          {language === 'en' ? 'Phone' : 'الهاتف'}
                        </h3>
                        <p className="text-gray-400">+974 1234 5678</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4 rtl:space-x-reverse">
                      <Mail className="w-6 h-6 mt-1 flex-shrink-0" style={{ color: 'var(--primary)' }} />
                      <div>
                        <h3 className="font-bold mb-2">
                          {language === 'en' ? 'Email' : 'البريد الإلكتروني'}
                        </h3>
                        <p className="text-gray-400">info@kallos-gym.com</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4 rtl:space-x-reverse">
                      <Clock className="w-6 h-6 mt-1 flex-shrink-0" style={{ color: 'var(--primary)' }} />
                      <div>
                        <h3 className="font-bold mb-2">
                          {language === 'en' ? 'Opening Hours' : 'ساعات العمل'}
                        </h3>
                        <div className="text-gray-400 space-y-1">
                          <p>
                            {language === 'en' ? 'Saturday - Thursday: 6:00 AM - 10:00 PM' : 'السبت - الخميس: 6:00 ص - 10:00 م'}
                          </p>
                          <p>
                            {language === 'en' ? 'Friday: 8:00 AM - 8:00 PM' : 'الجمعة: 8:00 ص - 8:00 م'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Map */}
                  <div className="mt-8">
                    <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--primary)' }}>
                      {language === 'en' ? 'Find Us' : 'اعثر علينا'}
                    </h3>
                    {pageContent?.map_url ? (
                      <iframe
                        src={pageContent.map_url}
                        width="100%"
                        height="300"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        className="rounded-lg"
                      />
                    ) : (
                      <div className="bg-gray-700 rounded-lg h-64 flex items-center justify-center">
                        <p className="text-gray-400">
                          {language === 'en' ? 'Map will be displayed here' : 'ستظهر الخريطة هنا'}
                        </p>
                      </div>
                    )}
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

export default ContactPage;
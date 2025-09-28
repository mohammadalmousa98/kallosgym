import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import HomePage from '@/pages/HomePage';
import AboutPage from '@/pages/AboutPage';
import CoachesPage from '@/pages/CoachesPage';
import SchedulePage from '@/pages/SchedulePage';
import ContactPage from '@/pages/ContactPage';
import AdminPage from '@/pages/AdminPage';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { Toaster } from '@/components/ui/toaster';
import { DataProvider } from '@/contexts/DataContext';

function App() {
  return (
    <LanguageProvider>
      <DataProvider>
        <div className="min-h-screen">
          <Helmet>
            <title>Kallos Calisthenics Gym - Premium Fitness in Qatar</title>
            <meta name="description" content="Join Kallos, Qatar's premier calisthenics gym. Professional training, expert coaches, and state-of-the-art facilities for all fitness levels." />
            <meta name="keywords" content="calisthenics, gym, fitness, Qatar, training, bodyweight, strength" />
            <meta property="og:title" content="Kallos Calisthenics Gym - Premium Fitness in Qatar" />
            <meta property="og:description" content="Join Kallos, Qatar's premier calisthenics gym. Professional training, expert coaches, and state-of-the-art facilities for all fitness levels." />
            <meta property="og:type" content="website" />
            <link rel="canonical" href="https://kallos-gym.com" />
          </Helmet>
          
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/coaches" element={<CoachesPage />} />
            <Route path="/schedule" element={<SchedulePage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
          
          <Toaster />
        </div>
      </DataProvider>
    </LanguageProvider>
  );
}

export default App;
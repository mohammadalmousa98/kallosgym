// Firebase configuration and services
// Note: This is a template. Users need to replace with their actual Firebase config

const firebaseConfig = {
  // Replace with your Firebase config
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};

// Uncomment and configure when Firebase is set up
/*
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth, signInAnonymously } from 'firebase/auth';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);

// Enable anonymous authentication for CMS
signInAnonymously(auth).catch(console.error);
*/

// Mock data service for development
export const mockDataService = {
  // General content
  getGeneralContent: () => {
    const stored = localStorage.getItem('kallos-general-content');
    return stored ? JSON.parse(stored) : {
      logo: 'Kallos', // Default text logo
      logoUrl: 'https://horizons-cdn.hostinger.com/90cc0e27-b56c-4fdf-8cc0-4cc98586e876/55f44a9122123d46c8311256ee14d551.jpg', // New default image logo
      heroMediaType: 'image',
      heroMediaUrl: '',
      joinNowLink: '#contact',
      learnMoreLink: '#about',
      footerText: {
        en: '© 2024 Kallos Calisthenics Gym. All rights reserved.',
        ar: '© 2024 صالة كالوس للكاليسثينيكس. جميع الحقوق محفوظة.'
      }
    };
  },
  
  saveGeneralContent: (content) => {
    localStorage.setItem('kallos-general-content', JSON.stringify(content));
  },

  // Page content
  getPageContent: (page) => {
    const stored = localStorage.getItem(`kallos-page-${page}`);
    return stored ? JSON.parse(stored) : {
      title: { en: '', ar: '' },
      content: { en: '', ar: '' },
      imageUrl: '',
      mapUrl: ''
    };
  },
  
  savePageContent: (page, content) => {
    localStorage.setItem(`kallos-page-${page}`, JSON.stringify(content));
  },

  // Coaches
  getCoaches: () => {
    const stored = localStorage.getItem('kallos-coaches');
    return stored ? JSON.parse(stored) : [];
  },
  
  saveCoaches: (coaches) => {
    localStorage.setItem('kallos-coaches', JSON.stringify(coaches));
  },

  // Schedule
  getSchedule: () => {
    const stored = localStorage.getItem('kallos-schedule');
    return stored ? JSON.parse(stored) : {
      saturday: { imageUrl: '', classes: [] },
      sunday: { imageUrl: '', classes: [] },
      monday: { imageUrl: '', classes: [] },
      tuesday: { imageUrl: '', classes: [] },
      wednesday: { imageUrl: '', classes: [] },
      thursday: { imageUrl: '', classes: [] },
      friday: { imageUrl: '', classes: [] }
    };
  },
  
  saveSchedule: (schedule) => {
    localStorage.setItem('kallos-schedule', JSON.stringify(schedule));
  },

  // Testimonials
  getTestimonials: () => {
    const stored = localStorage.getItem('kallos-testimonials');
    return stored ? JSON.parse(stored) : [];
  },
  
  saveTestimonials: (testimonials) => {
    localStorage.setItem('kallos-testimonials', JSON.stringify(testimonials));
  },

  // Features
  getFeatures: () => {
    const stored = localStorage.getItem('kallos-features');
    return stored ? JSON.parse(stored) : [];
  },
  
  saveFeatures: (features) => {
    localStorage.setItem('kallos-features', JSON.stringify(features));
  }
};
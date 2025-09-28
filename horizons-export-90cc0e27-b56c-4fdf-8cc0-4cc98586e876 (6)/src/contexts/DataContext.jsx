import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const [generalContent, setGeneralContent] = useState(null);
  const [pages, setPages] = useState({});
  const [coaches, setCoaches] = useState([]);
  const [schedule, setSchedule] = useState({});
  const [testimonials, setTestimonials] = useState([]);
  const [features, setFeatures] = useState([]);
  const [valuesData, setValuesData] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [
        generalContentRes,
        pagesRes,
        coachesRes,
        scheduleRes,
        testimonialsRes,
        featuresRes,
        valuesRes,
        achievementsRes
      ] = await Promise.all([
        supabase.from('general_content').select('*').single(),
        supabase.from('pages').select('*'),
        supabase.from('coaches').select('*').order('created_at'),
        supabase.from('schedule').select('*'),
        supabase.from('testimonials').select('*').order('created_at'),
        supabase.from('features').select('*').order('created_at'),
        supabase.from('values').select('*').order('created_at'),
        supabase.from('achievements').select('*').order('created_at')
      ]);

      if (generalContentRes.data) setGeneralContent(generalContentRes.data);
      
      if (pagesRes.data) {
        const pagesData = pagesRes.data.reduce((acc, page) => {
          acc[page.id] = page;
          return acc;
        }, {});
        setPages(pagesData);
      }

      if (coachesRes.data) setCoaches(coachesRes.data);

      if (scheduleRes.data) {
        const scheduleData = scheduleRes.data.reduce((acc, day) => {
          acc[day.day_name] = day;
          return acc;
        }, {});
        setSchedule(scheduleData);
      }

      if (testimonialsRes.data) setTestimonials(testimonialsRes.data);
      if (featuresRes.data) setFeatures(featuresRes.data);
      if (valuesRes.data) setValuesData(valuesRes.data);
      if (achievementsRes.data) setAchievements(achievementsRes.data);

    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const value = {
    generalContent,
    pages,
    coaches,
    schedule,
    testimonials,
    features,
    valuesData,
    achievements,
    loading,
    refetchData: fetchData
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};
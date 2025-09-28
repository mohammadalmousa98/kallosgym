
import React, { useState, useEffect, useRef } from 'react';
    import { Helmet } from 'react-helmet';
    import { Save, Trash2, Plus, LogOut, Image as ImageIcon } from 'lucide-react';
    import { useToast } from '@/components/ui/use-toast';
    import { useAuth } from '@/contexts/SupabaseAuthContext';
    import { supabase } from '@/lib/customSupabaseClient';
    import { useData } from '@/contexts/DataContext';

    const ImageUploader = ({ imageUrl, onUpload }) => {
      const fileInputRef = useRef(null);
      const [uploading, setUploading] = useState(false);

      const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
          setUploading(true);
          await onUpload(file);
          setUploading(false);
        }
      };

      return (
        <div>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="image-upload-placeholder" onClick={() => !uploading && fileInputRef.current.click()}>
            {uploading ? (
              <span>Uploading...</span>
            ) : imageUrl ? (
              <img src={imageUrl} alt="Uploaded preview" />
            ) : (
              <>
                <ImageIcon className="w-10 h-10 mb-2" />
                <span>Click to upload</span>
              </>
            )}
          </div>
        </div>
      );
    };


    const AdminPage = () => {
      const { user, signIn, signOut } = useAuth();
      const { refetchData } = useData();
      const [password, setPassword] = useState('');
      const [email, setEmail] = useState('admin@kallos.com');
      const [activeTab, setActiveTab] = useState('coaches');
      const { toast } = useToast();

      const [generalContent, setGeneralContent] = useState(null);
      const [pageContent, setPageContent] = useState({});
      const [coaches, setCoaches] = useState([]);
      const [schedule, setSchedule] = useState({});
      const [testimonials, setTestimonials] = useState([]);
      const [features, setFeatures] = useState([]);
      const [values, setValues] = useState([]);
      const [achievements, setAchievements] = useState([]);

      useEffect(() => {
        if (user) {
          loadAllContent();
        }
      }, [user]);

      const loadAllContent = async () => {
        const { data: generalData } = await supabase.from('general_content').select('*').single();
        setGeneralContent(generalData);

        const { data: pagesData } = await supabase.from('pages').select('*');
        setPageContent(pagesData.reduce((acc, p) => ({ ...acc, [p.id]: p }), {}));

        const { data: coachesData } = await supabase.from('coaches').select('*').order('created_at');
        setCoaches(coachesData);

        const { data: scheduleData } = await supabase.from('schedule').select('*');
        setSchedule(scheduleData.reduce((acc, d) => ({ ...acc, [d.day_name]: d }), {}));

        const { data: testimonialsData } = await supabase.from('testimonials').select('*').order('created_at');
        setTestimonials(testimonialsData);

        const { data: featuresData } = await supabase.from('features').select('*').order('created_at');
        setFeatures(featuresData);
        
        const { data: valuesData } = await supabase.from('values').select('*').order('created_at');
        setValues(valuesData);

        const { data: achievementsData } = await supabase.from('achievements').select('*').order('created_at');
        setAchievements(achievementsData);
      };

      const handleLogin = async (e) => {
        e.preventDefault();
        await signIn(email, password);
      };

      const handleLogout = async () => {
        await signOut();
      };

      const showToast = (title, description) => {
        toast({ title, description });
      };

      const handleFileUpload = async (file) => {
        if (!file) return null;
        const fileName = `public/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
        const { error } = await supabase.storage.from('media').upload(fileName, file);
        if (error) {
          showToast('Upload Error', error.message);
          return null;
        }
        const { data } = supabase.storage.from('media').getPublicUrl(fileName);
        return data.publicUrl;
      };

      const createUploadHandler = (updateFn) => async (file) => {
        const newUrl = await handleFileUpload(file);
        if (newUrl) {
          updateFn(newUrl);
        }
      };
      
      const saveGeneralContent = async () => {
        const { error } = await supabase.from('general_content').upsert({ ...generalContent, id: 1 });
        if (error) showToast('Error', error.message);
        else {
          showToast('Success', 'General content saved!');
          refetchData();
        }
      };

      const savePageContent = async (page) => {
        const { error } = await supabase.from('pages').upsert(pageContent[page]);
        if (error) showToast('Error', error.message);
        else {
          showToast('Success', `${page} page content saved!`);
          refetchData();
        }
      };

      const addCoach = () => setCoaches([...coaches, { name: { en: 'New Coach', ar: 'مدرب جديد' }, bio: { en: '', ar: '' }, image_url: '' }]);
      const updateCoach = (index, field, value) => {
        const newCoaches = [...coaches];
        newCoaches[index][field] = value;
        setCoaches(newCoaches);
      };
      const deleteCoach = async (id, index) => {
        if (id) {
          const { error } = await supabase.from('coaches').delete().match({ id });
          if (error) {
            showToast('Error', error.message);
            return;
          }
        }
        setCoaches(coaches.filter((_, i) => i !== index));
        showToast('Success', 'Coach deleted!');
        refetchData();
      };
      const saveCoaches = async () => {
        const newCoaches = coaches.filter(c => !c.id);
        const existingCoaches = coaches.filter(c => c.id);
      
        let hasError = false;
      
        if (newCoaches.length > 0) {
          const { error: insertError } = await supabase.from('coaches').insert(newCoaches);
          if (insertError) {
            showToast('Error inserting new coaches', insertError.message);
            hasError = true;
          }
        }
      
        if (existingCoaches.length > 0) {
          const { error: updateError } = await supabase.from('coaches').upsert(existingCoaches);
          if (updateError) {
            showToast('Error updating existing coaches', updateError.message);
            hasError = true;
          }
        }
      
        if (!hasError) {
          showToast('Success', 'Coaches saved!');
          loadAllContent();
          refetchData();
        }
      };

      const updateSchedule = (day, field, value) => setSchedule({ ...schedule, [day]: { ...schedule[day], day_name: day, [field]: value } });
      
      const addClassToDay = (day, type = 'classes') => {
        const newClass = { en: '', ar: '' };
        const currentClasses = schedule[day]?.[type] || [];
        updateSchedule(day, type, [...currentClasses, newClass]);
      };
      
      const updateClassInDay = (day, classIndex, lang, value, type = 'classes') => {
        const currentClasses = [...(schedule[day]?.[type] || [])];
        currentClasses[classIndex] = { ...currentClasses[classIndex], [lang]: value };
        updateSchedule(day, type, currentClasses);
      };
      
      const removeClassFromDay = (day, classIndex, type = 'classes') => {
        const currentClasses = schedule[day]?.[type] || [];
        updateSchedule(day, type, currentClasses.filter((_, i) => i !== classIndex));
      };

      const saveSchedule = async () => {
        const scheduleArray = Object.values(schedule);
        const { error } = await supabase.from('schedule').upsert(scheduleArray);
        if (error) showToast('Error', error.message);
        else {
          showToast('Success', 'Schedule saved!');
          refetchData();
        }
      };

      const addTestimonial = () => setTestimonials([...testimonials, { name: '', quote: { en: '', ar: '' } }]);
      const updateTestimonial = (index, field, value) => {
        const newTestimonials = [...testimonials];
        newTestimonials[index][field] = value;
        setTestimonials(newTestimonials);
      };
      const deleteTestimonial = async (id, index) => {
        if (id) {
          const { error } = await supabase.from('testimonials').delete().match({ id });
          if (error) {
            showToast('Error', error.message);
            return;
          }
        }
        setTestimonials(testimonials.filter((_, i) => i !== index));
        showToast('Success', 'Testimonial deleted!');
        refetchData();
      };
      const saveTestimonials = async () => {
        const testimonialsToSave = testimonials.map(({ id, ...rest }) => (id ? { id, ...rest } : rest));
        const { error } = await supabase.from('testimonials').upsert(testimonialsToSave, { onConflict: 'id' });
        if (error) showToast('Error', error.message);
        else {
          showToast('Success', 'Testimonials saved!');
          loadAllContent();
          refetchData();
        }
      };

      const addFeature = () => setFeatures([...features, { icon: '🎯', title: { en: '', ar: '' }, description: { en: '', ar: '' } }]);
      const updateFeature = (index, field, value) => {
        const newFeatures = [...features];
        newFeatures[index][field] = value;
        setFeatures(newFeatures);
      };
      const deleteFeature = async (id, index) => {
        if (id) {
          const { error } = await supabase.from('features').delete().match({ id });
          if (error) {
            showToast('Error', error.message);
            return;
          }
        }
        setFeatures(features.filter((_, i) => i !== index));
        showToast('Success', 'Feature deleted!');
        refetchData();
      };
      const saveFeatures = async () => {
        const featuresToSave = features.map(({ id, ...rest }) => (id ? { id, ...rest } : rest));
        const { error } = await supabase.from('features').upsert(featuresToSave, { onConflict: 'id' });
        if (error) {
          showToast('Error', error.message);
        } else {
          showToast('Success', 'Features saved!');
          loadAllContent();
          refetchData();
        }
      };

      const addValue = () => setValues([...values, { icon: '🌟', title: { en: '', ar: '' }, description: { en: '', ar: '' } }]);
      const updateValue = (index, field, value) => {
        const newValues = [...values];
        newValues[index][field] = value;
        setValues(newValues);
      };
      const deleteValue = async (id, index) => {
        if (id) {
          const { error } = await supabase.from('values').delete().match({ id });
          if (error) {
            showToast('Error', error.message);
            return;
          }
        }
        setValues(values.filter((_, i) => i !== index));
        showToast('Success', 'Value deleted!');
        refetchData();
      };
      const saveValues = async () => {
        const valuesToSave = values.map(({ id, ...rest }) => (id ? { id, ...rest } : rest));
        const { error } = await supabase.from('values').upsert(valuesToSave, { onConflict: 'id' });
        if (error) showToast('Error', error.message);
        else {
          showToast('Success', 'Values saved!');
          loadAllContent();
          refetchData();
        }
      };

      const addAchievement = () => setAchievements([...achievements, { icon: '🏆', title: { en: '', ar: '' }, description: { en: '', ar: '' } }]);
      const updateAchievement = (index, field, value) => {
        const newAchievements = [...achievements];
        newAchievements[index][field] = value;
        setAchievements(newAchievements);
      };
      const deleteAchievement = async (id, index) => {
        if (id) {
          const { error } = await supabase.from('achievements').delete().match({ id });
          if (error) {
            showToast('Error', error.message);
            return;
          }
        }
        setAchievements(achievements.filter((_, i) => i !== index));
        showToast('Success', 'Achievement deleted!');
        refetchData();
      };
      const saveAchievements = async () => {
        const achievementsToSave = achievements.map(({ id, ...rest }) => (id ? { id, ...rest } : rest));
        const { error } = await supabase.from('achievements').upsert(achievementsToSave, { onConflict: 'id' });
        if (error) showToast('Error', error.message);
        else {
          showToast('Success', 'Achievements saved!');
          loadAllContent();
          refetchData();
        }
      };

      if (!user) {
        return (
          <>
            <Helmet><title>Admin Login - Kallos CMS</title></Helmet>
            <div className="min-h-screen flex items-center justify-center bg-gray-900">
              <div className="card max-w-md w-full mx-4">
                <h1 className="text-3xl font-bold text-center mb-8" style={{ color: 'var(--primary)' }}>Kallos CMS</h1>
                <form onSubmit={handleLogin}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="admin-input" required />
                  </div>
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="admin-input" required />
                  </div>
                  <button type="submit" className="admin-button w-full">Login</button>
                </form>
              </div>
            </div>
          </>
        );
      }

      return (
        <>
          <Helmet><title>Admin Dashboard - Kallos CMS</title></Helmet>
          <div className="min-h-screen bg-gray-900">
            <header className="bg-gray-800 border-b border-gray-700 p-4">
              <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-2xl font-bold" style={{ color: 'var(--primary)' }}>Kallos CMS</h1>
                <button onClick={handleLogout} className="admin-button danger flex items-center"><LogOut className="w-4 h-4 mr-2" />Logout</button>
              </div>
            </header>

            <div className="container mx-auto p-4">
              <div className="tabs">
                {['general', 'pages', 'coaches', 'schedule', 'testimonials', 'features', 'values', 'achievements'].map(tab => (
                  <div key={tab} className={`tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>{tab.charAt(0).toUpperCase() + tab.slice(1)}</div>
                ))}
              </div>

              <div className="mt-8">
                {activeTab === 'general' && generalContent && (
                  <div className="admin-form">
                    <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--primary)' }}>General Content</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium mb-2">Logo Text (Fallback)</label>
                        <input type="text" value={generalContent.logo_text || ''} onChange={(e) => setGeneralContent({ ...generalContent, logo_text: e.target.value })} className="admin-input" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Logo Image</label>
                        <ImageUploader imageUrl={generalContent.logo_url} onUpload={createUploadHandler(url => setGeneralContent({ ...generalContent, logo_url: url }))} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Hero Media Type</label>
                        <select value={generalContent.hero_media_type || 'image'} onChange={(e) => setGeneralContent({ ...generalContent, hero_media_type: e.target.value })} className="admin-input">
                          <option value="image">Image</option>
                          <option value="video">Video</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Hero Media</label>
                        <ImageUploader imageUrl={generalContent.hero_media_url} onUpload={createUploadHandler(url => setGeneralContent({ ...generalContent, hero_media_url: url }))} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Join Now Link</label>
                        <input type="text" value={generalContent.join_now_link || ''} onChange={(e) => setGeneralContent({ ...generalContent, join_now_link: e.target.value })} className="admin-input" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Learn More Link</label>
                        <input type="text" value={generalContent.learn_more_link || ''} onChange={(e) => setGeneralContent({ ...generalContent, learn_more_link: e.target.value })} className="admin-input" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">CTA Title (English)</label>
                        <input type="text" value={generalContent.cta_title?.en || ''} onChange={(e) => setGeneralContent({ ...generalContent, cta_title: { ...generalContent.cta_title, en: e.target.value } })} className="admin-input" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">CTA Title (Arabic)</label>
                        <input type="text" value={generalContent.cta_title?.ar || ''} onChange={(e) => setGeneralContent({ ...generalContent, cta_title: { ...generalContent.cta_title, ar: e.target.value } })} className="admin-input" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-2">CTA Subtitle (English)</label>
                        <textarea value={generalContent.cta_subtitle?.en || ''} onChange={(e) => setGeneralContent({ ...generalContent, cta_subtitle: { ...generalContent.cta_subtitle, en: e.target.value } })} className="admin-textarea" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-2">CTA Subtitle (Arabic)</label>
                        <textarea value={generalContent.cta_subtitle?.ar || ''} onChange={(e) => setGeneralContent({ ...generalContent, cta_subtitle: { ...generalContent.cta_subtitle, ar: e.target.value } })} className="admin-textarea" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Footer Text (English)</label>
                        <input type="text" value={generalContent.footer_text?.en || ''} onChange={(e) => setGeneralContent({ ...generalContent, footer_text: { ...generalContent.footer_text, en: e.target.value } })} className="admin-input" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Footer Text (Arabic)</label>
                        <input type="text" value={generalContent.footer_text?.ar || ''} onChange={(e) => setGeneralContent({ ...generalContent, footer_text: { ...generalContent.footer_text, ar: e.target.value } })} className="admin-input" />
                      </div>
                    </div>
                    <button onClick={saveGeneralContent} className="admin-button mt-4 flex items-center"><Save className="w-4 h-4 mr-2" />Save General Content</button>
                  </div>
                )}

                {activeTab === 'pages' && (
                  <div className="space-y-8">
                    {['about', 'contact'].map(pageId => pageContent[pageId] && (
                      <div key={pageId} className="admin-form">
                        <h2 className="text-2xl font-bold mb-6 capitalize" style={{ color: 'var(--primary)' }}>{pageId} Page</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                          {pageId === 'about' && <>
                            <div>
                              <label className="block text-sm font-medium mb-2">Title (English)</label>
                              <input type="text" value={pageContent.about.title?.en || ''} onChange={(e) => setPageContent({ ...pageContent, about: { ...pageContent.about, title: { ...pageContent.about.title, en: e.target.value } } })} className="admin-input" />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-2">Title (Arabic)</label>
                              <input type="text" value={pageContent.about.title?.ar || ''} onChange={(e) => setPageContent({ ...pageContent, about: { ...pageContent.about, title: { ...pageContent.about.title, ar: e.target.value } } })} className="admin-input" />
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium mb-2">Content (English)</label>
                              <textarea value={pageContent.about.content?.en || ''} onChange={(e) => setPageContent({ ...pageContent, about: { ...pageContent.about, content: { ...pageContent.about.content, en: e.target.value } } })} className="admin-textarea" rows={6} />
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium mb-2">Content (Arabic)</label>
                              <textarea value={pageContent.about.content?.ar || ''} onChange={(e) => setPageContent({ ...pageContent, about: { ...pageContent.about, content: { ...pageContent.about.content, ar: e.target.value } } })} className="admin-textarea" rows={6} />
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium mb-2">Image</label>
                              <ImageUploader imageUrl={pageContent.about.image_url} onUpload={createUploadHandler(url => setPageContent({ ...pageContent, about: { ...pageContent.about, image_url: url } }))} />
                            </div>
                          </>}
                          {pageId === 'contact' && <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-2">Google Maps Embed URL</label>
                            <input type="url" value={pageContent.contact.map_url || ''} onChange={(e) => setPageContent({ ...pageContent, contact: { ...pageContent.contact, map_url: e.target.value } })} className="admin-input" />
                          </div>}
                        </div>
                        <button onClick={() => savePageContent(pageId)} className="admin-button mt-4 flex items-center"><Save className="w-4 h-4 mr-2" />Save {pageId} Page</button>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'coaches' && (
                  <div className="admin-form">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold" style={{ color: 'var(--primary)' }}>Coaches</h2>
                      <button onClick={addCoach} className="admin-button flex items-center"><Plus className="w-4 h-4 mr-2" />Add Coach</button>
                    </div>
                    <div className="space-y-6">
                      {coaches.map((coach, index) => (
                        <div key={coach.id || index} className="card">
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium mb-2">Name (English)</label>
                              <input type="text" value={coach.name?.en || ''} onChange={(e) => updateCoach(index, 'name', { ...coach.name, en: e.target.value })} className="admin-input" />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-2">Name (Arabic)</label>
                              <input type="text" value={coach.name?.ar || ''} onChange={(e) => updateCoach(index, 'name', { ...coach.name, ar: e.target.value })} className="admin-input" />
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium mb-2">Image</label>
                               <ImageUploader imageUrl={coach.image_url} onUpload={createUploadHandler(url => updateCoach(index, 'image_url', url))} />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-2">Bio (English)</label>
                              <textarea value={coach.bio?.en || ''} onChange={(e) => updateCoach(index, 'bio', { ...coach.bio, en: e.target.value })} className="admin-textarea" rows={3} />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-2">Bio (Arabic)</label>
                              <textarea value={coach.bio?.ar || ''} onChange={(e) => updateCoach(index, 'bio', { ...coach.bio, ar: e.target.value })} className="admin-textarea" rows={3} />
                            </div>
                          </div>
                          <button onClick={() => deleteCoach(coach.id, index)} className="admin-button danger mt-4 flex items-center"><Trash2 className="w-4 h-4 mr-2" />Delete</button>
                        </div>
                      ))}
                    </div>
                    <button onClick={saveCoaches} className="admin-button mt-6 flex items-center"><Save className="w-4 h-4 mr-2" />Save All Coaches</button>
                  </div>
                )}

                {activeTab === 'schedule' && (
                  <div className="admin-form">
                    <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--primary)' }}>Weekly Schedule</h2>
                    <div className="space-y-6">
                      {['saturday', 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday'].map(day => (
                        <div key={day} className="card">
                          <h3 className="text-xl font-bold mb-4 capitalize" style={{ color: 'var(--primary)' }}>{day}</h3>
                          <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">Day Image</label>
                            <ImageUploader imageUrl={schedule[day]?.image_url} onUpload={createUploadHandler(url => updateSchedule(day, 'image_url', url))} />
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                              <div className="flex justify-between items-center mb-4">
                                <label className="block text-sm font-medium">Adults Classes</label>
                                <button onClick={() => addClassToDay(day, 'classes')} className="admin-button flex items-center"><Plus className="w-4 h-4 mr-2" />Add</button>
                              </div>
                              <div className="space-y-4">
                                {(schedule[day]?.classes || []).map((classItem, index) => (
                                  <div key={index} className="flex flex-col gap-2 bg-gray-700 p-3 rounded">
                                    <div className="grid grid-cols-2 gap-2">
                                      <input type="text" placeholder="Class Name (En)" value={classItem.en} onChange={(e) => updateClassInDay(day, index, 'en', e.target.value, 'classes')} className="admin-input mb-0" />
                                      <input type="text" placeholder="Class Name (Ar)" value={classItem.ar} onChange={(e) => updateClassInDay(day, index, 'ar', e.target.value, 'classes')} className="admin-input mb-0" />
                                    </div>
                                    <button onClick={() => removeClassFromDay(day, index, 'classes')} className="admin-button danger self-end"><Trash2 className="w-4 h-4" /></button>
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            <div>
                              <div className="flex justify-between items-center mb-4">
                                <label className="block text-sm font-medium">Kids Classes</label>
                                <button onClick={() => addClassToDay(day, 'kids_classes')} className="admin-button flex items-center"><Plus className="w-4 h-4 mr-2" />Add</button>
                              </div>
                              <div className="space-y-4">
                                {(schedule[day]?.kids_classes || []).map((classItem, index) => (
                                  <div key={index} className="flex flex-col gap-2 bg-gray-700 p-3 rounded">
                                    <div className="grid grid-cols-2 gap-2">
                                      <input type="text" placeholder="Class Name (En)" value={classItem.en} onChange={(e) => updateClassInDay(day, index, 'en', e.target.value, 'kids_classes')} className="admin-input mb-0" />
                                      <input type="text" placeholder="Class Name (Ar)" value={classItem.ar} onChange={(e) => updateClassInDay(day, index, 'ar', e.target.value, 'kids_classes')} className="admin-input mb-0" />
                                    </div>
                                    <button onClick={() => removeClassFromDay(day, index, 'kids_classes')} className="admin-button danger self-end"><Trash2 className="w-4 h-4" /></button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button onClick={saveSchedule} className="admin-button mt-6 flex items-center"><Save className="w-4 h-4 mr-2" />Save Schedule</button>
                  </div>
                )}

                {activeTab === 'testimonials' && (
                  <div className="admin-form">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold" style={{ color: 'var(--primary)' }}>Testimonials</h2>
                      <button onClick={addTestimonial} className="admin-button flex items-center"><Plus className="w-4 h-4 mr-2" />Add Testimonial</button>
                    </div>
                    <div className="space-y-6">
                      {testimonials.map((testimonial, index) => (
                        <div key={testimonial.id || index} className="card">
                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium mb-2">Member Name</label>
                              <input type="text" value={testimonial.name} onChange={(e) => updateTestimonial(index, 'name', e.target.value)} className="admin-input" />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-2">Quote (English)</label>
                              <textarea value={testimonial.quote.en} onChange={(e) => updateTestimonial(index, 'quote', { ...testimonial.quote, en: e.target.value })} className="admin-textarea" rows={4} />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-2">Quote (Arabic)</label>
                              <textarea value={testimonial.quote.ar} onChange={(e) => updateTestimonial(index, 'quote', { ...testimonial.quote, ar: e.target.value })} className="admin-textarea" rows={4} />
                            </div>
                          </div>
                          <button onClick={() => deleteTestimonial(testimonial.id, index)} className="admin-button danger mt-4 flex items-center"><Trash2 className="w-4 h-4 mr-2" />Delete</button>
                        </div>
                      ))}
                    </div>
                    <button onClick={saveTestimonials} className="admin-button mt-6 flex items-center"><Save className="w-4 h-4 mr-2" />Save All Testimonials</button>
                  </div>
                )}

                {activeTab === 'features' && (
                  <div className="admin-form">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold" style={{ color: 'var(--primary)' }}>Key Features (Why Kallos?)</h2>
                      <button onClick={addFeature} className="admin-button flex items-center"><Plus className="w-4 h-4 mr-2" />Add Feature</button>
                    </div>
                    <div className="space-y-6">
                      {features.map((feature, index) => (
                        <div key={feature.id || index} className="card">
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium mb-2">Icon (Emoji)</label>
                              <input type="text" value={feature.icon} onChange={(e) => updateFeature(index, 'icon', e.target.value)} className="admin-input" />
                            </div>
                            <div />
                            <div>
                              <label className="block text-sm font-medium mb-2">Title (English)</label>
                              <input type="text" value={feature.title.en} onChange={(e) => updateFeature(index, 'title', { ...feature.title, en: e.target.value })} className="admin-input" />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-2">Title (Arabic)</label>
                              <input type="text" value={feature.title.ar} onChange={(e) => updateFeature(index, 'title', { ...feature.title, ar: e.target.value })} className="admin-input" />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-2">Description (English)</label>
                              <textarea value={feature.description.en} onChange={(e) => updateFeature(index, 'description', { ...feature.description, en: e.target.value })} className="admin-textarea" rows={3} />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-2">Description (Arabic)</label>
                              <textarea value={feature.description.ar} onChange={(e) => updateFeature(index, 'description', { ...feature.description, ar: e.target.value })} className="admin-textarea" rows={3} />
                            </div>
                          </div>
                          <button onClick={() => deleteFeature(feature.id, index)} className="admin-button danger mt-4 flex items-center"><Trash2 className="w-4 h-4 mr-2" />Delete</button>                    </div>
                      ))}
                    </div>
                    <button onClick={saveFeatures} className="admin-button mt-6 flex items-center"><Save className="w-4 h-4 mr-2" />Save All Features</button>
                  </div>
                )}

                {activeTab === 'values' && (
                  <div className="admin-form">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold" style={{ color: 'var(--primary)' }}>Core Values</h2>
                      <button onClick={addValue} className="admin-button flex items-center"><Plus className="w-4 h-4 mr-2" />Add Value</button>
                    </div>
                    <div className="space-y-6">
                      {values.map((value, index) => (
                        <div key={value.id || index} className="card">
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium mb-2">Icon (Emoji)</label>
                              <input type="text" value={value.icon} onChange={(e) => updateValue(index, 'icon', e.target.value)} className="admin-input" />
                            </div>
                            <div />
                            <div>
                              <label className="block text-sm font-medium mb-2">Title (English)</label>
                              <input type="text" value={value.title.en} onChange={(e) => updateValue(index, 'title', { ...value.title, en: e.target.value })} className="admin-input" />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-2">Title (Arabic)</label>
                              <input type="text" value={value.title.ar} onChange={(e) => updateValue(index, 'title', { ...value.title, ar: e.target.value })} className="admin-input" />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-2">Description (English)</label>
                              <textarea value={value.description.en} onChange={(e) => updateValue(index, 'description', { ...value.description, en: e.target.value })} className="admin-textarea" rows={3} />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-2">Description (Arabic)</label>
                              <textarea value={value.description.ar} onChange={(e) => updateValue(index, 'description', { ...value.description, ar: e.target.value })} className="admin-textarea" rows={3} />
                            </div>
                          </div>
                          <button onClick={() => deleteValue(value.id, index)} className="admin-button danger mt-4 flex items-center"><Trash2 className="w-4 h-4 mr-2" />Delete</button>
                        </div>
                      ))}
                    </div>
                    <button onClick={saveValues} className="admin-button mt-6 flex items-center"><Save className="w-4 h-4 mr-2" />Save All Values</button>
                  </div>
                )}

                {activeTab === 'achievements' && (
                  <div className="admin-form">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold" style={{ color: 'var(--primary)' }}>Achievements</h2>
                      <button onClick={addAchievement} className="admin-button flex items-center"><Plus className="w-4 h-4 mr-2" />Add Achievement</button>
                    </div>
                    <div className="space-y-6">
                      {achievements.map((achievement, index) => (
                        <div key={achievement.id || index} className="card">
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium mb-2">Icon (Emoji)</label>
                              <input type="text" value={achievement.icon} onChange={(e) => updateAchievement(index, 'icon', e.target.value)} className="admin-input" />
                            </div>
                            <div />
                            <div>
                              <label className="block text-sm font-medium mb-2">Title (English)</label>
                              <input type="text" value={achievement.title.en} onChange={(e) => updateAchievement(index, 'title', { ...achievement.title, en: e.target.value })} className="admin-input" />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-2">Title (Arabic)</label>
                              <input type="text" value={achievement.title.ar} onChange={(e) => updateAchievement(index, 'title', { ...achievement.title, ar: e.target.value })} className="admin-input" />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-2">Description (English)</label>
                              <textarea value={achievement.description.en} onChange={(e) => updateAchievement(index, 'description', { ...achievement.description, en: e.target.value })} className="admin-textarea" rows={3} />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-2">Description (Arabic)</label>
                              <textarea value={achievement.description.ar} onChange={(e) => updateAchievement(index, 'description', { ...achievement.description, ar: e.target.value })} className="admin-textarea" rows={3} />
                            </div>
                          </div>
                          <button onClick={() => deleteAchievement(achievement.id, index)} className="admin-button danger mt-4 flex items-center"><Trash2 className="w-4 h-4 mr-2" />Delete</button>
                        </div>
                      ))}
                    </div>
                    <button onClick={saveAchievements} className="admin-button mt-6 flex items-center"><Save className="w-4 h-4 mr-2" />Save All Achievements</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      );
    };

    export default AdminPage;

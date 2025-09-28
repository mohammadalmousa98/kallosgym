import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yamqrmwvprxhmztyzoac.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlhbXFybXd2cHJ4aG16dHl6b2FjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5NjA4NTAsImV4cCI6MjA3MzUzNjg1MH0.fQtIvAwCCDaMjukwsA2gGRlhEqDGNdxrboVTDVEhog0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
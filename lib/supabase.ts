import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://uzmuxycnwngxhgvvtwdf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV6bXV4eWNud25neGhndnZ0d2RmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkxNjY1MTksImV4cCI6MjA2NDc0MjUxOX0.80RZH5xUWW-Dpp6kTyDdanc8GalQ-DJ9J7Ykmrx-QRI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://srezxddkcwkiblxerknr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNyZXp4ZGRrY3draWJseGVya25yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0NjE3NTcsImV4cCI6MjA3ODAzNzc1N30.psBqY6Lp3ypCcKUVQ_KU_Ft3Uu_1z86QkpOmdIEOB7E';

export const supabase = createClient(supabaseUrl, supabaseKey);

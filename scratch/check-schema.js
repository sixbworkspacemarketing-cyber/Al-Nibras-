import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase URL or Key missing');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
  console.log('Checking Profiles table columns...');
  const { data: profileColumns, error: pError } = await supabase.from('profiles').select('*').limit(1);
  if (pError) {
    console.error('Error fetching profiles:', pError.message);
  } else if (profileColumns && profileColumns.length > 0) {
    console.log('Profile columns:', Object.keys(profileColumns[0]));
  } else {
    console.log('No profiles found to check columns.');
  }

  const tablesToCheck = ['site_stats', 'audit_logs', 'app_videos', 'user_progress'];
  for (const table of tablesToCheck) {
    const { error } = await supabase.from(table).select('*').limit(1);
    if (error) {
       console.log(`Table ${table} check FAILED: ${error.message}`);
    } else {
       console.log(`Table ${table} check SUCCESS`);
    }
  }
}

checkSchema();

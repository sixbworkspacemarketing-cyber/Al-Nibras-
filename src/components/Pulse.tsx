"use client";

import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { usePathname } from 'next/navigation';

export default function Pulse() {
  const pathname = usePathname();

  useEffect(() => {
    const trackActivity = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const user = session.user;

      // 1. Update last_active_at in profiles
      await supabase
        .from('profiles')
        .update({ last_active_at: new Date().toISOString() })
        .eq('id', user.id);

      // 2. Log footprint for specific actions or just page views
      // We log to audit_logs
      await supabase.from('audit_logs').insert({
        user_id: user.id,
        action: 'PAGE_VIEW',
        details: { path: pathname, timestamp: new Date().toISOString() }
      });

      // 3. Increment site stats for today
      // This is a bit tricky without a "upsert increment" in Supabase REST directly 
      // but we can try to RPC or just a simple check-then-set
      const today = new Date().toISOString().split('T')[0];
      
      // We try to increment visits_count. 
      // Best done via RPC if possible, but for now we'll do a simple logic:
      const { data: stats } = await supabase.from('site_stats').select('*').eq('id', today).single();
      if (stats) {
        await supabase.from('site_stats')
          .update({ visits_count: stats.visits_count + 1, updated_at: new Date().toISOString() })
          .eq('id', today);
      } else {
        await supabase.from('site_stats').insert({ id: today, visits_count: 1 });
      }
    };

    trackActivity();
    
    // Interval for "Online Now" pulse (every 5 mins)
    const interval = setInterval(trackActivity, 1000 * 60 * 5);
    return () => clearInterval(interval);
  }, [pathname]);

  return null;
}

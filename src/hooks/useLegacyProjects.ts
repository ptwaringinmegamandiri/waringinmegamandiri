import { useState, useEffect, useCallback } from 'react';
import { supabase, LegacyProjectRow } from '@/lib/supabase';

export function useLegacyProjects() {
  const [projects, setProjects] = useState<LegacyProjectRow[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('legacy_projects')
      .select('*')
      .order('year', { ascending: false })
      .order('id', { ascending: false });
    if (error) {
      console.error('useLegacyProjects fetch error:', error);
    }
    if (!error && data) setProjects(data as LegacyProjectRow[]);
    setLoading(false);
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  return { projects, loading, refetch: fetch };
}
import { useState, useEffect } from 'react';
import { supabase, CareerRow } from '@/lib/supabase';
import { jobListings } from '@/mocks/careers';

export type Career = {
  id: number;
  title: string;
  department: string;
  location: string;
  type: string;
  level: string;
  salary: string;
  deadline: string;
  description: string;
  requirements: string[];
  benefits: string[];
  tags: string[];
  is_active: boolean;
};

function mapRowToCareer(row: CareerRow): Career {
  return {
    id: row.id,
    title: row.title,
    department: row.department,
    location: row.location,
    type: row.type,
    level: row.level,
    salary: row.salary,
    deadline: row.deadline,
    description: row.description,
    requirements: row.requirements ?? [],
    benefits: row.benefits ?? [],
    tags: row.tags ?? [],
    is_active: row.is_active,
  };
}

export function useCareers() {
  const [careers, setCareers] = useState<Career[]>([]);
  const [loading, setLoading] = useState(true);
  const [fromSupabase, setFromSupabase] = useState(false);

  const fetchCareers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('careers')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        setCareers(data.map(mapRowToCareer));
        setFromSupabase(true);
      } else {
        setCareers(jobListings as Career[]);
        setFromSupabase(false);
      }
    } catch {
      setCareers(jobListings as Career[]);
      setFromSupabase(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCareers();
  }, []);

  return { careers, loading, fromSupabase, refetch: fetchCareers };
}

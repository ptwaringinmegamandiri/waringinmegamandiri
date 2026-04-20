import { useState, useEffect } from 'react';
import { supabase, ProjectRow } from '@/lib/supabase';
import { projects as mockProjects, Project } from '@/mocks/projects';

export interface ProjectWithMeta extends Project {
  isFeatured?: boolean;
  featuredOrder?: number | null;
}

export function mapRowToProject(row: ProjectRow): ProjectWithMeta {
  const sortedImgs = Array.isArray(row.project_images) && row.project_images.length > 0
    ? [...row.project_images]
        .sort((a, b) => a.sort_order - b.sort_order)
        .map((i) => i.image_url)
        .filter(Boolean)
    : [];

  const allImages = sortedImgs.length > 0
    ? sortedImgs
    : row.cover_image
    ? [row.cover_image]
    : [];

  const primaryImage = allImages[0] || '';

  return {
    id: row.id,
    name: row.name,
    buildingType: row.building_type as Project['buildingType'],
    location: row.location,
    year: row.year,
    status: row.status,
    workPackage: row.work_package,
    unitCount: row.unit_count,
    buildingArea: row.building_area,
    floors: row.floors,
    description: row.description,
    image: primaryImage,
    images: allImages,
    client: row.client,
    value: row.value,
    isFeatured: row.is_featured ?? false,
    featuredOrder: row.featured_order ?? null,
    imagePosition: row.image_position || 'center',
  };
}

export function useProjects() {
  const [projects, setProjects] = useState<ProjectWithMeta[]>([]);
  const [featuredProjects, setFeaturedProjects] = useState<ProjectWithMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [fromSupabase, setFromSupabase] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const fetchFromSupabase = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('projects')
          .select(`*, project_images(id, image_url, sort_order)`)
          .order('year', { ascending: false })
          .order('id', { ascending: false })
          .limit(200)
          .gt('id', 0);

        if (cancelled) return;

        if (!error && data && data.length > 0) {
          const mapped = data.map(mapRowToProject);
          setProjects(mapped);

          // Sort featured projects by featured_order
          const feat = mapped
            .filter((p) => p.isFeatured)
            .sort((a, b) => (a.featuredOrder ?? 99) - (b.featuredOrder ?? 99));
          setFeaturedProjects(feat);
          setFromSupabase(true);
        } else {
          setProjects(mockProjects);
          setFeaturedProjects([]);
          setFromSupabase(false);
        }
      } catch {
        if (!cancelled) {
          setProjects(mockProjects);
          setFeaturedProjects([]);
          setFromSupabase(false);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchFromSupabase();

    return () => { cancelled = true; };
  }, []);

  return { projects, featuredProjects, loading, fromSupabase };
}
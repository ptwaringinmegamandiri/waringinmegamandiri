import { useState, useEffect } from 'react';
import { supabase, NewsRow } from '@/lib/supabase';
import { newsArticles } from '@/mocks/news';

export type NewsArticle = {
  id: number;
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  image?: string;
  author: string;
  date: string;
  readTime: string;
  featured: boolean;
  tags: string[];
  content?: string;
};

function mapRowToArticle(row: NewsRow): NewsArticle {
  return {
    id: row.id,
    slug: row.slug,
    category: row.category,
    title: row.title,
    excerpt: row.excerpt,
    image: row.image ?? '',
    author: row.author,
    date: row.date,
    readTime: row.read_time,
    featured: row.featured,
    tags: row.tags ?? [],
    content: row.content ?? '',
  };
}

export function useNews() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [fromSupabase, setFromSupabase] = useState(false);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        setArticles(data.map(mapRowToArticle));
        setFromSupabase(true);
      } else {
        setArticles(newsArticles as NewsArticle[]);
        setFromSupabase(false);
      }
    } catch {
      setArticles(newsArticles as NewsArticle[]);
      setFromSupabase(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  return { articles, loading, fromSupabase, refetch: fetchNews };
}

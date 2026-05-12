import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  action?: 'confirm' | 'success' | 'error' | 'image_preview' | 'followup' | 'ai_response';
  payload?: unknown;
}

interface AiConfig {
  ai_provider: string;
  ai_api_key: string;
  ai_model: string;
}

export function useAiChat() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchConfig = useCallback(async (): Promise<AiConfig | null> => {
    const { data } = await supabase
      .from('site_settings')
      .select('key, value')
      .in('key', ['ai_provider', 'ai_api_key', 'ai_model']);
    const map: Record<string, string> = {};
    data?.forEach((r: { key: string; value: string }) => { map[r.key] = r.value || ''; });
    if (!map.ai_api_key || map.ai_api_key.length < 10) return null;
    return {
      ai_provider: map.ai_provider || 'gemini',
      ai_api_key: map.ai_api_key,
      ai_model: map.ai_model || 'gemini-1.5-flash',
    };
  }, []);

  const sendAiChat = useCallback(async (messages: ChatMessage[], language: 'id' | 'en' | 'zh'): Promise<string> => {
    setLoading(true);
    setError(null);

    const config = await fetchConfig();
    if (!config) {
      setLoading(false);
      setError('API key belum dikonfigurasi. Buka tab Pengaturan > AI Config.');
      return 'API key belum dikonfigurasi. Buka tab Pengaturan > AI Config untuk mengatur API key dari provider AI.';
    }

    try {
      const res = await supabase.functions.invoke('ai-chat', {
        body: {
          messages: messages.map(m => ({ role: m.role, content: m.content })),
          provider: config.ai_provider,
          language,
          model: config.ai_model,
        },
      });

      if (res.error) {
        console.error('Edge Function Error:', res.error);
        console.error('Edge Function Status:', res.error.status);
        console.error('Edge Function Context:', res.error.context);
        throw new Error(`[${res.error.status || 'unknown'}] ${res.error.message || res.error}`);
      }
      const data = res.data as { response?: string; error?: string };
      if (data.error) throw new Error(data.error);
      setLoading(false);
      return data.response || 'AI tidak memberikan respons.';
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Terjadi kesalahan';
      console.error('AI Chat Error Detail:', msg);
      setLoading(false);
      setError(msg);
      return `Maaf, AI sedang tidak tersedia: ${msg}. Coba lagi nanti atau periksa API key di Pengaturan > AI Config.`;
    }
  }, [fetchConfig]);

  return { sendAiChat, loading, error };
}
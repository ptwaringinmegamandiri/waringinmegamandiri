import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

const PROVIDERS = [
  { key: 'gemini', label: 'Google Gemini', free: true, note: 'Gratis (1.5 Flash), API key dari Google AI Studio' },
  { key: 'groq', label: 'Groq', free: true, note: 'Gratis tier tersedia, API key dari groq.com' },
  { key: 'openrouter', label: 'OpenRouter', free: true, note: 'Free model tersedia, API key dari openrouter.ai' },
] as const;

const MODELS: Record<string, { key: string; label: string }[]> = {
  gemini: [
    { key: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash (fast, free)' },
    { key: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro (advanced)' },
  ],
  groq: [
    { key: 'llama-3.1-70b-versatile', label: 'Llama 3.1 70B' },
    { key: 'llama-3.1-8b-instant', label: 'Llama 3.1 8B (fast)' },
    { key: 'mixtral-8x7b-32768', label: 'Mixtral 8x7B' },
  ],
  openrouter: [
    { key: 'meta-llama/llama-3.1-70b-instruct:free', label: 'Llama 3.1 70B (free)' },
    { key: 'google/gemini-flash-1.5:free', label: 'Gemini Flash 1.5 (free)' },
    { key: 'mistralai/mistral-7b-instruct:free', label: 'Mistral 7B (free)' },
  ],
};

interface AiConfig {
  ai_provider: string;
  ai_api_key: string;
  ai_model: string;
}

export default function AiConfigPanel() {
  const [config, setConfig] = useState<AiConfig>({
    ai_provider: 'gemini',
    ai_api_key: '',
    ai_model: 'gemini-1.5-flash',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [testMsg, setTestMsg] = useState('');
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  };

  const fetchConfig = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('site_settings').select('key, value').in('key', ['ai_provider', 'ai_api_key', 'ai_model']);
    const map: Record<string, string> = {};
    data?.forEach((r: { key: string; value: string }) => { map[r.key] = r.value || ''; });
    setConfig({
      ai_provider: map.ai_provider || 'gemini',
      ai_api_key: map.ai_api_key || '',
      ai_model: map.ai_model || 'gemini-1.5-flash',
    });
    setLoading(false);
  }, []);

  useEffect(() => { fetchConfig(); }, [fetchConfig]);

  const upsert = async (key: string, value: string) => {
    const { data } = await supabase.from('site_settings').select('key').eq('key', key);
    if (data && data.length > 0) {
      await supabase.from('site_settings').update({ value, updated_at: new Date().toISOString() }).eq('key', key);
    } else {
      await supabase.from('site_settings').insert({ key, value });
    }
  };

  const handleSave = async () => {
    setSaving(true);
    await upsert('ai_provider', config.ai_provider);
    await upsert('ai_api_key', config.ai_api_key);
    await upsert('ai_model', config.ai_model);
    setSaving(false);
    showToast('AI config tersimpan!');
  };

  const handleTest = async () => {
    setTestStatus('testing');
    setTestMsg('');
    try {
      const res = await fetch('https://qkcgzavasutfkkltorve.supabase.co/functions/v1/ai-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          messages: [{ role: 'user', content: 'Halo, tolong jawab dalam 1 kalimat: siapa kamu?' }],
          provider: config.ai_provider,
          language: 'id',
          model: config.ai_model,
        }),
      });
      const data = await res.json();
      if (data.error || data.message?.includes('error')) {
        setTestStatus('error');
        setTestMsg(data.error || 'Gagal konek ke AI. Cek API key dan provider.');
      } else {
        setTestStatus('success');
        setTestMsg(`Koneksi berhasil! AI: "${(data.response || '').slice(0, 80)}..."`);
      }
    } catch (e: unknown) {
      setTestStatus('error');
      setTestMsg(`Error: ${e instanceof Error ? e.message : 'Unknown error'}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <div className="w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-[#0D1117] border border-slate-800 rounded-2xl overflow-hidden">
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg">
          <i className="ri-checkbox-circle-line text-sm" />{toast}
        </div>
      )}

      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-amber-400/10">
            <i className="ri-robot-2-line text-amber-400 text-sm" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white">AI Copilot Config</h3>
            <p className="text-slate-500 text-[10px]">Pilih provider AI gratis & masukkan API key</p>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-5">
        {/* Provider selection */}
        <div>
          <label className="text-slate-400 text-xs mb-2 block font-medium">Provider AI (Pilih yang Gratis)</label>
          <div className="grid grid-cols-1 gap-2">
            {PROVIDERS.map((p) => (
              <button
                key={p.key}
                onClick={() => setConfig({ ...config, ai_provider: p.key, ai_model: MODELS[p.key][0].key })}
                className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer text-left ${
                  config.ai_provider === p.key
                    ? 'border-amber-400/40 bg-amber-400/5'
                    : 'border-slate-700 hover:border-slate-600 bg-[#070C17]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${config.ai_provider === p.key ? 'border-amber-400' : 'border-slate-600'}`}>
                    {config.ai_provider === p.key && <div className="w-2 h-2 rounded-full bg-amber-400" />}
                  </div>
                  <div>
                    <span className={`text-xs font-bold block ${config.ai_provider === p.key ? 'text-amber-400' : 'text-white'}`}>{p.label}</span>
                    <span className="text-slate-500 text-[10px]">{p.note}</span>
                  </div>
                </div>
                {p.free && (
                  <span className="text-[10px] bg-green-500/10 text-green-400 px-2 py-0.5 rounded-full font-semibold shrink-0">GRATIS</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Model selection */}
        <div>
          <label className="text-slate-400 text-xs mb-2 block font-medium">Model</label>
          <select
            value={config.ai_model}
            onChange={(e) => setConfig({ ...config, ai_model: e.target.value })}
            className="w-full bg-[#070C17] border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400/60 transition-colors cursor-pointer"
          >
            {MODELS[config.ai_provider]?.map((m) => (
              <option key={m.key} value={m.key}>{m.label}</option>
            ))}
          </select>
        </div>

        {/* API Key */}
        <div>
          <label className="text-slate-400 text-xs mb-2 block font-medium">API Key</label>
          <input
            type="password"
            value={config.ai_api_key}
            onChange={(e) => setConfig({ ...config, ai_api_key: e.target.value })}
            placeholder="Masukkan API key dari provider yang dipilih..."
            className="w-full bg-[#070C17] border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-400/60 transition-colors"
          />
          <p className="text-slate-600 text-[10px] mt-1.5">
            <i className="ri-shield-check-line mr-1" />
            API key disimpan aman di database Supabase. Tidak terlihat di kode frontend.
          </p>
          <div className="mt-2 text-[10px] text-slate-500 space-y-1">
            <p><strong>Gemini:</strong> Kunjungi <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:underline">Google AI Studio</a> → Create API Key</p>
            <p><strong>Groq:</strong> Kunjungi <a href="https://console.groq.com/keys" target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:underline">Groq Console</a> → Create API Key</p>
            <p><strong>OpenRouter:</strong> Kunjungi <a href="https://openrouter.ai/keys" target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:underline">OpenRouter Keys</a> → Create Key</p>
          </div>
        </div>

        {/* Test + Save buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 flex items-center justify-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs py-2.5 rounded-xl cursor-pointer whitespace-nowrap transition-colors disabled:opacity-50"
          >
            {saving ? <div className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin" /> : <i className="ri-save-line" />}
            Simpan Config
          </button>
          <button
            onClick={handleTest}
            disabled={testStatus === 'testing'}
            className={`flex items-center justify-center gap-1.5 font-bold text-xs py-2.5 px-4 rounded-xl cursor-pointer whitespace-nowrap transition-colors border ${
              testStatus === 'success'
                ? 'border-green-500/30 bg-green-500/10 text-green-400'
                : testStatus === 'error'
                ? 'border-red-500/30 bg-red-500/10 text-red-400'
                : 'border-slate-600 hover:border-slate-500 bg-slate-800 text-slate-300'
            }`}
          >
            {testStatus === 'testing' ? <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" /> : <i className="ri-flashlight-line" />}
            Test
          </button>
        </div>

        {testStatus !== 'idle' && testStatus !== 'testing' && (
          <div className={`text-[11px] p-3 rounded-xl ${testStatus === 'success' ? 'bg-green-500/5 text-green-300 border border-green-500/20' : 'bg-red-500/5 text-red-300 border border-red-500/20'}`}>
            <div className="flex items-start gap-2">
              <i className={testStatus === 'success' ? 'ri-checkbox-circle-line text-green-400 mt-0.5' : 'ri-error-warning-line text-red-400 mt-0.5'} />
              <span className="leading-relaxed">{testMsg}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
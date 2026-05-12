import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface AiChatRequest {
  messages: ChatMessage[];
  provider: 'gemini' | 'groq' | 'openrouter';
  language: 'id' | 'en' | 'zh';
  model?: string;
}

const SYSTEM_PROMPTS: Record<string, string> = {
  id: `Kamu adalah AI Admin Copilot untuk PT Waringin Mega Mandiri (WMM), perusahaan konstruksi gedung di Jakarta, Indonesia. Bantu admin dengan pertanyaan seputar website, proyek, kandidat karir, berita, pengaturan situs, dan lainnya. Jawab dalam Bahasa Indonesia yang sopan dan profesional.`,
  en: `You are the AI Admin Copilot for PT Waringin Mega Mandiri (WMM), a building construction company in Jakarta, Indonesia. Help admin with questions about website, projects, career candidates, news, site settings, and more. Answer in polite and professional English.`,
  zh: `你是 PT Waringin Mega Mandiri (WMM) 的 AI 管理助手，这是一家位于印度尼西亚雅加达的建筑公司。帮助管理员解答有关网站、项目、职业候选人、新闻、网站设置等问题。用礼貌且专业的中文回答。`
};

/* ─── GROQ ────────────────────────────────────────────────────── */
async function callGroq(messages: ChatMessage[], apiKey: string, model: string) {
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.7,
      max_tokens: 2048
    })
  });

  const rawText = await res.text();
  console.log(`Groq response status: ${res.status}`);

  if (!res.ok) {
    let errMsg = `Groq HTTP ${res.status}: ${rawText}`;
    try {
      const errData = JSON.parse(rawText);
      errMsg = `Groq ${res.status}: ${errData.error?.message || errData.message || rawText}`;
    } catch { /* noop */ }
    throw new Error(errMsg);
  }

  const data = JSON.parse(rawText);
  if (data.error) throw new Error(data.error?.message || `Groq API error: ${JSON.stringify(data.error)}`);
  return data.choices?.[0]?.message?.content || 'No response from AI.';
}

/* ─── GEMINI ────────────────────────────────────────────────── */
async function callGemini(messages: ChatMessage[], apiKey: string, model: string) {
  const systemMsg = messages.find(m => m.role === 'system');
  const chatMessages = messages.filter(m => m.role !== 'system').map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }]
  }));

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const reqBody: Record<string, unknown> = {
    contents: chatMessages,
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 2048,
    }
  };

  if (systemMsg) {
    reqBody.systemInstruction = { parts: [{ text: systemMsg.content }] };
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reqBody)
  });

  const rawText = await res.text();
  console.log(`Gemini response status: ${res.status}`);

  if (!res.ok) {
    let errMsg = `Gemini HTTP ${res.status}: ${rawText}`;
    try {
      const errData = JSON.parse(rawText);
      errMsg = `Gemini ${res.status}: ${errData.error?.message || errData.message || rawText}`;
    } catch { /* noop */ }
    throw new Error(errMsg);
  }

  const data = JSON.parse(rawText);
  if (data.error) throw new Error(data.error?.message || `Gemini API error: ${JSON.stringify(data.error)}`);
  return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from AI.';
}

/* ─── OPENROUTER ────────────────────────────────────────────── */
async function callOpenRouter(messages: ChatMessage[], apiKey: string, model: string) {
  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://waringinmegamandiri.com',
      'X-Title': 'WMM AI Copilot'
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.7,
      max_tokens: 2048
    })
  });

  const rawText = await res.text();
  console.log(`OpenRouter response status: ${res.status}`);

  if (!res.ok) {
    let errMsg = `OpenRouter HTTP ${res.status}: ${rawText}`;
    try {
      const errData = JSON.parse(rawText);
      errMsg = `OpenRouter ${res.status}: ${errData.error?.message || errData.message || rawText}`;
    } catch { /* noop */ }
    throw new Error(errMsg);
  }

  const data = JSON.parse(rawText);
  if (data.error) throw new Error(data.error?.message || `OpenRouter API error: ${JSON.stringify(data.error)}`);
  return data.choices?.[0]?.message?.content || 'No response from AI.';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
      }
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body = await req.json() as AiChatRequest;
    const { messages, language, model, provider } = body;

    console.log('AI Chat request received, provider:', provider);

    // Get all AI config from DB
    const { data: configRows, error: configError } = await supabase
      .from('site_settings')
      .select('key, value')
      .in('key', ['ai_api_key', 'ai_provider', 'ai_model']);

    if (configError) {
      console.error('Config read error:', configError);
      return new Response(JSON.stringify({
        error: 'Gagal membaca konfigurasi AI dari database'
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

    const configMap: Record<string, string> = {};
    configRows?.forEach((r: { key: string; value: string }) => { configMap[r.key] = r.value || ''; });

    const apiKey = configMap.ai_api_key?.trim();
    const dbProvider = (configMap.ai_provider || 'groq') as 'gemini' | 'groq' | 'openrouter';
    const dbModel = configMap.ai_model;

    if (!apiKey || apiKey.length < 10) {
      console.error('API key not configured');
      return new Response(JSON.stringify({
        error: 'API key belum dikonfigurasi di site_settings'
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

    // Use provider from request if valid, otherwise DB fallback
    const activeProvider = (provider && ['gemini', 'groq', 'openrouter'].includes(provider))
      ? provider
      : dbProvider;

    // Default model per provider
    const defaultModels: Record<string, string> = {
      gemini: 'gemini-1.5-flash',
      groq: 'llama-3.3-70b-versatile',
      openrouter: 'openai/gpt-4o-mini'
    };
    const activeModel = model || dbModel || defaultModels[activeProvider] || defaultModels.groq;

    console.log('Active provider:', activeProvider, 'model:', activeModel);

    const systemPrompt = SYSTEM_PROMPTS[language] || SYSTEM_PROMPTS.id;
    const fullMessages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      ...messages
    ];

    try {
      let response: string;
      switch (activeProvider) {
        case 'gemini':
          response = await callGemini(fullMessages, apiKey, activeModel);
          break;
        case 'openrouter':
          response = await callOpenRouter(fullMessages, apiKey, activeModel);
          break;
        case 'groq':
        default:
          response = await callGroq(fullMessages, apiKey, activeModel);
          break;
      }
      console.log('AI response received, length:', response.length);
      return new Response(JSON.stringify({ response }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    } catch (aiErr: unknown) {
      const errMsg = aiErr instanceof Error ? aiErr.message : String(aiErr);
      console.error('AI Provider Error:', errMsg);
      return new Response(JSON.stringify({ error: errMsg }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : String(err);
    console.error('Edge Function Error:', errMsg);
    return new Response(JSON.stringify({ error: errMsg }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }
});

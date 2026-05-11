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
  id: `Kamu adalah AI Admin Copilot untuk PT Waringin Mega Mandiri (WMM), perusahaan konstruksi gedung di Jakarta, Indonesia.

Kemampuanmu:
1. Bantu admin mengelola website: tambah, edit, hapus proyek, artikel news, lowongan kerja.
2. Bantu ubah tema website: warna, layout, hero text, section visibility.
3. Generate gambar cover untuk proyek atau artikel.
4. Jawab pertanyaan tentang data perusahaan, proyek, dan konten website.
5. Brainstorm ide konten marketing.
6. Berikan saran SEO dan copywriting.

Gaya bicara: santai tapi profesional, seperti rekan kerja. Gunakan bahasa Indonesia gaul yang sopan. Format respons dengan jelas menggunakan bullet points atau numbered list jika perlu.

Jika user meminta aksi destructive (hapus data), ingatkan konsekuensinya dan minta konfirmasi.

Website menggunakan teknologi React + Tailwind + Supabase. Data proyek, news, careers tersimpan di Supabase. Tema dan pengaturan di site_settings.`,

  en: `You are the AI Admin Copilot for PT Waringin Mega Mandiri (WMM), a building construction company in Jakarta, Indonesia.

Your capabilities:
1. Help admin manage website: add, edit, delete projects, news articles, job openings.
2. Help change website theme: colors, layout, hero text, section visibility.
3. Generate cover images for projects or articles.
4. Answer questions about company data, projects, and website content.
5. Brainstorm content marketing ideas.
6. Give SEO and copywriting advice.

Tone: casual but professional, like a coworker. Use clear formatting with bullet points or numbered lists when helpful.

If user asks for destructive actions (delete data), warn about consequences and ask for confirmation.

The website uses React + Tailwind + Supabase. Project, news, and careers data is stored in Supabase. Theme and settings are in site_settings.`,

  zh: `你是 PT Waringin Mega Mandiri (WMM) 的 AI 管理助手，这是一家位于印度尼西亚雅加达的建筑公司。

你的能力：
1. 帮助管理员管理网站：添加、编辑、删除项目、新闻文章、职位空缺。
2. 帮助更改网站主题：颜色、布局、主横幅文字、版块可见性。
3. 为项目或文章生成封面图片。
4. 回答有关公司数据、项目和网站内容的问题。
5. 头脑风暴内容营销创意。
6. 提供 SEO 和文案建议。

语气：随和但专业，像同事一样。在有帮助时使用项目符号或编号列表进行清晰的格式化。

如果用户要求执行破坏性操作（删除数据），请提醒后果并要求确认。

网站使用 React + Tailwind + Supabase 技术。项目、新闻和职业数据存储在 Supabase 中。主题和设置位于 site_settings 中。`
};

async function callGemini(messages: ChatMessage[], apiKey: string, model: string) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const systemMsg = messages.find(m => m.role === 'system');
  const chatMessages = messages
    .filter(m => m.role !== 'system')
    .map(m => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }]
    }));

  const body: Record<string, unknown> = {
    contents: chatMessages,
    generationConfig: { temperature: 0.7, maxOutputTokens: 2048 }
  };

  if (systemMsg) {
    body.systemInstruction = { parts: [{ text: systemMsg.content }] };
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  const data = await res.json();
  if (data.error) throw new Error(data.error.message || 'Gemini API error');
  return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from AI.';
}

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

  const data = await res.json();
  if (data.error) throw new Error(data.error?.message || 'Groq API error');
  return data.choices?.[0]?.message?.content || 'No response from AI.';
}

async function callOpenRouter(messages: ChatMessage[], apiKey: string, model: string) {
  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://wmm.co.id',
      'X-Title': 'WMM Admin AI'
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.7,
      max_tokens: 2048
    })
  });

  const data = await res.json();
  if (data.error) throw new Error(data.error?.message || 'OpenRouter API error');
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
    const { messages, provider, language, model } = body;

    // Read API key from site_settings
    const { data: keyRow, error: keyError } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'ai_api_key')
      .maybeSingle();

    if (keyError || !keyRow?.value || keyRow.value.trim().length < 10) {
      return new Response(JSON.stringify({
        error: 'API key belum dikonfigurasi. Buka tab Pengaturan > AI Config untuk mengatur API key dari provider AI.'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

    const apiKey = keyRow.value.trim();

    const systemPrompt = SYSTEM_PROMPTS[language] || SYSTEM_PROMPTS.id;
    const fullMessages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      ...messages
    ];

    const selectedModel = model || {
      gemini: 'gemini-1.5-flash',
      groq: 'llama-3.1-70b-versatile',
      openrouter: 'meta-llama/llama-3.1-70b-instruct:free'
    }[provider] || 'gemini-1.5-flash';

    let response = '';
    switch (provider) {
      case 'gemini':
        response = await callGemini(fullMessages, apiKey, selectedModel);
        break;
      case 'groq':
        response = await callGroq(fullMessages, apiKey, selectedModel);
        break;
      case 'openrouter':
        response = await callOpenRouter(fullMessages, apiKey, selectedModel);
        break;
      default:
        response = await callGemini(fullMessages, apiKey, selectedModel);
    }

    return new Response(JSON.stringify({ response }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }
});
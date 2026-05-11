import { useState, useRef, useEffect, useCallback } from 'react';
import { parseIntent, executeIntent, CopilotMessage, ParsedIntent } from '../aiCopilot';
import { useAiChat } from '@/hooks/useAiChat';

interface AiCopilotPanelProps {
  onProjectAdded?: () => void;
  onNewsAdded?: () => void;
  onCareerAdded?: () => void;
  compact?: boolean;
}

const WELCOME_VARIATIONS = [
  'Halo! Gue AI Copilot WMM. Bisa bantu nambah proyek, ubah tema, generate gambar, atau sekadar ngobrol. Mau ngapain?',
  'Yo! Sini, gue bantu kelola website. Mau nambah proyek, brainstorm artikel, ubah warna, atau diskusi soal data?',
  'Halo Boss! Ready ngebantu. Tanya apa aja — data proyek, ide konten, setting website — atau langsung kasih perintah.',
];

const QUICK_PROMPTS = [
  'Lihat semua proyek',
  'Tambah proyek baru',
  'Ubah warna accent jadi merah',
  'Generate gambar hero',
  'Brainstorm ide artikel',
  'Bantuan',
];

const LOADING_VARIATIONS = [
  'Sedang berpikir...',
  'Otw proses...',
  'Ngecek database dulu...',
  'Hmm, bentar ya...',
  'Prosesin dulu...',
];

const LOADING_AI_VARIATIONS = [
  'AI sedang nulis respons...',
  'Ngobrol sama AI dulu...',
  'Nunggu AI ngerespon...',
  'AI lagi mikir...',
  'Sedang konsultasi dengan AI...',
];

const UNKNOWN_VARIATIONS = [
  'Hmm, gue belum nangkep maksudnya nih. Coba dengan cara lain, atau pilih dari tombol di bawah.',
  'Waduh, gue agak bingung. Mungkin mau coba perintah yang lebih spesifik?',
  'Belum paham nih. Yuk diskusi aja — mau nambah proyek, ubah tema, atau brainstorming konten?',
];

function getRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function AiCopilotPanel({ onProjectAdded, onNewsAdded, onCareerAdded, compact }: AiCopilotPanelProps) {
  const [messages, setMessages] = useState<CopilotMessage[]>([
    {
      role: 'assistant',
      content: compact
        ? getRandom([
            'Halo! AI Copilot WMM. Chat untuk nambah proyek, ubah tema, atau ngobrol.',
            'Yo! Sini gue bantu kelola website. Mau nambah proyek, brainstorm, atau diskusi data?',
          ])
        : getRandom(WELCOME_VARIATIONS),
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const [pendingIntent, setPendingIntent] = useState<ParsedIntent | null>(null);
  const [followUpIntent, setFollowUpIntent] = useState<ParsedIntent | null>(null);
  const [language, setLanguage] = useState<'id' | 'en' | 'zh'>('id');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { sendAiChat } = useAiChat();

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const addAssistantMessage = (content: string, action?: CopilotMessage['action'], payload?: unknown) => {
    const msg: CopilotMessage = {
      role: 'assistant',
      content,
      timestamp: Date.now(),
      action,
      payload,
    };
    setMessages((prev) => [...prev, msg]);
  };

  const sendMessage = async (text: string, skipConfirm = false) => {
    if (!text.trim() || loading) return;
    const trimmed = text.trim();

    const userMsg: CopilotMessage = { role: 'user', content: trimmed, timestamp: Date.now() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    // ── CONFIRM destructive actions ─────────────────────────────
    if (/^(ya|yes|ok|oke|iya|lanjutkan|go|confirm|setuju)$/i.test(trimmed) && pendingIntent && !skipConfirm) {
      setLoadingText('Jalanin perintah...');
      const res = await executeIntent(pendingIntent);
      addAssistantMessage(res.message, res.success ? 'success' : 'error', res.imageUrl);
      if (res.success) {
        if (pendingIntent.type === 'add_project') onProjectAdded?.();
        if (pendingIntent.type === 'add_news') onNewsAdded?.();
        if (pendingIntent.type === 'add_career') onCareerAdded?.();
      }
      setPendingIntent(null);
      setLoading(false);
      return;
    }

    if (/^(batal|cancel|no|tidak|nope)$/i.test(trimmed) && pendingIntent) {
      setPendingIntent(null);
      addAssistantMessage('Baik, gue batalkan ya.');
      setLoading(false);
      return;
    }

    // ── CONVERSATIONAL FOLLOW-UP ────────────────────────────────
    if (followUpIntent) {
      const followUp = parseIntent(trimmed, followUpIntent);
      if (followUp.type === 'followup_data') {
        setLoadingText('Lanjutin data...');
        const res = await executeIntent(followUp);
        addAssistantMessage(res.message, res.success ? 'success' : 'error', res.imageUrl);
        if (res.success && followUp.followUpFor) {
          if (followUp.followUpFor.type === 'add_project') onProjectAdded?.();
          if (followUp.followUpFor.type === 'add_news') onNewsAdded?.();
          if (followUp.followUpFor.type === 'add_career') onCareerAdded?.();
        }
        setFollowUpIntent(null);
        setLoading(false);
        return;
      }
    }

    // ── RULE-BASED INTENT PARSE ─────────────────────────────────
    const intent = parseIntent(trimmed);

    // If rule-based detected a CRUD action with high confidence → execute it
    const crudTypes = ['add_project', 'update_project', 'delete_project', 'add_news', 'update_news', 'delete_news',
      'add_career', 'update_career', 'delete_career', 'list_projects', 'list_news', 'list_careers',
      'update_setting', 'update_theme_color', 'update_hero_content', 'update_sections',
      'generate_image', 'generate_hero_image'];

    if (intent.type !== 'unknown' && intent.type !== 'help' && (intent.confidence === 'high' || crudTypes.includes(intent.type))) {
      setLoadingText(getRandom(LOADING_VARIATIONS));
      const res = await executeIntent(intent);

      if (res.needsFollowUp && res.followUpFor) {
        setFollowUpIntent(res.followUpFor);
        addAssistantMessage(res.message, 'followup');
        setLoading(false);
        return;
      }

      const needsConfirm = ['delete_project','delete_news','delete_career','update_setting','update_project','update_news','update_career','generate_image','update_theme_color','update_hero_content','update_sections','generate_hero_image'].includes(intent.type);

      if (needsConfirm && !skipConfirm) {
        setPendingIntent(intent);
        addAssistantMessage(res.message, 'confirm');
        setLoading(false);
        return;
      }

      addAssistantMessage(res.message, res.success ? 'success' : 'error', res.imageUrl);
      if (res.success) {
        if (intent.type === 'add_project') onProjectAdded?.();
        if (intent.type === 'add_news') onNewsAdded?.();
        if (intent.type === 'add_career') onCareerAdded?.();
      }
      setLoading(false);
      return;
    }

    // ── FALLBACK TO EXTERNAL AI ──────────────────────────────────
    // If rule-based returns unknown or help → ask external AI for natural response
    setLoadingText(getRandom(LOADING_AI_VARIATIONS));

    const aiResponse = await sendAiChat(
      [...messages, userMsg].slice(-10), // Send last 10 messages as context
      language
    );

    addAssistantMessage(aiResponse, 'ai_response');
    setLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <div className={`flex flex-col h-full ${compact ? '' : 'max-h-[calc(100vh-140px)]'}`}>
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto px-4 pt-3 pb-1 space-y-3 min-h-[80px]">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[90%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-amber-400 text-black'
                  : msg.action === 'followup'
                  ? 'bg-sky-500/10 border border-sky-500/30 text-sky-300'
                  : msg.action === 'confirm'
                  ? 'bg-yellow-500/15 border border-yellow-500/30 text-yellow-300'
                  : msg.action === 'success'
                  ? 'bg-green-500/10 border border-green-500/20 text-green-300'
                  : msg.action === 'error'
                  ? 'bg-red-500/10 border border-red-500/20 text-red-300'
                  : msg.action === 'ai_response'
                  ? 'bg-[#111827] border border-slate-700 text-slate-300'
                  : 'bg-[#0D1117] border border-slate-800 text-slate-300'
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.content}</div>
              {msg.action === 'image_preview' && msg.payload && (
                <div className="mt-2 rounded-xl overflow-hidden border border-amber-400/20">
                  <img
                    src={msg.payload as string}
                    alt="Generated cover"
                    className="w-full h-32 object-cover"
                    loading="lazy"
                  />
                  <div className="bg-black/40 px-3 py-1 text-[10px] text-slate-400 flex items-center gap-1.5">
                    <i className="ri-image-line" />
                    Cover image berhasil di-generate
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-[#0D1117] border border-slate-800 rounded-2xl px-3.5 py-2.5 flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              <span className="text-slate-500 text-[10px] ml-1">{loadingText}</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick prompts */}
      <div className="px-4 pt-2 pb-1 flex flex-wrap gap-1.5">
        {QUICK_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            onClick={() => sendMessage(prompt, true)}
            disabled={loading}
            className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-2.5 py-1 rounded-full border border-slate-700 transition-colors cursor-pointer whitespace-nowrap disabled:opacity-50"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input + Language */}
      <div className="px-3 pb-3 pt-1">
        <div className="bg-[#0D1117] border border-slate-700 rounded-2xl flex items-end gap-2 px-3 py-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            placeholder={pendingIntent ? 'Ketik "ya" untuk lanjut atau "batal"...' : 'Ketik perintah atau ngobrol sama AI...'}
            className="flex-1 bg-transparent text-xs text-white placeholder-slate-600 focus:outline-none resize-none max-h-24 py-1.5"
            disabled={loading}
          />
          <div className="flex items-center gap-1.5 shrink-0 pb-0.5">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as 'id' | 'en' | 'zh')}
              className="bg-slate-800 border border-slate-700 rounded-md text-[10px] text-slate-400 px-1.5 py-1 cursor-pointer focus:outline-none"
            >
              <option value="id">ID</option>
              <option value="en">EN</option>
              <option value="zh">中文</option>
            </select>
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || loading}
              className="w-7 h-7 flex items-center justify-center rounded-lg bg-amber-400 hover:bg-amber-300 text-black shrink-0 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <i className="ri-send-plane-fill text-xs" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
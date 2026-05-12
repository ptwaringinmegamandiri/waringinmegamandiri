import { useRef, useState, useCallback, useEffect } from 'react';
import { renderRichText, stripColorTags, RichTextSegment } from '@/lib/richText';

interface RichTextEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  maxLength?: number;
}

const PRESET_COLORS = [
  '#EF4444', '#DC2626', '#B91C1C',
  '#F97316', '#EA580C', '#C2410C',
  '#F59E0B', '#D97706', '#B45309',
  '#84CC16', '#65A30D', '#4D7C0F',
  '#10B981', '#059669', '#047857',
  '#06B6D4', '#0891B2', '#0E7490',
  '#3B82F6', '#2563EB', '#1D4ED8',
  '#6366F1', '#4F46E5', '#4338CA',
  '#8B5CF6', '#7C3AED', '#6D28D9',
  '#EC4899', '#DB2777', '#BE185D',
  '#F43F5E', '#E11D48', '#BE123C',
  '#1E293B', '#334155', '#475569',
  '#FFFFFF', '#94A3B8', '#64748B',
];

interface FormatState {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  color: string;
  bg: string;
}

const DEFAULT_FORMAT: FormatState = {
  bold: false,
  italic: false,
  underline: false,
  color: '',
  bg: '',
};

/* Convert markup [color=#hex][bold]text[/bold][/color] → HTML */
function markupToHtml(markup: string): string {
  if (!markup) return '<br>';
  return markup
    .replace(/\[/g, '<').replace(/\]/g, '>')
    .replace(/<color=([^>]+)>/g, '<span style="color:$1">')
    .replace(/<\/color>/g, '</span>')
    .replace(/<bold>/g, '<strong>')
    .replace(/<\/bold>/g, '</strong>')
    .replace(/<italic>/g, '<em>')
    .replace(/<\/italic>/g, '</em>')
    .replace(/<underline>/g, '<u>')
    .replace(/<\/underline>/g, '</u>')
    .replace(/<bg=([^>]+)>/g, '<span style="background-color:$1">')
    .replace(/<\/bg>/g, '</span>')
    .replace(/\n/g, '<br>');
}

/* Convert HTML → markup [color=#hex][bold]text[/bold][/color] */
function htmlToMarkup(html: string): string {
  let text = html;
  // Temporarily replace nested spans with placeholders
  const placeholders: { id: string; html: string; markup: string }[] = [];
  let placeholderId = 0;

  // Replace background spans first (innermost)
  text = text.replace(/<span[^>]*style="[^"]*background-color:\s*([^;"]+)[^"]*"[^>]*>(.*?)<\/span>/gi, (match, color, content) => {
    const id = `__PH${placeholderId++}__`;
    placeholders.push({ id, html: match, markup: `[bg=${color}]${content}[/bg]` });
    return id;
  });

  // Replace color spans
  text = text.replace(/<span[^>]*style="[^"]*color:\s*([^;"]+)[^"]*"[^>]*>(.*?)<\/span>/gi, (match, color, content) => {
    const id = `__PH${placeholderId++}__`;
    placeholders.push({ id, html: match, markup: `[color=${color}]${content}[/color]` });
    return id;
  });

  // Replace strong/bold
  text = text.replace(/<(strong|b)[^>]*>(.*?)<\/(strong|b)>/gi, '[bold]$2[/bold]');
  // Replace em/italic
  text = text.replace(/<(em|i)[^>]*>(.*?)<\/(em|i)>/gi, '[italic]$2[/italic]');
  // Replace underline
  text = text.replace(/<u[^>]*>(.*?)<\/u>/gi, '[underline]$1[/underline]');

  // Replace line breaks
  text = text.replace(/<br\s*\/?>/gi, '\n');
  text = text.replace(/<div[^>]*>/gi, '\n');
  text = text.replace(/<\/div>/gi, '');
  text = text.replace(/<p[^>]*>/gi, '');
  text = text.replace(/<\/p>/gi, '\n');

  // Strip remaining HTML
  text = text.replace(/<[^>]+>/g, '');

  // Restore placeholders
  placeholders.forEach((ph) => {
    text = text.replace(ph.id, ph.markup);
  });

  return text.trim();
}

/* Walk DOM and extract formatted segments */
function extractSegments(node: Node): RichTextSegment[] {
  const segments: RichTextSegment[] = [];
  const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT, null);
  let current: Node | null;
  let buffer = '';
  let formats = {
    bold: false, italic: false, underline: false,
    color: '', bg: '',
  };

  function pushBuffer() {
    if (buffer) {
      const seg: RichTextSegment = { text: buffer };
      if (formats.bold) seg.bold = true;
      if (formats.italic) seg.italic = true;
      if (formats.underline) seg.underline = true;
      if (formats.color) seg.color = formats.color;
      if (formats.bg) seg.bg = formats.bg;
      segments.push(seg);
      buffer = '';
    }
  }

  while ((current = walker.nextNode()) !== null) {
    if (current.nodeType === Node.TEXT_NODE) {
      buffer += current.textContent || '';
    } else if (current.nodeType === Node.ELEMENT_NODE) {
      const el = current as HTMLElement;
      const tag = el.tagName.toLowerCase();

      // Check for formatting changes
      const isBold = tag === 'strong' || tag === 'b' || el.style.fontWeight === 'bold' || parseInt(el.style.fontWeight || '0') >= 600;
      const isItalic = tag === 'em' || tag === 'i' || el.style.fontStyle === 'italic';
      const isUnderline = tag === 'u' || el.style.textDecoration === 'underline';
      const color = el.style.color || '';
      const bg = el.style.backgroundColor || '';

      const newFormats = {
        bold: formats.bold || isBold,
        italic: formats.italic || isItalic,
        underline: formats.underline || isUnderline,
        color: formats.color || color,
        bg: formats.bg || bg,
      };

      // If format changes and we have buffer, push it first
      if (JSON.stringify(newFormats) !== JSON.stringify(formats) && buffer) {
        pushBuffer();
      }
      formats = newFormats;
    }
  }

  pushBuffer();
  return segments;
}

/* Segments → markup string */
function segmentsToMarkup(segments: RichTextSegment[]): string {
  return segments.map((seg) => {
    let text = seg.text;
    if (seg.bg) text = `[bg=${seg.bg}]${text}[/bg]`;
    if (seg.color) text = `[color=${seg.color}]${text}[/color]`;
    if (seg.underline) text = `[underline]${text}[/underline]`;
    if (seg.italic) text = `[italic]${text}[/italic]`;
    if (seg.bold) text = `[bold]${text}[/bold]`;
    return text;
  }).join('');
}

export default function RichTextEditor({ value, onChange, placeholder, maxLength }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [activeColor, setActiveColor] = useState('#EF4444');
  const [activeBg, setActiveBg] = useState('#FEF08A');
  const [showColorPicker, setShowColorPicker] = useState<'none' | 'text' | 'bg'>('none');
  const [customColor, setCustomColor] = useState('#EF4444');
  const [customBg, setCustomBg] = useState('#FEF08A');
  const [rawTextLength, setRawTextLength] = useState(stripColorTags(value).length);
  const [formatState, setFormatState] = useState<FormatState>(DEFAULT_FORMAT);

  // Sync initial value
  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;
    const newHtml = markupToHtml(value);
    if (el.innerHTML !== newHtml) {
      el.innerHTML = newHtml;
    }
    setRawTextLength(stripColorTags(value).length);
  }, [value]);

  const extractAndSave = useCallback(() => {
    const el = editorRef.current;
    if (!el) return;
    const html = el.innerHTML;
    const markup = htmlToMarkup(html);
    setRawTextLength(stripColorTags(markup).length);
    onChange(markup);
  }, [onChange]);

  /* Apply execCommand formatting */
  const execFormat = useCallback((command: string, val?: string) => {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || !editorRef.current?.contains(sel.anchorNode)) {
      // Just toggle the format state for next typing
      if (command === 'bold') setFormatState(s => ({ ...s, bold: !s.bold }));
      if (command === 'italic') setFormatState(s => ({ ...s, italic: !s.italic }));
      if (command === 'underline') setFormatState(s => ({ ...s, underline: !s.underline }));
      return;
    }
    document.execCommand('styleWithCSS', false, 'true');
    document.execCommand(command, false, val);
    extractAndSave();
  }, [extractAndSave]);

  /* Apply color to selection */
  const applyColor = useCallback((color: string, type: 'text' | 'bg') => {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || !editorRef.current?.contains(sel.anchorNode)) {
      if (type === 'text') { setActiveColor(color); setFormatState(s => ({ ...s, color })); }
      else { setActiveBg(color); setFormatState(s => ({ ...s, bg: color })); }
      return;
    }
    document.execCommand('styleWithCSS', false, 'true');
    if (type === 'text') {
      document.execCommand('foreColor', false, color);
      setActiveColor(color);
    } else {
      document.execCommand('hiliteColor', false, color);
      setActiveBg(color);
    }
    setShowColorPicker('none');
    extractAndSave();
  }, [extractAndSave]);

  /* Remove color */
  const removeColor = useCallback((type: 'text' | 'bg') => {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || !editorRef.current?.contains(sel.anchorNode)) {
      if (type === 'text') setFormatState(s => ({ ...s, color: '' }));
      else setFormatState(s => ({ ...s, bg: '' }));
      return;
    }
    document.execCommand('styleWithCSS', false, 'true');
    if (type === 'text') document.execCommand('foreColor', false, 'inherit');
    else document.execCommand('hiliteColor', false, 'transparent');
    setShowColorPicker('none');
    extractAndSave();
  }, [extractAndSave]);

  /* Remove all formatting */
  const clearAll = useCallback(() => {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || !editorRef.current?.contains(sel.anchorNode)) return;
    document.execCommand('removeFormat', false, undefined);
    setFormatState(DEFAULT_FORMAT);
    extractAndSave();
  }, [extractAndSave]);

  // Keyboard shortcuts
  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        execFormat('bold');
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'i') {
        e.preventDefault();
        execFormat('italic');
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'u') {
        e.preventDefault();
        execFormat('underline');
      }
    };
    el.addEventListener('keydown', handler);
    return () => el.removeEventListener('keydown', handler);
  }, [execFormat]);

  // Update format state on selection change
  useEffect(() => {
    const handler = () => {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed || !editorRef.current?.contains(sel.anchorNode)) return;
      // Query command state
      try {
        const bold = document.queryCommandState('bold');
        const italic = document.queryCommandState('italic');
        const underline = document.queryCommandState('underline');
        setFormatState({ bold, italic, underline, color: activeColor, bg: activeBg });
      } catch {
        // ignore
      }
    };
    document.addEventListener('selectionchange', handler);
    return () => document.removeEventListener('selectionchange', handler);
  }, [activeColor, activeBg]);

  const isBoldActive = formatState.bold;
  const isItalicActive = formatState.italic;
  const isUnderlineActive = formatState.underline;

  return (
    <div className="relative border border-slate-700 rounded-xl overflow-hidden bg-[#0D1117]">
      {/* ===== TOOLBAR ===== */}
      <div className="flex items-center gap-0.5 px-2 py-1.5 bg-[#161B22] border-b border-slate-700 flex-wrap">
        {/* Bold */}
        <button
          onClick={() => execFormat('bold')}
          className={`w-7 h-7 flex items-center justify-center rounded hover:bg-slate-700 transition-colors cursor-pointer font-bold text-sm ${isBoldActive ? 'bg-slate-600 text-white' : 'text-slate-300'}`}
          title="Bold (Ctrl+B)"
        >
          B
        </button>

        {/* Italic */}
        <button
          onClick={() => execFormat('italic')}
          className={`w-7 h-7 flex items-center justify-center rounded hover:bg-slate-700 transition-colors cursor-pointer italic text-sm ${isItalicActive ? 'bg-slate-600 text-white' : 'text-slate-300'}`}
          title="Italic (Ctrl+I)"
        >
          I
        </button>

        {/* Underline */}
        <button
          onClick={() => execFormat('underline')}
          className={`w-7 h-7 flex items-center justify-center rounded hover:bg-slate-700 transition-colors cursor-pointer underline text-sm ${isUnderlineActive ? 'bg-slate-600 text-white' : 'text-slate-300'}`}
          title="Underline (Ctrl+U)"
        >
          U
        </button>

        <div className="w-px h-4 bg-slate-700 mx-1" />

        {/* Text Color */}
        <div className="relative">
          <button
            onClick={() => setShowColorPicker(showColorPicker === 'text' ? 'none' : 'text')}
            className="flex items-center gap-1 px-1.5 py-1 rounded hover:bg-slate-700 transition-colors cursor-pointer"
            title="Warna teks"
          >
            <span className="text-sm font-serif text-slate-300">A</span>
            <div className="w-3.5 h-1 rounded-full" style={{ backgroundColor: activeColor }} />
          </button>

          {showColorPicker === 'text' && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowColorPicker('none')} />
              <div className="absolute top-full left-0 mt-1 z-20 bg-[#1E293B] border border-slate-600 rounded-lg shadow-2xl p-2.5 w-56">
                <p className="text-[10px] text-slate-500 mb-2 font-semibold">Warna Teks</p>
                <div className="grid grid-cols-9 gap-1 mb-2">
                  {PRESET_COLORS.map((c) => (
                    <button
                      key={`text-${c}`}
                      onClick={() => applyColor(c, 'text')}
                      className="w-5 h-5 rounded hover:scale-110 transition-transform cursor-pointer border border-slate-600/20"
                      style={{ backgroundColor: c }}
                      title={c}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-2 border-t border-slate-700 pt-2">
                  <input
                    type="color"
                    value={customColor}
                    onChange={(e) => setCustomColor(e.target.value)}
                    className="w-6 h-6 rounded cursor-pointer border-0 p-0"
                  />
                  <button
                    onClick={() => applyColor(customColor, 'text')}
                    className="text-[10px] text-slate-300 hover:text-white px-2 py-1 rounded hover:bg-slate-700 transition-colors cursor-pointer"
                  >
                    Terapkan
                  </button>
                  <button
                    onClick={() => removeColor('text')}
                    className="text-[10px] text-slate-400 hover:text-red-400 px-2 py-1 rounded hover:bg-slate-700 transition-colors cursor-pointer ml-auto"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Highlight Color */}
        <div className="relative">
          <button
            onClick={() => setShowColorPicker(showColorPicker === 'bg' ? 'none' : 'bg')}
            className="flex items-center gap-1 px-1.5 py-1 rounded hover:bg-slate-700 transition-colors cursor-pointer"
            title="Highlight background"
          >
            <span className="text-sm font-serif text-slate-300" style={{ backgroundColor: activeBg, color: '#000' }}>A</span>
            <div className="w-3.5 h-1 rounded-full" style={{ backgroundColor: activeBg }} />
          </button>

          {showColorPicker === 'bg' && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowColorPicker('none')} />
              <div className="absolute top-full left-0 mt-1 z-20 bg-[#1E293B] border border-slate-600 rounded-lg shadow-2xl p-2.5 w-56">
                <p className="text-[10px] text-slate-500 mb-2 font-semibold">Highlight</p>
                <div className="grid grid-cols-9 gap-1 mb-2">
                  {PRESET_COLORS.map((c) => (
                    <button
                      key={`bg-${c}`}
                      onClick={() => applyColor(c, 'bg')}
                      className="w-5 h-5 rounded hover:scale-110 transition-transform cursor-pointer border border-slate-600/20"
                      style={{ backgroundColor: c }}
                      title={c}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-2 border-t border-slate-700 pt-2">
                  <input
                    type="color"
                    value={customBg}
                    onChange={(e) => setCustomBg(e.target.value)}
                    className="w-6 h-6 rounded cursor-pointer border-0 p-0"
                  />
                  <button
                    onClick={() => applyColor(customBg, 'bg')}
                    className="text-[10px] text-slate-300 hover:text-white px-2 py-1 rounded hover:bg-slate-700 transition-colors cursor-pointer"
                  >
                    Terapkan
                  </button>
                  <button
                    onClick={() => removeColor('bg')}
                    className="text-[10px] text-slate-400 hover:text-red-400 px-2 py-1 rounded hover:bg-slate-700 transition-colors cursor-pointer ml-auto"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="w-px h-4 bg-slate-700 mx-1" />

        {/* Clear formatting */}
        <button
          onClick={clearAll}
          className="px-2 py-1 rounded hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          title="Hapus semua format"
        >
          <i className="ri-format-clear text-sm" />
        </button>

        <div className="flex-1" />

        {/* Char count */}
        {maxLength && (
          <span className="text-[10px] text-slate-600">
            {rawTextLength}/{maxLength}
          </span>
        )}
      </div>

      {/* ===== EDITOR AREA ===== */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={extractAndSave}
        onBlur={extractAndSave}
        className="w-full px-3 py-2.5 text-sm text-white min-h-[120px] whitespace-pre-wrap break-words outline-none empty:before:content-[attr(data-placeholder)] empty:before:text-slate-600"
        data-placeholder={placeholder || 'Ketik teks... select bagian lalu klik Bold/Italic/Color di toolbar'}
      />

      {/* ===== LIVE PREVIEW ===== */}
      {value && (
        <div className="border-t border-slate-800 px-3 py-2 bg-[#0D1117]/80">
          <p className="text-[10px] text-slate-600 mb-1 font-semibold">Preview:</p>
          <div className="text-sm leading-relaxed">
            {renderRichText(value)}
          </div>
        </div>
      )}
    </div>
  );
}
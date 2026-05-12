import { useRef, useState, useEffect, useCallback } from 'react';

const PAGES = [
  { key: 'home', label: 'Beranda' },
  { key: 'about', label: 'Tentang Kami' },
  { key: 'portfolio', label: 'Portofolio' },
  { key: 'news', label: 'News' },
  { key: 'karir', label: 'Karir' },
  { key: 'kontak', label: 'Kontak' },
];

const MOBILE_WIDTH = 375;
const MOBILE_HEIGHT = 812;

export interface InlineEditPayload {
  id: string;
  label: string;
  editableFields: string[];
  editField: string;
}

interface LivePreviewProps {
  themeData?: Record<string, string>;
  sectionsData?: Record<string, boolean>;
  onSelectSection?: (id: string) => void;
  onInlineEdit?: (payload: InlineEditPayload) => void;
  editMode?: boolean;
  onToggleEditMode?: () => void;
  selectedSection?: string | null;
}

export default function LivePreview({
  themeData,
  sectionsData,
  onSelectSection,
  onInlineEdit,
  editMode: externalEditMode,
  onToggleEditMode,
  selectedSection,
}: LivePreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [internalEditMode, setInternalEditMode] = useState(false);
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'mobile'>('desktop');

  const editMode = externalEditMode ?? internalEditMode;

  const postTheme = useCallback((theme?: Record<string, string>, sections?: Record<string, boolean>) => {
    const iframe = iframeRef.current;
    if (!iframe?.contentWindow) return;
    iframe.contentWindow.postMessage(
      { type: 'WMM_THEME_UPDATE', theme: theme || themeData || {}, sections: sections || sectionsData || {} },
      '*'
    );
  }, [themeData, sectionsData]);

  const switchPage = useCallback((page: string) => {
    const iframe = iframeRef.current;
    if (!iframe?.contentWindow) return;
    iframe.contentWindow.postMessage({ type: 'WMM_PREVIEW_SWITCH_PAGE', page }, '*');
    setCurrentPage(page);
  }, []);

  const handleLoad = () => {
    setLoaded(true);
    const iframe = iframeRef.current;
    if (iframe?.contentWindow) {
      iframe.contentWindow.postMessage(
        { type: 'WMM_THEME_UPDATE', theme: themeData || {}, sections: sectionsData || {} },
        '*'
      );
      iframe.contentWindow.postMessage({ type: 'WMM_PREVIEW_SWITCH_PAGE', page: currentPage }, '*');
      iframe.contentWindow.postMessage({ type: 'WMM_PREVIEW_EDIT_MODE', enabled: editMode }, '*');
    }
  };

  // Listen for messages from iframe (section select + inline edit)
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type === 'WMM_PREVIEW_SELECTED' && e.data.id) {
        onSelectSection?.(e.data.id);
      }
      if (e.data?.type === 'WMM_PREVIEW_INLINE_EDIT') {
        onInlineEdit?.({
          id: e.data.id,
          label: e.data.label,
          editableFields: e.data.editableFields || [],
          editField: e.data.editField,
        });
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [onSelectSection, onInlineEdit]);

  // Sync editMode to iframe
  useEffect(() => {
    const iframe = iframeRef.current;
    if (iframe?.contentWindow) {
      iframe.contentWindow.postMessage({ type: 'WMM_PREVIEW_EDIT_MODE', enabled: editMode }, '*');
    }
  }, [editMode]);

  // Sync selectedSection highlight to iframe
  useEffect(() => {
    const iframe = iframeRef.current;
    if (iframe?.contentWindow && selectedSection) {
      iframe.contentWindow.postMessage({ type: 'WMM_PREVIEW_HIGHLIGHT', id: selectedSection }, '*');
    }
  }, [selectedSection]);

  const handleToggleEdit = () => {
    if (onToggleEditMode) {
      onToggleEditMode();
    } else {
      setInternalEditMode(v => !v);
    }
  };

  // Expose postTheme so parent can manually push fresh data after save
  useEffect(() => {
    const handler = (e: CustomEvent) => {
      if (e.detail?.type === 'WMM_LIVE_PREVIEW_PUSH_THEME') {
        postTheme(e.detail.theme, e.detail.sections);
      }
    };
    window.addEventListener('WMM_LIVE_PREVIEW_PUSH_THEME' as any, handler);
    return () => window.removeEventListener('WMM_LIVE_PREVIEW_PUSH_THEME' as any, handler);
  }, [postTheme]);

  const iframeUrl = `${window.location.origin}${__BASE_PATH__ || ''}/preview?page=${currentPage}`;

  return (
    <div className="w-full h-full flex flex-col rounded-2xl border border-slate-700/50 bg-[#050A14] relative overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-3 py-2 bg-[#0D1117] border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          {PAGES.map((p) => (
            <button
              key={p.key}
              onClick={() => switchPage(p.key)}
              className={`px-2.5 py-1 rounded-md text-[10px] font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                currentPage === p.key
                  ? 'bg-amber-400/15 text-amber-400 border border-amber-400/30'
                  : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 shrink-0 ml-2">
          {/* Device toggle */}
          <div className="flex items-center bg-slate-800 rounded-md p-0.5">
            <button
              onClick={() => setDeviceMode('desktop')}
              className={`px-2 py-0.5 rounded text-[10px] transition-colors cursor-pointer ${
                deviceMode === 'desktop'
                  ? 'bg-slate-600 text-white'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
              title="Desktop"
            >
              <i className="ri-computer-line" />
            </button>
            <button
              onClick={() => setDeviceMode('mobile')}
              className={`px-2 py-0.5 rounded text-[10px] transition-colors cursor-pointer ${
                deviceMode === 'mobile'
                  ? 'bg-slate-600 text-white'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
              title="Mobile"
            >
              <i className="ri-smartphone-line" />
            </button>
          </div>

          <div className="w-px h-3 bg-slate-700" />

          <button
            onClick={handleToggleEdit}
            className={`flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-semibold cursor-pointer transition-colors whitespace-nowrap ${
              editMode
                ? 'bg-amber-400/15 text-amber-400 border border-amber-400/30'
                : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'
            }`}
            title="Klik section di preview untuk edit"
          >
            <i className={editMode ? 'ri-cursor-fill' : 'ri-cursor-line'} />
            {editMode ? 'Edit ON' : 'Select to Edit'}
          </button>
          <div className="w-px h-3 bg-slate-700" />
          <div className="flex items-center gap-1 text-[10px] text-slate-500">
            <div className={`w-1.5 h-1.5 rounded-full ${loaded ? 'bg-green-400 animate-pulse' : 'bg-yellow-400'}`} />
            {loaded ? 'live' : 'load'}
          </div>
        </div>
      </div>

      {/* Preview Container */}
      <div className={`flex-1 overflow-auto ${deviceMode === 'mobile' ? 'bg-slate-900/50' : ''}`}>
        {deviceMode === 'mobile' ? (
          /* Mobile: centered phone frame with proper scroll */
          <div className="min-h-full flex items-start justify-center py-6 px-4">
            <div className="relative shrink-0 rounded-[32px] border-[8px] border-slate-800 bg-slate-800 overflow-hidden shadow-2xl">
              {/* Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-5 bg-slate-800 rounded-b-xl z-10" />
              <iframe
                ref={iframeRef}
                src={iframeUrl}
                onLoad={handleLoad}
                className="border-0 bg-white block"
                style={{
                  width: MOBILE_WIDTH,
                  height: MOBILE_HEIGHT,
                  maxWidth: '100%',
                  borderRadius: '24px',
                }}
                title="Website Preview Mobile"
              />
            </div>
          </div>
        ) : (
          /* Desktop: full width */
          <iframe
            ref={iframeRef}
            src={iframeUrl}
            onLoad={handleLoad}
            className="w-full h-full border-0"
            style={{ minHeight: 0 }}
            title="Website Preview"
          />
        )}
      </div>
    </div>
  );
}
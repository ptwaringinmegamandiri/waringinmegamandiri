import { useEffect, useState, useRef, Suspense, lazy } from 'react';
import { useSearchParams } from 'react-router-dom';

const HomePage = lazy(() => import('@/pages/home/page'));
const AboutPage = lazy(() => import('@/pages/about/page'));
const PortfolioPage = lazy(() => import('@/pages/portfolio/page'));
const NewsPage = lazy(() => import('@/pages/news/page'));
const KarirPage = lazy(() => import('@/pages/karir/page'));
const KontakPage = lazy(() => import('@/pages/kontak/page'));

const PAGES = [
  { key: 'home', label: 'Beranda', path: '/' },
  { key: 'about', label: 'Tentang Kami', path: '/tentang-kami' },
  { key: 'portfolio', label: 'Portofolio', path: '/portofolio' },
  { key: 'news', label: 'News', path: '/news' },
  { key: 'karir', label: 'Karir', path: '/karir' },
  { key: 'kontak', label: 'Kontak', path: '/kontak' },
];

export default function PreviewPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [editMode, setEditMode] = useState(false);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [hoveredElement, setHoveredElement] = useState<string | null>(null);
  const mainRef = useRef<HTMLDivElement>(null);

  // Sync selectedElement to DOM class
  useEffect(() => {
    document.querySelectorAll('[data-preview-id].selected-preview').forEach((el) => {
      el.classList.remove('selected-preview');
    });
    if (selectedElement) {
      const el = document.querySelector(`[data-preview-id="${selectedElement}"]`);
      if (el) el.classList.add('selected-preview');
    }
  }, [selectedElement]);

  const currentPage = searchParams.get('page') || 'home';

  // Send height to parent iframe
  useEffect(() => {
    const sendHeight = () => {
      const h = document.documentElement.scrollHeight;
      window.parent.postMessage({ type: 'WMM_PREVIEW_HEIGHT', height: h }, '*');
    };
    const timer = setTimeout(sendHeight, 300);
    window.addEventListener('load', sendHeight);
    const observer = new ResizeObserver(() => sendHeight());
    observer.observe(document.documentElement);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('load', sendHeight);
      observer.disconnect();
    };
  }, [currentPage]);

  // Listen for postMessage from admin (page switch, edit mode, theme updates, highlight)
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type === 'WMM_THEME_UPDATE') {
        const incomingTheme = e.data.theme as Record<string, string>;
        const incomingSections = e.data.sections as Record<string, boolean>;
        if (incomingTheme && Object.keys(incomingTheme).length > 0) {
          const root = document.documentElement;
          if (incomingTheme.accent_color) {
            root.style.setProperty('--accent', incomingTheme.accent_color);
            const r = parseInt(incomingTheme.accent_color.slice(1, 3), 16);
            const g = parseInt(incomingTheme.accent_color.slice(3, 5), 16);
            const b = parseInt(incomingTheme.accent_color.slice(5, 7), 16);
            root.style.setProperty('--accent-soft', `rgba(${r},${g},${b},0.55)`);
          }
          if (incomingTheme.secondary_color) {
            root.style.setProperty('--secondary', incomingTheme.secondary_color);
          }
          if (incomingTheme.theme_mode) {
            root.setAttribute('data-theme', incomingTheme.theme_mode);
          }
        }
        if (incomingSections) {
          window.dispatchEvent(new CustomEvent('WMM_SECTIONS_UPDATE', { detail: incomingSections }));
        }
      }
      if (e.data?.type === 'WMM_PREVIEW_SWITCH_PAGE') {
        const page = e.data.page as string;
        if (page && PAGES.some((p) => p.key === page)) {
          setSearchParams({ page });
        }
      }
      if (e.data?.type === 'WMM_PREVIEW_EDIT_MODE') {
        setEditMode(!!e.data.enabled);
      }
      if (e.data?.type === 'WMM_PREVIEW_HIGHLIGHT') {
        const id = e.data.id as string;
        setSelectedElement(id);
        // Scroll into view after a short delay for layout
        setTimeout(() => {
          const el = document.querySelector(`[data-preview-id="${id}"]`);
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 200);
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [setSearchParams]);

  // Edit mode: lock all interactions, only allow section selection
  useEffect(() => {
    if (!editMode) {
      setSelectedElement(null);
      setHoveredElement(null);
      return;
    }

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const section = target.closest('[data-preview-id]') as HTMLElement | null;
      if (section) {
        setHoveredElement(section.dataset.previewId || null);
        e.stopPropagation();
      }
    };

    const handleClick = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const target = e.target as HTMLElement;
      const section = target.closest('[data-preview-id]') as HTMLElement | null;

      if (section) {
        const id = section.dataset.previewId || '';
        const label = section.dataset.previewLabel || '';
        const editableFields = section.dataset.editableFields || '';
        const editField = section.dataset.editField || '';
        setSelectedElement(id);
        window.parent.postMessage({ type: 'WMM_PREVIEW_SELECTED', id }, '*');
        window.parent.postMessage({
          type: 'WMM_PREVIEW_INLINE_EDIT',
          id,
          label,
          editableFields: editableFields.split(',').filter(Boolean),
          editField,
        }, '*');
      }
    };

    // ─── BRUTE FORCE: Disable every possible navigation mechanism ───

    // 1. Override history.pushState / replaceState
    const origPushState = history.pushState.bind(history);
    const origReplaceState = history.replaceState.bind(history);
    const blockHistory = (...args: unknown[]) => {
      const url = args[2];
      if (typeof url === 'string') {
        const resolved = new URL(url, window.location.href).pathname;
        if (resolved === '/preview' || resolved.startsWith('/preview')) {
          return origPushState(...(args as [unknown, string, string | URL | null]));
        }
      }
      console.log('[Preview Edit] Blocked history navigation');
      return undefined;
    };
    history.pushState = blockHistory;
    history.replaceState = blockHistory;

    // 2. Override window.location.href setter
    const locHrefDesc = Object.getOwnPropertyDescriptor(window.location, 'href');
    if (locHrefDesc && locHrefDesc.set) {
      const origSet = locHrefDesc.set.bind(window.location);
      Object.defineProperty(window.location, 'href', {
        get: () => window.location.href,
        set: (val: string) => {
          const resolved = new URL(val, window.location.href).pathname;
          if (resolved === '/preview' || resolved.startsWith('/preview')) {
            origSet(val);
          } else {
            console.log('[Preview Edit] Blocked location.href navigation');
          }
        },
        configurable: true,
      });
    }

    // 3. Override window.open
    const origOpen = window.open.bind(window);
    window.open = (...args: [string | URL | undefined, string | undefined, string | undefined]) => {
      console.log('[Preview Edit] Blocked window.open');
      return null;
    };

    // 4. Override window.location.assign / replace
    const origAssign = window.location.assign.bind(window.location);
    const origReplace = window.location.replace.bind(window.location);
    window.location.assign = (url: string | URL) => {
      console.log('[Preview Edit] Blocked location.assign');
    };
    window.location.replace = (url: string | URL) => {
      console.log('[Preview Edit] Blocked location.replace');
    };

    // 5. Strip href from all links & disable forms/buttons
    const linkMap = new Map<HTMLAnchorElement, string | null>();
    const disableLinks = () => {
      document.querySelectorAll('a[href]').forEach((el) => {
        const a = el as HTMLAnchorElement;
        if (!linkMap.has(a)) {
          linkMap.set(a, a.getAttribute('href'));
          a.removeAttribute('href');
          a.style.cursor = 'default';
        }
      });
    };
    disableLinks();

    const observer = new MutationObserver(() => disableLinks());
    observer.observe(document.documentElement, { childList: true, subtree: true });

    document.addEventListener('mouseover', handleMouseOver, true);
    document.addEventListener('click', handleClick, true);

    return () => {
      document.removeEventListener('mouseover', handleMouseOver, true);
      document.removeEventListener('click', handleClick, true);
      observer.disconnect();

      // Restore history
      history.pushState = origPushState;
      history.replaceState = origReplaceState;

      // Restore location.href
      if (locHrefDesc) {
        Object.defineProperty(window.location, 'href', locHrefDesc);
      }

      // Restore window.open
      window.open = origOpen;

      // Restore assign/replace
      window.location.assign = origAssign;
      window.location.replace = origReplace;

      // Restore links
      linkMap.forEach((href, a) => {
        if (href !== null) a.setAttribute('href', href);
        a.style.cursor = '';
      });
      linkMap.clear();
    };
  }, [editMode]);

  const renderPage = () => {
    switch (currentPage) {
      case 'home': return <HomePage />;
      case 'about': return <AboutPage />;
      case 'portfolio': return <PortfolioPage />;
      case 'news': return <NewsPage />;
      case 'karir': return <KarirPage />;
      case 'kontak': return <KontakPage />;
      default: return <HomePage />;
    }
  };

  return (
    <div ref={mainRef} className="min-h-screen">
      {/* Edit mode: lock all interactions, only allow section selection */}
      {editMode && (
        <style>{`
          /* Only visual styling — no pointer-events blocking here (handled by JS) */
          [data-preview-id] {
            position: relative;
            cursor: pointer !important;
          }
          [data-preview-id]::before {
            content: attr(data-preview-label);
            position: absolute;
            top: 0;
            left: 0;
            background: rgba(245, 158, 11, 0.9);
            color: #000;
            font-size: 10px;
            font-weight: 700;
            padding: 2px 8px;
            border-radius: 0 0 4px 0;
            z-index: 9999;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.15s;
            white-space: nowrap;
          }
          [data-preview-id]:hover::before {
            opacity: 1;
          }
          [data-preview-id]:hover {
            outline: 2px dashed rgba(245, 158, 11, 0.6);
            outline-offset: -2px;
          }
          [data-preview-id].selected-preview {
            outline: 3px solid rgba(245, 158, 11, 0.9) !important;
            outline-offset: -3px;
          }
          [data-preview-id].selected-preview::after {
            content: 'EDIT';
            position: absolute;
            top: 0;
            right: 0;
            background: rgba(245, 158, 11, 0.9);
            color: #000;
            font-size: 10px;
            font-weight: 700;
            padding: 2px 8px;
            border-radius: 0 0 0 4px;
            z-index: 9999;
            pointer-events: none;
          }
        `}</style>
      )}

      <Suspense
        fallback={
          <div className="min-h-screen bg-[var(--dark-bg)] flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
          </div>
        }
      >
        {renderPage()}
      </Suspense>
    </div>
  );
}

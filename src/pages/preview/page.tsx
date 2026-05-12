import { useEffect, useState, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

import HomePage from '@/pages/home/page';
import AboutPage from '@/pages/about/page';
import PortfolioPage from '@/pages/portfolio/page';
import NewsPage from '@/pages/news/page';
import KarirPage from '@/pages/karir/page';
import KontakPage from '@/pages/kontak/page';

const PAGES = [
  { key: 'home', label: 'Beranda', path: '/' },
  { key: 'about', label: 'Tentang Kami', path: '/tentang-kami' },
  { key: 'portfolio', label: 'Portofolio', path: '/portofolio' },
  { key: 'news', label: 'News', path: '/news' },
  { key: 'karir', label: 'Karir', path: '/karir' },
  { key: 'kontak', label: 'Kontak', path: '/kontak' },
];

// Page cache so switching pages doesn't re-mount components
const PAGE_CACHE: Record<string, React.ReactNode> = {};

export default function PreviewPage() {
  const [searchParams] = useSearchParams();
  const [editMode, setEditMode] = useState(false);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [hoveredElement, setHoveredElement] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(searchParams.get('page') || 'home');
  const mainRef = useRef<HTMLDivElement>(null);
  const editCleanupRef = useRef<(() => void) | null>(null);

  // Cache pages on first render so they don't re-mount
  if (!PAGE_CACHE.home) PAGE_CACHE.home = <HomePage />;
  if (!PAGE_CACHE.about) PAGE_CACHE.about = <AboutPage />;
  if (!PAGE_CACHE.portfolio) PAGE_CACHE.portfolio = <PortfolioPage />;
  if (!PAGE_CACHE.news) PAGE_CACHE.news = <NewsPage />;
  if (!PAGE_CACHE.karir) PAGE_CACHE.karir = <KarirPage />;
  if (!PAGE_CACHE.kontak) PAGE_CACHE.kontak = <KontakPage />;

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
          setCurrentPage(page);
        }
      }
      if (e.data?.type === 'WMM_PREVIEW_EDIT_MODE') {
        setEditMode(!!e.data.enabled);
      }
      if (e.data?.type === 'WMM_PREVIEW_HIGHLIGHT') {
        const id = e.data.id as string;
        setSelectedElement(id);
        setTimeout(() => {
          const el = document.querySelector(`[data-preview-id="${id}"]`);
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 200);
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  // Cleanup any stale edit mode handlers before setting up new ones
  const cleanupEditMode = useCallback(() => {
    if (editCleanupRef.current) {
      editCleanupRef.current();
      editCleanupRef.current = null;
    }
  }, []);

  // Edit mode: lock all interactions, only allow section selection
  useEffect(() => {
    cleanupEditMode();

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

    // Track which links we've already disabled (avoid DOM thrashing)
    const disabledLinks = new WeakSet<HTMLAnchorElement>();

    const disableLinks = () => {
      document.querySelectorAll('a[href]').forEach((el) => {
        const a = el as HTMLAnchorElement;
        if (!disabledLinks.has(a)) {
          a.dataset.originalHref = a.getAttribute('href') || '';
          a.removeAttribute('href');
          a.style.cursor = 'default';
          disabledLinks.add(a);
        }
      });
    };

    // Debounced mutation observer (throttle to max once per 100ms)
    let mutationTimeout: ReturnType<typeof setTimeout> | null = null;
    const observer = new MutationObserver(() => {
      if (mutationTimeout) return;
      mutationTimeout = setTimeout(() => {
        mutationTimeout = null;
        disableLinks();
      }, 100);
    });

    // Initial disable
    disableLinks();
    observer.observe(document.documentElement, { childList: true, subtree: true });

    document.addEventListener('mouseover', handleMouseOver, true);
    document.addEventListener('click', handleClick, true);

    // Store cleanup
    const cleanup = () => {
      document.removeEventListener('mouseover', handleMouseOver, true);
      document.removeEventListener('click', handleClick, true);
      observer.disconnect();
      if (mutationTimeout) clearTimeout(mutationTimeout);
      // Restore links (only ones we disabled)
      document.querySelectorAll('a[data-original-href]').forEach((el) => {
        const a = el as HTMLAnchorElement;
        const href = a.dataset.originalHref;
        if (href) a.setAttribute('href', href);
        delete a.dataset.originalHref;
        a.style.cursor = '';
        disabledLinks.delete(a);
      });
    };
    editCleanupRef.current = cleanup;

    return cleanup;
  }, [editMode, cleanupEditMode]);

  const renderPage = () => {
    return PAGE_CACHE[currentPage] || PAGE_CACHE.home;
  };

  return (
    <div ref={mainRef} className="min-h-screen">
      {/* Edit mode: visual styling only */}
      {editMode && (
        <style>{`
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

      {renderPage()}
    </div>
  );
}
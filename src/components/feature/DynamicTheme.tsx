import { useEffect } from 'react';
import { useSiteTheme } from '@/context/SiteThemeContext';

export default function DynamicTheme() {
  const { theme } = useSiteTheme();

  useEffect(() => {
    const root = document.documentElement;

    if (theme.accent_color) {
      root.style.setProperty('--accent', theme.accent_color);
      const r = parseInt(theme.accent_color.slice(1, 3), 16);
      const g = parseInt(theme.accent_color.slice(3, 5), 16);
      const b = parseInt(theme.accent_color.slice(5, 7), 16);
      root.style.setProperty('--accent-soft', `rgba(${r},${g},${b},0.55)`);
      root.style.setProperty('--accent-dim', `rgba(${r},${g},${b},0.12)`);
      root.style.setProperty('--accent-border', `rgba(${r},${g},${b},0.22)`);
    }

    if (theme.secondary_color) {
      root.style.setProperty('--secondary', theme.secondary_color);
    }

    // Accent-based CSS overrides
    const styleId = 'wmm-dynamic-theme';
    let style = document.getElementById(styleId) as HTMLStyleElement | null;
    if (!style) {
      style = document.createElement('style');
      style.id = styleId;
      document.head.appendChild(style);
    }

    const accent = theme.accent_color || '#3B82F6';
    style.textContent = `
      .accent-dynamic-text { color: ${accent} !important; }
      .accent-dynamic-bg { background-color: ${accent} !important; }
      .accent-dynamic-border { border-color: ${accent} !important; }
      .hero-accent-text { color: ${theme.secondary_color || '#93C5FD'} !important; }
    `;
  }, [theme]);

  return null;
}

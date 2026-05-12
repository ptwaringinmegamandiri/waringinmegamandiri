import { useEffect } from 'react';
import { useSiteTheme } from '@/context/SiteThemeContext';

export default function DynamicFavicon() {
  const { theme } = useSiteTheme();

  useEffect(() => {
    if (!theme.favicon_url) return;
    // Update favicon link
    let link = document.querySelector<HTMLLinkElement>("link[rel='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.href = theme.favicon_url;
    link.type = theme.favicon_url.endsWith('.svg') ? 'image/svg+xml' : 'image/png';

    // Update apple-touch-icon
    let appleLink = document.querySelector<HTMLLinkElement>("link[rel='apple-touch-icon']");
    if (!appleLink) {
      appleLink = document.createElement('link');
      appleLink.rel = 'apple-touch-icon';
      document.head.appendChild(appleLink);
    }
    appleLink.href = theme.favicon_url;

    // Update page title if provided in theme
    if (theme.hero_title) {
      const firstLine = theme.hero_title.split('\n')[0] || 'PT Waringin Mega Mandiri';
      document.title = firstLine + ' — WMM';
    }
  }, [theme.favicon_url, theme.hero_title]);

  return null;
}
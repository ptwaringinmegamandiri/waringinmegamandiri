import { useEffect } from 'react';
import { useSiteTheme } from '@/context/SiteThemeContext';

const DEFAULT_FAVICON_SVG = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='20' fill='%23FFFFFF'/%3E%3Ctext x='50' y='75' font-family='Georgia,serif' font-size='58' font-weight='900' fill='%232563EB' text-anchor='middle'%3EW%3C/text%3E%3C/svg%3E`;

export default function DynamicFavicon() {
  const { theme } = useSiteTheme();

  useEffect(() => {
    const faviconUrl = theme.favicon_url || DEFAULT_FAVICON_SVG;
    const isSvg = faviconUrl.endsWith('.svg') || faviconUrl.includes('svg+xml');

    // Clean up old favicon links
    const oldIcons = document.querySelectorAll("link[rel*='icon'], link[rel='apple-touch-icon'], link[rel='shortcut icon']");
    oldIcons.forEach((el) => el.remove());

    // Add new favicon
    const link = document.createElement('link');
    link.rel = 'icon';
    link.href = faviconUrl;
    link.type = isSvg ? 'image/svg+xml' : 'image/png';
    document.head.appendChild(link);

    // Add apple-touch-icon
    const appleLink = document.createElement('link');
    appleLink.rel = 'apple-touch-icon';
    appleLink.href = faviconUrl;
    appleLink.sizes = '180x180';
    document.head.appendChild(appleLink);

    // Update page title if hero_title exists
    if (theme.hero_title) {
      const firstLine = theme.hero_title.split('\n')[0] || 'PT Waringin Mega Mandiri';
      const cleanTitle = firstLine.replace(/\[color=[^\]]+\]/g, '').replace(/\[\/color\]/g, '').replace(/\[bold\]/g, '').replace(/\[\/bold\]/g, '');
      document.title = cleanTitle + ' — WMM';
    }
  }, [theme.favicon_url, theme.hero_title]);

  return null;
}
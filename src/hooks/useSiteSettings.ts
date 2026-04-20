import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface SiteSettingsMap {
  phone: string;
  phone_alt: string;
  email: string;
  email_alt: string;
  whatsapp: string;
  address: string;
  address_short: string;
  maps_embed_url: string;
  hours_weekdays: string;
  hours_saturday: string;
  hours_sunday: string;
  instagram: string;
  linkedin: string;
  facebook: string;
  youtube: string;
}

const DEFAULT_SETTINGS: SiteSettingsMap = {
  phone: '+62 21 573 8001',
  phone_alt: '+62 812-9999-0001',
  email: 'info@waringinmegamandiri.co.id',
  email_alt: 'marketing@waringinmegamandiri.co.id',
  whatsapp: '+6281299990001',
  address: 'Jl. Bendungan Hilir Raya G1 No.5, Bendungan Hilir, Tanah Abang, Jakarta Pusat 10210',
  address_short: 'Jakarta Pusat, DKI Jakarta',
  maps_embed_url: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.521!2d106.8097!3d-6.2043!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f72b3a3a3a3b%3A0x1234567890abcdef!2sJl.+Bendungan+Hilir+Raya+G1+No.5%2C+Bendungan+Hilir%2C+Tanah+Abang%2C+Jakarta+Pusat+10210!5e0!3m2!1sid!2sid!4v1712000000000!5m2!1sid!2sid',
  hours_weekdays: 'Senin – Jumat: 08.00 – 17.00',
  hours_saturday: 'Sabtu: 08.00 – 13.00',
  hours_sunday: 'Minggu: Tutup',
  instagram: 'https://instagram.com/wmm.id',
  linkedin: 'https://linkedin.com/company/waringin-mega-mandiri',
  facebook: 'https://facebook.com/waringinmegamandiri',
  youtube: 'https://youtube.com/@wmmchannel',
};

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettingsMap>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data, error } = await supabase.from('site_settings').select('key, value');
      if (!error && data && data.length > 0) {
        const map: Partial<SiteSettingsMap> = {};
        data.forEach((row: { key: string; value: string }) => {
          (map as Record<string, string>)[row.key] = row.value || '';
        });
        setSettings({ ...DEFAULT_SETTINGS, ...map });
      }
      setLoading(false);
    };
    fetch();
  }, []);

  return { settings, loading };
}

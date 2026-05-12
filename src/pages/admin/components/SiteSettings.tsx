import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import AiConfigPanel from './AiConfigPanel';

interface SettingField {
  key: string;
  label: string;
  icon: string;
  type?: 'text' | 'url' | 'tel' | 'email' | 'textarea' | 'number' | 'select';
  placeholder?: string;
  options?: string[];
}

const CLIENT_CATEGORIES = [
  'Properti',
  'Kesehatan',
  'Hospitality',
  'Industri',
  'Pendidikan',
  'Pemerintahan / BUMN',
  'Infrastruktur',
  'Lainnya',
];

const SETTING_GROUPS: { title: string; icon: string; fields: SettingField[] }[] = [
  {
    title: 'Kontak Utama',
    icon: 'ri-phone-line',
    fields: [
      { key: 'phone', label: 'Nomor Telepon Utama', icon: 'ri-phone-line', type: 'tel', placeholder: '+62 21 573 8001' },
      { key: 'phone_alt', label: 'Nomor Telepon Alternatif', icon: 'ri-phone-line', type: 'tel', placeholder: '+62 812-xxxx-xxxx' },
      { key: 'email', label: 'Email Utama', icon: 'ri-mail-line', type: 'email', placeholder: 'info@perusahaan.co.id' },
      { key: 'email_alt', label: 'Email Alternatif', icon: 'ri-mail-line', type: 'email', placeholder: 'marketing@perusahaan.co.id' },
      { key: 'whatsapp', label: 'Nomor WhatsApp', icon: 'ri-whatsapp-line', type: 'tel', placeholder: '+6281299990001' },
    ],
  },
  {
    title: 'Alamat & Lokasi',
    icon: 'ri-map-pin-line',
    fields: [
      { key: 'address', label: 'Alamat Lengkap', icon: 'ri-map-pin-2-line', type: 'textarea', placeholder: 'Jl. ..., Kota, Provinsi, Kode Pos' },
      { key: 'address_short', label: 'Alamat Singkat', icon: 'ri-map-pin-line', type: 'text', placeholder: 'Jakarta Pusat, DKI Jakarta' },
      { key: 'maps_embed_url', label: 'URL Embed Google Maps', icon: 'ri-map-2-line', type: 'url', placeholder: 'https://www.google.com/maps/embed?pb=...' },
    ],
  },
  {
    title: 'Jam Operasional',
    icon: 'ri-time-line',
    fields: [
      { key: 'hours_weekdays', label: 'Senin – Jumat', icon: 'ri-calendar-line', type: 'text', placeholder: 'Senin – Jumat: 08.00 – 17.00' },
      { key: 'hours_saturday', label: 'Sabtu', icon: 'ri-calendar-line', type: 'text', placeholder: 'Sabtu: 08.00 – 13.00' },
      { key: 'hours_sunday', label: 'Minggu', icon: 'ri-calendar-line', type: 'text', placeholder: 'Minggu: Tutup' },
    ],
  },
  {
    title: 'Media Sosial',
    icon: 'ri-share-line',
    fields: [
      { key: 'instagram', label: 'Instagram URL', icon: 'ri-instagram-line', type: 'url', placeholder: 'https://instagram.com/...' },
      { key: 'linkedin', label: 'LinkedIn URL', icon: 'ri-linkedin-box-line', type: 'url', placeholder: 'https://linkedin.com/company/...' },
      { key: 'facebook', label: 'Facebook URL', icon: 'ri-facebook-line', type: 'url', placeholder: 'https://facebook.com/...' },
      { key: 'youtube', label: 'YouTube URL', icon: 'ri-youtube-line', type: 'url', placeholder: 'https://youtube.com/@...' },
    ],
  },
  {
    title: 'Klien & Mitra',
    icon: 'ri-building-4-line',
    fields: [
      { key: 'client_card_1_name', label: 'Klien 1 — Nama Singkat', icon: 'ri-user-line', type: 'text', placeholder: 'APL Group' },
      { key: 'client_card_1_fullName', label: 'Klien 1 — Nama Lengkap', icon: 'ri-user-line', type: 'text', placeholder: 'APL Group (PT Astakona Megatama)' },
      { key: 'client_card_1_desc', label: 'Klien 1 — Deskripsi', icon: 'ri-file-text-line', type: 'textarea', placeholder: 'Pengembang properti komersial & residensial skala nasional' },
      { key: 'client_card_1_projects', label: 'Klien 1 — Jumlah Proyek', icon: 'ri-building-line', type: 'number', placeholder: '3' },
      { key: 'client_card_1_category', label: 'Klien 1 — Kategori', icon: 'ri-price-tag-3-line', type: 'select', options: CLIENT_CATEGORIES },
      { key: 'client_card_2_name', label: 'Klien 2 — Nama Singkat', icon: 'ri-user-line', type: 'text', placeholder: 'Astra Land' },
      { key: 'client_card_2_fullName', label: 'Klien 2 — Nama Lengkap', icon: 'ri-user-line', type: 'text', placeholder: 'Astra Land Indonesia' },
      { key: 'client_card_2_desc', label: 'Klien 2 — Deskripsi', icon: 'ri-file-text-line', type: 'textarea', placeholder: 'Anak perusahaan Astra International di bidang properti premium' },
      { key: 'client_card_2_projects', label: 'Klien 2 — Jumlah Proyek', icon: 'ri-building-line', type: 'number', placeholder: '5' },
      { key: 'client_card_2_category', label: 'Klien 2 — Kategori', icon: 'ri-price-tag-3-line', type: 'select', options: CLIENT_CATEGORIES },
      { key: 'client_card_3_name', label: 'Klien 3 — Nama Singkat', icon: 'ri-user-line', type: 'text', placeholder: 'ASG Group' },
      { key: 'client_card_3_fullName', label: 'Klien 3 — Nama Lengkap', icon: 'ri-user-line', type: 'text', placeholder: 'ASG Group' },
      { key: 'client_card_3_desc', label: 'Klien 3 — Deskripsi', icon: 'ri-file-text-line', type: 'textarea', placeholder: 'Pengembang kawasan perumahan dan komersial terpadu' },
      { key: 'client_card_3_projects', label: 'Klien 3 — Jumlah Proyek', icon: 'ri-building-line', type: 'number', placeholder: '4' },
      { key: 'client_card_3_category', label: 'Klien 3 — Kategori', icon: 'ri-price-tag-3-line', type: 'select', options: CLIENT_CATEGORIES },
      { key: 'client_card_4_name', label: 'Klien 4 — Nama Singkat', icon: 'ri-user-line', type: 'text', placeholder: 'Yayasan Charitas' },
      { key: 'client_card_4_fullName', label: 'Klien 4 — Nama Lengkap', icon: 'ri-user-line', type: 'text', placeholder: 'Yayasan Rumah Sakit Charitas' },
      { key: 'client_card_4_desc', label: 'Klien 4 — Deskripsi', icon: 'ri-file-text-line', type: 'textarea', placeholder: 'Institusi kesehatan terkemuka di Sumatera Selatan' },
      { key: 'client_card_4_projects', label: 'Klien 4 — Jumlah Proyek', icon: 'ri-building-line', type: 'number', placeholder: '2' },
      { key: 'client_card_4_category', label: 'Klien 4 — Kategori', icon: 'ri-price-tag-3-line', type: 'select', options: CLIENT_CATEGORIES },
      { key: 'client_card_5_name', label: 'Klien 5 — Nama Singkat', icon: 'ri-user-line', type: 'text', placeholder: 'PT Sabang Raya' },
      { key: 'client_card_5_fullName', label: 'Klien 5 — Nama Lengkap', icon: 'ri-user-line', type: 'text', placeholder: 'PT Sabang Raya Investama' },
      { key: 'client_card_5_desc', label: 'Klien 5 — Deskripsi', icon: 'ri-file-text-line', type: 'textarea', placeholder: 'Perusahaan investasi & hospitality di kawasan Batam' },
      { key: 'client_card_5_projects', label: 'Klien 5 — Jumlah Proyek', icon: 'ri-building-line', type: 'number', placeholder: '1' },
      { key: 'client_card_5_category', label: 'Klien 5 — Kategori', icon: 'ri-price-tag-3-line', type: 'select', options: CLIENT_CATEGORIES },
      { key: 'client_card_6_name', label: 'Klien 6 — Nama Singkat', icon: 'ri-user-line', type: 'text', placeholder: 'Hilton Garden Inn' },
      { key: 'client_card_6_fullName', label: 'Klien 6 — Nama Lengkap', icon: 'ri-user-line', type: 'text', placeholder: 'Hilton Garden Inn Batam' },
      { key: 'client_card_6_desc', label: 'Klien 6 — Deskripsi', icon: 'ri-file-text-line', type: 'textarea', placeholder: 'Brand hotel internasional kelas dunia di Indonesia' },
      { key: 'client_card_6_projects', label: 'Klien 6 — Jumlah Proyek', icon: 'ri-building-line', type: 'number', placeholder: '1' },
      { key: 'client_card_6_category', label: 'Klien 6 — Kategori', icon: 'ri-price-tag-3-line', type: 'select', options: CLIENT_CATEGORIES },
    ],
  },
];

export default function SiteSettings() {
  const [settings, setSettings] = useState<Record<string, string>>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedKeys, setSavedKeys] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  };

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from('site_settings').select('key, value');
    if (!error && data) {
      const map: Record<string, string> = {};
      data.forEach((row: { key: string; value: string }) => { map[row.key] = row.value || ''; });
      setSettings(map);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchSettings(); }, [fetchSettings]);

  const handleChange = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSaveGroup = async (fields: SettingField[]) => {
    setSaving(true);
    let errors = 0;
    const keys = fields.map((f) => f.key);
    for (const key of keys) {
      const { error } = await supabase
        .from('site_settings')
        .upsert(
          { key, value: settings[key] || '', updated_at: new Date().toISOString() },
          { onConflict: 'key' }
        );
      if (error) {
        errors++;
        // eslint-disable-next-line no-console
        console.error('Failed to save', key, error);
      }
    }
    setSavedKeys((prev) => {
      const next = new Set(prev);
      keys.forEach((k) => next.add(k));
      return next;
    });
    setTimeout(() => {
      setSavedKeys((prev) => {
        const next = new Set(prev);
        keys.forEach((k) => next.delete(k));
        return next;
      });
    }, 2500);
    setSaving(false);
    if (errors > 0) {
      showToast(`${errors} field gagal disimpan. Cek console.`);
    } else {
      showToast('Pengaturan berhasil disimpan dan langsung berlaku di website!');
    }
  };

  const handleSaveAll = async () => {
    setSaving(true);
    let errors = 0;
    const allFields = SETTING_GROUPS.flatMap((g) => g.fields);
    for (const field of allFields) {
      const { error } = await supabase
        .from('site_settings')
        .upsert(
          { key: field.key, value: settings[field.key] || '', updated_at: new Date().toISOString() },
          { onConflict: 'key' }
        );
      if (error) {
        errors++;
        // eslint-disable-next-line no-console
        console.error('Failed to save', field.key, error);
      }
    }
    setSaving(false);
    if (errors > 0) {
      showToast(`${errors} field gagal disimpan. Cek console.`);
    } else {
      showToast('Semua pengaturan berhasil disimpan!');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-amber-400 text-black text-sm font-bold px-5 py-3 rounded-xl flex items-center gap-2">
          <i className="ri-checkbox-circle-line text-base" />{toast}
        </div>
      )}

      <div className="mb-6">
        <h2 className="font-bold text-xl text-white">Pengaturan Website</h2>
        <p className="text-slate-500 text-sm mt-1">Ubah informasi kontak, alamat, media sosial, dan AI config</p>
      </div>

      {/* AI Config Panel */}
      <div className="mb-6">
        <AiConfigPanel />
      </div>

      <div className="space-y-6">
        {SETTING_GROUPS.map((group) => (
          <div key={group.title} className="bg-[#0D1117] border border-slate-800 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-amber-400/10">
                  <i className={`${group.icon} text-amber-400 text-sm`} />
                </div>
                <h3 className="font-bold text-sm text-white">{group.title}</h3>
              </div>
              <button
                onClick={() => handleSaveGroup(group.fields)}
                disabled={saving}
                className="flex items-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs px-4 py-2 rounded-lg cursor-pointer whitespace-nowrap transition-colors disabled:opacity-50"
              >
                {saving ? <div className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin" /> : <i className="ri-save-line" />}
                Simpan
              </button>
            </div>
            <div className="p-6 space-y-4">
              {group.fields.map((field) => (
                <div key={field.key}>
                  <label className="flex items-center gap-2 text-slate-400 text-xs mb-1.5 uppercase tracking-wider">
                    <i className={`${field.icon} text-slate-600`} />
                    {field.label}
                    {savedKeys.has(field.key) && (
                      <span className="text-green-400 text-xs font-bold normal-case tracking-normal ml-1">
                        <i className="ri-check-line" /> Tersimpan
                      </span>
                    )}
                  </label>
                  {field.type === 'textarea' ? (
                    <textarea
                      rows={3}
                      value={settings[field.key] || ''}
                      onChange={(e) => handleChange(field.key, e.target.value)}
                      placeholder={field.placeholder}
                      className="w-full bg-[#070C17] border border-slate-700 hover:border-slate-600 focus:border-amber-400/60 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none transition-colors resize-none"
                    />
                  ) : field.type === 'select' ? (
                    <select
                      value={settings[field.key] || ''}
                      onChange={(e) => handleChange(field.key, e.target.value)}
                      className="w-full bg-[#070C17] border border-slate-700 hover:border-slate-600 focus:border-amber-400/60 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none transition-colors appearance-none"
                    >
                      <option value="" className="bg-[#070C17] text-slate-500">Pilih kategori...</option>
                      {field.options?.map((opt) => (
                        <option key={opt} value={opt} className="bg-[#070C17] text-white">{opt}</option>
                      ))}
                    </select>
                  ) : field.type === 'number' ? (
                    <input
                      type="number"
                      min={0}
                      value={settings[field.key] || ''}
                      onChange={(e) => handleChange(field.key, e.target.value)}
                      placeholder={field.placeholder}
                      className="w-full bg-[#070C17] border border-slate-700 hover:border-slate-600 focus:border-amber-400/60 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none transition-colors"
                    />
                  ) : (
                    <input
                      type={field.type || 'text'}
                      value={settings[field.key] || ''}
                      onChange={(e) => handleChange(field.key, e.target.value)}
                      placeholder={field.placeholder}
                      className="w-full bg-[#070C17] border border-slate-700 hover:border-slate-600 focus:border-amber-400/60 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none transition-colors"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={handleSaveAll}
          disabled={saving}
          className="flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-black font-bold text-sm px-8 py-3 rounded-xl cursor-pointer whitespace-nowrap transition-colors disabled:opacity-50"
        >
          {saving ? <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" /> : <i className="ri-save-3-line" />}
          Simpan Semua Pengaturan
        </button>
      </div>
    </div>
  );
}

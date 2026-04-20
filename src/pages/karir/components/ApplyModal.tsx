import { useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';

interface Job {
  id: number;
  title: string;
  department: string;
  location: string;
  type: string;
  level: string;
  salary: string;
  deadline: string;
  description: string;
  requirements: string[];
  benefits: string[];
  tags: string[];
}

interface ApplyModalProps {
  job: Job;
  onClose: () => void;
}

export default function ApplyModal({ job, onClose }: ApplyModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;

    const form = e.currentTarget;
    const textarea = form.querySelector('textarea[name="motivasi"]') as HTMLTextAreaElement;
    if (textarea && textarea.value.length > 500) return;

    setLoading(true);
    const formData = new FormData(form);
    const params = new URLSearchParams();
    formData.forEach((value, key) => { params.append(key, value as string); });

    // Save to Supabase job_applications
    const applicationData = {
      career_id: job.id,
      posisi: job.title,
      departemen: job.department,
      nama_lengkap: formData.get('nama_lengkap') as string,
      email: formData.get('email') as string,
      nomor_hp: formData.get('nomor_hp') as string,
      pendidikan_terakhir: formData.get('pendidikan_terakhir') as string,
      pengalaman_kerja: formData.get('pengalaman_kerja') as string,
      linkedin_portfolio: formData.get('linkedin_portfolio') as string || null,
      motivasi: formData.get('motivasi') as string,
      link_cv: formData.get('link_cv') as string || null,
      status: 'Baru',
    };

    try {
      await Promise.all([
        supabase.from('job_applications').insert(applicationData),
        fetch('https://readdy.ai/api/form/d76eagjq7u9ee9hceds0', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: params.toString(),
        }),
      ]);
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-[#0D1117] border border-sky-400/20 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-[#0D1117] border-b border-sky-400/10 px-6 py-5 flex items-center justify-between rounded-t-2xl z-10">
          <div>
            <h3 className="font-syne font-bold text-white text-lg">Lamar Posisi Ini</h3>
            <p className="text-sky-400 text-sm mt-0.5 font-body">{job.title}</p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 transition-all cursor-pointer"
          >
            <i className="ri-close-line text-lg" />
          </button>
        </div>

        {submitted ? (
          <div className="px-6 py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-sky-400/10 border border-sky-400/30 flex items-center justify-center mx-auto mb-4">
              <i className="ri-check-line text-2xl text-sky-400" />
            </div>
            <h4 className="font-syne font-bold text-white text-xl mb-2">Lamaran Terkirim!</h4>
            <p className="text-slate-400 font-body text-sm leading-relaxed max-w-xs mx-auto">
              Terima kasih telah melamar. Tim HR kami akan menghubungi Anda dalam 3–5 hari kerja.
            </p>
            <button
              onClick={onClose}
              className="mt-6 btn-neon-solid px-6 py-2.5 rounded-lg text-sm cursor-pointer"
            >
              Tutup
            </button>
          </div>
        ) : (
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            data-readdy-form
            id="apply-form"
            className="px-6 py-6 space-y-5"
          >
            <input type="hidden" name="posisi" value={job.title} />
            <input type="hidden" name="departemen" value={job.department} />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 text-sm font-body font-medium mb-1.5">
                  Nama Lengkap <span className="text-sky-400">*</span>
                </label>
                <input
                  type="text"
                  name="nama_lengkap"
                  required
                  placeholder="Masukkan nama lengkap"
                  className="w-full bg-[#161B2E] border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-400/60 transition-colors font-body"
                />
              </div>
              <div>
                <label className="block text-slate-300 text-sm font-body font-medium mb-1.5">
                  Email <span className="text-sky-400">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="email@contoh.com"
                  className="w-full bg-[#161B2E] border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-400/60 transition-colors font-body"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 text-sm font-body font-medium mb-1.5">
                  Nomor HP / WhatsApp <span className="text-sky-400">*</span>
                </label>
                <input
                  type="tel"
                  name="nomor_hp"
                  required
                  placeholder="+62 8xx-xxxx-xxxx"
                  className="w-full bg-[#161B2E] border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-400/60 transition-colors font-body"
                />
              </div>
              <div>
                <label className="block text-slate-300 text-sm font-body font-medium mb-1.5">
                  Pendidikan Terakhir <span className="text-sky-400">*</span>
                </label>
                <select
                  name="pendidikan_terakhir"
                  required
                  className="w-full bg-[#161B2E] border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-sky-400/60 transition-colors font-body cursor-pointer"
                >
                  <option value="">Pilih pendidikan</option>
                  <option value="SMA/SMK">SMA / SMK</option>
                  <option value="D3">D3</option>
                  <option value="S1">S1</option>
                  <option value="S2">S2</option>
                  <option value="S3">S3</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 text-sm font-body font-medium mb-1.5">
                  Pengalaman Kerja
                </label>
                <select
                  name="pengalaman_kerja"
                  className="w-full bg-[#161B2E] border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-sky-400/60 transition-colors font-body cursor-pointer"
                >
                  <option value="Fresh Graduate">Fresh Graduate</option>
                  <option value="1-2 Tahun">1–2 Tahun</option>
                  <option value="3-5 Tahun">3–5 Tahun</option>
                  <option value="5-10 Tahun">5–10 Tahun</option>
                  <option value="10+ Tahun">10+ Tahun</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-300 text-sm font-body font-medium mb-1.5">
                  Link LinkedIn / Portfolio
                </label>
                <input
                  type="url"
                  name="linkedin_portfolio"
                  placeholder="https://linkedin.com/in/..."
                  className="w-full bg-[#161B2E] border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-400/60 transition-colors font-body"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 text-sm font-body font-medium mb-1.5">
                Surat Lamaran / Motivasi <span className="text-sky-400">*</span>
                <span className="text-slate-500 font-normal ml-2">({charCount}/500)</span>
              </label>
              <textarea
                name="motivasi"
                required
                rows={4}
                maxLength={500}
                onChange={(e) => setCharCount(e.target.value.length)}
                placeholder="Ceritakan mengapa Anda cocok untuk posisi ini dan motivasi Anda bergabung bersama WMM..."
                className="w-full bg-[#161B2E] border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-400/60 transition-colors resize-none font-body"
              />
            </div>

            <div>
              <label className="block text-slate-300 text-sm font-body font-medium mb-1.5">
                Upload CV (Link Google Drive / Dropbox) <span className="text-sky-400">*</span>
              </label>
              <input
                type="url"
                name="link_cv"
                required
                placeholder="https://drive.google.com/..."
                className="w-full bg-[#161B2E] border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-400/60 transition-colors font-body"
              />
              <p className="text-slate-500 text-xs mt-1.5 font-body">
                Upload CV ke Google Drive / Dropbox lalu tempel link-nya di sini
              </p>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-neon-solid py-3 rounded-xl font-body font-semibold text-sm disabled:opacity-60 cursor-pointer whitespace-nowrap"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <i className="ri-loader-4-line animate-spin" /> Mengirim...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <i className="ri-send-plane-line" /> Kirim Lamaran
                  </span>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

const DEV_PASSWORD = 'wmm2024';

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [mode, setMode] = useState<'login' | 'register' | 'dev'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [devPassword, setDevPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Handle OAuth/OTP error from URL
  useEffect(() => {
    const errorCode = searchParams.get('error_code');
    const errorDesc = searchParams.get('error_description');
    if (errorCode === 'otp_expired' || errorDesc?.includes('invalid') || errorDesc?.includes('expired')) {
      setError('Link konfirmasi sudah expired. Silakan daftar ulang atau coba login.');
    }
  }, [searchParams]);

  const handleDevLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (devPassword === DEV_PASSWORD) {
      localStorage.setItem('wmm_dev_auth', JSON.stringify({ email: 'dev@wmm.id', timestamp: Date.now() }));
      navigate('/admin');
    } else {
      setError('Password dev mode salah.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (mode === 'register') {
      if (password !== confirmPassword) {
        setError('Password tidak cocok.');
        setLoading(false);
        return;
      }
      if (password.length < 6) {
        setError('Password minimal 6 karakter.');
        setLoading(false);
        return;
      }

      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) {
        setError(signUpError.message || 'Pendaftaran gagal.');
        setLoading(false);
        return;
      }

      if (data?.user) {
        if (data.session) {
          navigate('/admin');
          setLoading(false);
          return;
        }
        setMode('login');
        setPassword('');
        setConfirmPassword('');
        setSuccess('Akun berhasil dibuat! Silakan cek email Anda dan klik link konfirmasi, lalu login.');
      }
      setLoading(false);
      return;
    }

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      if (authError.message?.includes('Email not confirmed')) {
        setError('Email belum dikonfirmasi. Cek inbox/spam untuk link konfirmasi, atau daftar ulang.');
      } else if (authError.message?.includes('Database error') || authError.message?.includes('schema')) {
        setError('Supabase auth sedang error. Gunakan Mode Pengembangan di bawah.');
      } else {
        setError(authError.message || 'Login gagal. Periksa email dan password.');
      }
      setLoading(false);
      return;
    }

    if (data?.session) {
      navigate('/admin');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#080C14] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="font-syne font-bold text-xl text-white tracking-tight">WMM Admin</h1>
          <p className="text-slate-500 text-xs mt-1">PT Waringin Mega Mandiri</p>
        </div>

        {/* Card */}
        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => { setMode('login'); setError(''); setSuccess(''); }}
              className={`font-bold text-sm transition-colors ${mode === 'login' ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Login
            </button>
            <span className="text-slate-700 text-sm">|</span>
            <button
              onClick={() => { setMode('register'); setError(''); setSuccess(''); }}
              className={`font-bold text-sm transition-colors ${mode === 'register' ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Daftar
            </button>
            <span className="text-slate-700 text-sm">|</span>
            <button
              onClick={() => { setMode('dev'); setError(''); setSuccess(''); }}
              className={`font-bold text-sm transition-colors ${mode === 'dev' ? 'text-amber-400' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Dev Mode
            </button>
          </div>

          {error && (
            <div className="mb-4 bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-start gap-2">
              <i className="ri-error-warning-line text-red-400 text-xs mt-0.5" />
              <p className="text-red-400 text-xs">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-4 bg-green-500/10 border border-green-500/20 rounded-lg p-3 flex items-start gap-2">
              <i className="ri-checkbox-circle-line text-green-400 text-xs mt-0.5" />
              <p className="text-green-400 text-xs">{success}</p>
            </div>
          )}

          {mode === 'dev' ? (
            <form onSubmit={handleDevLogin} className="space-y-4">
              <div>
                <label className="text-slate-400 text-xs block mb-1.5">Password Dev Mode</label>
                <input
                  type="password"
                  value={devPassword}
                  onChange={(e) => setDevPassword(e.target.value)}
                  placeholder="Masukkan password dev..."
                  required
                  className="w-full bg-[#0A0E14] border border-slate-700 rounded-lg px-3 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-400/60 transition-colors"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs py-2.5 rounded-lg cursor-pointer whitespace-nowrap flex items-center justify-center gap-2 transition-colors"
              >
                <i className="ri-shield-keyhole-line" />
                Masuk Dev Mode
              </button>
              <p className="text-slate-600 text-[10px] text-center">
                Mode ini hanya untuk testing ketika Supabase auth error.
              </p>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-slate-400 text-xs block mb-1.5">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@wmm.id"
                  required
                  className="w-full bg-[#0A0E14] border border-slate-700 rounded-lg px-3 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-400/60 transition-colors"
                />
              </div>

              <div>
                <label className="text-slate-400 text-xs block mb-1.5">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-[#0A0E14] border border-slate-700 rounded-lg px-3 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-400/60 transition-colors"
                />
              </div>

              {mode === 'register' && (
                <div>
                  <label className="text-slate-400 text-xs block mb-1.5">Konfirmasi Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full bg-[#0A0E14] border border-slate-700 rounded-lg px-3 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-400/60 transition-colors"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs py-2.5 rounded-lg cursor-pointer whitespace-nowrap flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    {mode === 'login' ? 'Masuk...' : 'Mendaftar...'}
                  </>
                ) : (
                  <>
                    <i className={mode === 'login' ? 'ri-login-box-line' : 'ri-user-add-line'} />
                    {mode === 'login' ? 'Masuk' : 'Daftar'}
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-slate-600 text-xs mt-4">
          <a href="/" className="text-slate-500 hover:text-white transition-colors">← Kembali ke website</a>
        </p>
      </div>
    </div>
  );
}
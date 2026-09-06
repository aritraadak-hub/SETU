import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, Key } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useTranslation } from '../../context/LanguageContext';
import { LoadingScreen } from '../../components/common/LoadingScreen';
import { getHomeRouteForRole } from '../../utils/navigation';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const { showToast } = useToast();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSuccessAnim, setShowSuccessAnim] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loggedInUser, setLoggedInUser] = useState<any>(null);
  const loggedInUserRef = React.useRef<any>(null);

  const redirectUrl = searchParams.get('redirect') || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const user = await login({ email, password });
      loggedInUserRef.current = user;
      setLoggedInUser(user);
      localStorage.setItem('setu_entry_completed', 'true');
      showToast(`Welcome back, ${user.name}!`, 'success');
      setShowSuccessAnim(true);
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid email or password');
      showToast(err.message || 'Login failed', 'error');
      setLoading(false);
    }
  };

  if (showSuccessAnim) {
    return (
      <LoadingScreen
        brandText="AUTHENTICATING SESSION & PREPARING DASHBOARD..."
        onComplete={() => {
          localStorage.setItem('setu_entry_completed', 'true');
          const finalUser = loggedInUserRef.current || loggedInUser;
          const target = redirectUrl && redirectUrl !== '/' ? redirectUrl : getHomeRouteForRole(finalUser);
          navigate(target);
        }}
      />
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 py-24 relative overflow-hidden"
      style={{
        background: 'radial-gradient(circle at center, rgba(15, 8, 4, 0.45) 0%, rgba(10, 5, 2, 0.88) 100%)'
      }}
    >
      {/* Double Border Outer Container Frame with Micro-Animation Entrance */}
      <div className="w-full max-w-md p-1 bg-gradient-to-b from-brand-gold/50 via-brand-gold/25 to-brand-gold/50 rounded-2xl shadow-2xl animate-fadeIn">
        {/* Main Inner Card Frame */}
        <div className="relative bg-white/95 backdrop-blur-md border border-brand-brown/20 p-6 sm:p-9 md:p-10 rounded-xl overflow-hidden shadow-inner">

          {/* Low-Opacity Jaali / Geometric Pattern Overlay */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.04] z-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23B88A28' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3Cpath d='M20 0L0 20v20l40-40H20z'/%3E%3Ccircle cx='20' cy='20' r='3'/%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '36px 36px'
            }}
          />

          {/* Corner Flourish 1: Top-Left */}
          <svg className="absolute top-2 left-2 w-8 h-8 text-brand-gold/30 pointer-events-none z-10" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M4 18V6a2 2 0 0 1 2-2h12" />
            <path d="M4 4l12 12" />
            <circle cx="16" cy="16" r="2" fill="currentColor" opacity="0.6" />
          </svg>

          {/* Corner Flourish 2: Top-Right */}
          <svg className="absolute top-2 right-2 w-8 h-8 text-brand-gold/30 pointer-events-none transform rotate-90 z-10" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M4 18V6a2 2 0 0 1 2-2h12" />
            <path d="M4 4l12 12" />
            <circle cx="16" cy="16" r="2" fill="currentColor" opacity="0.6" />
          </svg>

          {/* Corner Flourish 3: Bottom-Left */}
          <svg className="absolute bottom-2 left-2 w-8 h-8 text-brand-gold/30 pointer-events-none transform -rotate-90 z-10" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M4 18V6a2 2 0 0 1 2-2h12" />
            <path d="M4 4l12 12" />
            <circle cx="16" cy="16" r="2" fill="currentColor" opacity="0.6" />
          </svg>

          {/* Corner Flourish 4: Bottom-Right */}
          <svg className="absolute bottom-2 right-2 w-8 h-8 text-brand-gold/30 pointer-events-none transform rotate-180 z-10" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M4 18V6a2 2 0 0 1 2-2h12" />
            <path d="M4 4l12 12" />
            <circle cx="16" cy="16" r="2" fill="currentColor" opacity="0.6" />
          </svg>

          {/* Wordmark Header & Ornamental Gold Line */}
          <div className="text-center space-y-2 mb-7 relative z-10">
            <Link
              to="/"
              className="font-serif text-4xl font-medium tracking-[0.25em] text-brand-gold hover:opacity-90 transition-opacity inline-block drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)]"
            >
              SETU
            </Link>

            {/* Gold Line with Centered Diamond Motif */}
            <div className="flex items-center justify-center space-x-2.5 my-1.5">
              <div className="h-[1px] w-14 bg-gradient-to-r from-transparent via-brand-gold/60 to-brand-gold" />
              <span className="text-brand-gold text-[10px] font-serif">◆</span>
              <div className="h-[1px] w-14 bg-gradient-to-l from-transparent via-brand-gold/60 to-brand-gold" />
            </div>

            <span className="sub-nav-label text-brand-maroon text-[10px] tracking-widest block font-semibold">
              BIHAR TOURISM MARKETPLACE
            </span>
            <h2 className="text-xl sm:text-2xl font-serif text-brand-black pt-1">
              {t('auth.signInTitle', 'Sign In to Your Account')}
            </h2>
          </div>

          {/* Restyled Demo Accounts Preset Box */}
          <div className="mb-6 bg-gradient-to-r from-cream via-amber-50/70 to-cream p-3.5 rounded-lg border border-brand-gold/40 text-xs font-sans text-brand-brown space-y-1.5 shadow-sm relative z-10">
            <div className="flex items-center space-x-1.5 font-bold text-brand-black text-[11px] sub-nav-label tracking-wider border-b border-brand-brown/10 pb-1">
              <Key className="w-3.5 h-3.5 text-brand-gold shrink-0" />
              <span>DEMO ACCOUNTS PRESETS</span>
            </div>
            <div className="grid grid-cols-1 gap-1 text-[11px] pt-0.5">
              <div>Tourist: <span className="font-mono font-semibold text-brand-black">tourist@setu.local</span> / tourist123</div>
              <div>Vendor: <span className="font-mono font-semibold text-brand-black">vendor@setu.local</span> / vendor123</div>
              <div>Admin: <span className="font-mono font-semibold text-brand-black">admin@setu.local</span> / admin123</div>
            </div>
          </div>

          {errorMsg && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg font-sans relative z-10">
              {errorMsg}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5 font-sans relative z-10">
            <div>
              <label className="block text-xs sub-nav-label text-brand-black/75 mb-2 font-semibold">
                {t('auth.emailLabel', 'EMAIL ADDRESS').toUpperCase()}
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. tourist@setu.local"
                className="w-full bg-cream/60 border border-brand-brown/25 rounded-lg p-3 text-sm text-brand-black placeholder-brand-brown/40 focus:outline-none focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/30 focus:bg-white transition-all shadow-inner"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs sub-nav-label text-brand-black/75 font-semibold">
                  {t('auth.passwordLabel', 'PASSWORD').toUpperCase()}
                </label>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-cream/60 border border-brand-brown/25 rounded-lg p-3 pr-10 text-sm text-brand-black focus:outline-none focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/30 focus:bg-white transition-all shadow-inner"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-brown/60 hover:text-brand-black transition-colors focus:outline-none"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-brand-gold via-amber-400 to-brand-gold hover:from-amber-400 hover:to-brand-gold text-brand-black font-bold p-3.5 rounded-lg text-xs sub-nav-label tracking-widest transition-all duration-300 shadow-md shadow-brand-gold/25 hover:shadow-lg hover:shadow-brand-gold/40 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
            >
              {loading ? 'AUTHENTICATING...' : t('auth.signInBtn', 'SIGN IN TO SETU')}
            </button>
          </form>

          <div className="mt-8 text-center text-xs font-sans text-brand-brown/80 relative z-10">
            {t('auth.dontHaveAccount', "Don't have an account?")}{' '}
            <Link to="/register" className="text-brand-maroon font-semibold hover:underline">
              {t('nav.register', 'Create an account')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

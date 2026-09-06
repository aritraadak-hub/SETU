import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { LoadingScreen } from '../../components/common/LoadingScreen';
import { getHomeRouteForRole } from '../../utils/navigation';
import { User } from '../../types';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const initialRole = searchParams.get('role') === 'VENDOR' ? 'VENDOR' : 'TOURIST';

  const [role, setRole] = useState<'TOURIST' | 'VENDOR'>(initialRole);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState('Tour Operator');
  const [registeredUser, setRegisteredUser] = useState<User | null>(null);
  const registeredUserRef = React.useRef<User | null>(null);

  const [loading, setLoading] = useState(false);
  const [showSuccessAnim, setShowSuccessAnim] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const newUser = await register({
        name,
        email,
        phone,
        password,
        role,
        businessName: role === 'VENDOR' ? businessName : undefined,
        businessType: role === 'VENDOR' ? businessType : undefined
      });

      registeredUserRef.current = newUser;
      setRegisteredUser(newUser);
      localStorage.setItem('setu_entry_completed', 'true');
      showToast(`Account created successfully as ${role}!`, 'success');
      setShowSuccessAnim(true);
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed');
      showToast(err.message || 'Registration failed', 'error');
      setLoading(false);
    }
  };

  if (showSuccessAnim) {
    return (
      <LoadingScreen
        brandText={role === 'VENDOR' ? 'ACCOUNT CREATED. AWAITING ADMIN APPROVAL...' : 'ACCOUNT CREATED. WELCOME TO SETU!'}
        onComplete={() => {
          localStorage.setItem('setu_entry_completed', 'true');
          const finalUser = registeredUserRef.current || registeredUser;
          navigate(getHomeRouteForRole(finalUser));
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-black/35 backdrop-blur-sm flex flex-col justify-center items-center px-4 sm:px-6 py-24">
      <div className="w-full max-w-lg bg-white/95 backdrop-blur-md border border-brand-brown/25 p-5 sm:p-8 md:p-10 rounded-xl shadow-2xl">
        <div className="text-center space-y-2 mb-8">
          <Link to="/" className="font-serif text-4xl text-brand-gold tracking-widest block">
            SETU
          </Link>
          <span className="sub-nav-label text-brand-maroon text-[10px] block">
            BIHAR TOURISM MARKETPLACE
          </span>
          <h2 className="text-2xl font-serif text-brand-black pt-2">Create Your Account</h2>
        </div>

        {/* Role Selection Toggle */}
        <div className="flex border border-brand-brown/20 rounded p-1 bg-cream mb-6">
          <button
            type="button"
            onClick={() => setRole('TOURIST')}
            className={`flex-1 py-2 text-xs sub-nav-label rounded transition-all ${
              role === 'TOURIST'
                ? 'bg-brand-black text-brand-gold font-bold shadow-sm'
                : 'text-brand-black/70 hover:text-brand-black'
            }`}
          >
            TOURIST ACCOUNT
          </button>
          <button
            type="button"
            onClick={() => setRole('VENDOR')}
            className={`flex-1 py-2 text-xs sub-nav-label rounded transition-all ${
              role === 'VENDOR'
                ? 'bg-brand-black text-brand-gold font-bold shadow-sm'
                : 'text-brand-black/70 hover:text-brand-black'
            }`}
          >
            VENDOR MARKETPLACE
          </button>
        </div>

        {errorMsg && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded font-sans">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 font-sans">
          <div>
            <label className="block text-xs sub-nav-label text-brand-black/70 mb-1.5">FULL NAME</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Ramesh Kumar"
              className="w-full bg-cream-light border border-brand-brown/20 rounded p-3 text-sm focus:outline-none focus:border-brand-gold text-brand-black"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs sub-nav-label text-brand-black/70 mb-1.5">EMAIL</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-cream-light border border-brand-brown/20 rounded p-3 text-sm focus:outline-none focus:border-brand-gold text-brand-black"
              />
            </div>
            <div>
              <label className="block text-xs sub-nav-label text-brand-black/70 mb-1.5">PHONE NUMBER</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+919876543210"
                className="w-full bg-cream-light border border-brand-brown/20 rounded p-3 text-sm focus:outline-none focus:border-brand-gold text-brand-black"
              />
            </div>
          </div>

          {/* Additional Vendor Profile Fields */}
          {role === 'VENDOR' && (
            <div className="p-4 bg-cream rounded border border-brand-brown/15 space-y-4">
              <span className="text-[10px] sub-nav-label text-brand-maroon block">
                VENDOR BUSINESS DETAILS (REQUIRES ADMIN APPROVAL)
              </span>
              <div>
                <label className="block text-xs sub-nav-label text-brand-black/70 mb-1">BUSINESS NAME</label>
                <input
                  type="text"
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. Bodh Gaya Heritage Walks"
                  className="w-full bg-white border border-brand-brown/20 rounded p-2.5 text-sm focus:outline-none focus:border-brand-gold text-brand-black"
                />
              </div>

              <div>
                <label className="block text-xs sub-nav-label text-brand-black/70 mb-1">BUSINESS TYPE</label>
                <select
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                  className="w-full bg-white border border-brand-brown/20 rounded p-2.5 text-sm focus:outline-none focus:border-brand-gold text-brand-black"
                >
                  <option value="Guided Tour">Guided Tour / Heritage Walk</option>
                  <option value="Cultural Experience">Cultural Workshop & Art</option>
                  <option value="Homestay">Heritage Homestay / Resort</option>
                  <option value="Transportation">Private AC Transport</option>
                </select>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs sub-nav-label text-brand-black/70 mb-1.5">PASSWORD</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-cream-light border border-brand-brown/20 rounded p-3 pr-10 text-sm focus:outline-none focus:border-brand-gold text-brand-black"
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
            <div>
              <label className="block text-xs sub-nav-label text-brand-black/70 mb-1.5">CONFIRM PASSWORD</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-cream-light border border-brand-brown/20 rounded p-3 pr-10 text-sm focus:outline-none focus:border-brand-gold text-brand-black"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-brown/60 hover:text-brand-black transition-colors focus:outline-none"
                  aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-brand-black text-brand-gold sub-nav-label text-xs tracking-widest rounded hover:bg-brand-maroon hover:text-white transition-all shadow-md disabled:opacity-50"
          >
            {loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-brand-brown/15 text-center text-xs font-sans text-brand-black/70">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-maroon font-semibold hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

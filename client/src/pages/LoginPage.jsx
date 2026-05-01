import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../api';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'member' });
  const [showPassword, setShowPassword] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const { login } = useAuth();
  const navigate = useNavigate();
  const loginSectionRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const scrollToLogin = () => {
    loginSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        const res = await authApi.login({ email: form.email, password: form.password });
        if (res.data.user.role !== form.role) {
          toast.error(`This account does not have ${form.role} privileges.`);
          return;
        }
        login(res.data.token, res.data.user);
        toast.success(res.data.message);
        navigate('/');
      } else {
        await authApi.signup(form);
        toast.success('Account created successfully! Please sign in.');
        setIsLogin(true);
        setForm({ ...form, password: '' });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  /* ── Branding Content ── */
  const BrandingHero = () => (
    <div className="relative flex flex-col items-center justify-center w-full h-screen overflow-hidden bg-gradient-to-br from-indigo-100/80 via-purple-50 to-pink-100/50 border-b border-white/50">
      {/* Logo */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 lg:left-10 lg:translate-x-0 z-20 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg">
          <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>sync</span>
        </div>
        <span className="font-extrabold text-gray-900 tracking-tight text-2xl">TeamSync</span>
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.05)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_20%,transparent_100%)]"></div>

      {/* Blobs */}
      <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-indigo-300/30 rounded-full mix-blend-multiply filter blur-[60px] animate-antigravity" style={{ transform: `translate(${-mousePos.x * 2}px, ${-mousePos.y * 2}px)` }} />
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-purple-300/30 rounded-full mix-blend-multiply filter blur-[80px] animate-antigravity-reverse animation-delay-2000" style={{ transform: `translate(${mousePos.x * 3}px, ${mousePos.y * 3}px)` }} />
      <div className="absolute top-1/2 left-1/2 w-[250px] h-[250px] bg-pink-300/20 rounded-full mix-blend-multiply filter blur-[50px] animate-levitate animation-delay-4000" />

      {/* Floating UI Elements */}
      <div className="relative z-10 w-full max-w-6xl px-6 flex flex-col items-center">
        
        {/* Floating Cards (Desktop only for full effect, simplified for mobile) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden hidden md:block">
          {/* Task List Card - Top Left */}
          <div
            className="absolute top-[10%] left-[5%] w-56 bg-white/60 backdrop-blur-md border border-white/60 rounded-2xl p-4 shadow-float animate-antigravity"
            style={{ transform: `rotate(-6deg) translate(${mousePos.x}px, ${mousePos.y}px)` }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                <span className="material-symbols-outlined text-indigo-600 text-[18px]">task_alt</span>
              </div>
              <div className="h-2 w-20 bg-indigo-200/50 rounded-full"></div>
            </div>
            <div className="space-y-2">
              <div className="h-1.5 w-full bg-gray-200/80 rounded-full"></div>
              <div className="h-1.5 w-5/6 bg-gray-200/80 rounded-full"></div>
            </div>
          </div>

          {/* Stats Card - Top Right */}
          <div
            className="absolute top-[10%] right-[5%] w-32 bg-white/50 backdrop-blur-sm border border-white/40 rounded-[20px] p-4 shadow-float animate-levitate animation-delay-4000"
            style={{ transform: `rotate(4deg) translate(${mousePos.x * 2}px, ${-mousePos.y * 2}px)` }}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-100 flex items-center justify-center shadow-sm">
                <span className="material-symbols-outlined text-purple-600" style={{ fontSize: '18px' }}>local_fire_department</span>
              </div>
              <div>
                <div className="text-lg font-black text-gray-900">24</div>
                <div className="text-[8px] font-bold text-gray-500 uppercase tracking-wider">Active</div>
              </div>
            </div>
          </div>

          {/* Progress Card - Bottom Left */}
          <div
            className="absolute bottom-[10%] left-[5%] w-40 bg-white/70 backdrop-blur-lg border border-white/60 rounded-2xl p-5 shadow-float animate-antigravity animation-delay-2000"
            style={{ transform: `rotate(5deg) translate(${-mousePos.x * 1.5}px, ${-mousePos.y * 1.5}px)` }}
          >
            <h4 className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-3">Workspace</h4>
            <div className="relative w-16 h-16 mx-auto">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-gray-100" />
                <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" fill="transparent" strokeDasharray="176" strokeDashoffset="52" className="text-indigo-500" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-black text-gray-900">70%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Stats Summary */}
        <div className="flex md:hidden items-center justify-center gap-4 mb-8">
          <div className="bg-white/70 backdrop-blur-md border border-white/60 rounded-xl px-4 py-2.5 shadow-sm flex items-center gap-3">
             <span className="material-symbols-outlined text-purple-600" style={{ fontSize: '20px' }}>local_fire_department</span>
             <span className="text-lg font-black text-gray-900">24</span>
          </div>
          <div className="bg-white/70 backdrop-blur-md border border-white/60 rounded-xl px-4 py-2.5 shadow-sm flex items-center gap-3">
             <span className="material-symbols-outlined text-indigo-600" style={{ fontSize: '20px' }}>bolt</span>
             <span className="text-lg font-black text-gray-900">70%</span>
          </div>
        </div>

        {/* Hero Text */}
        <div className="text-center" style={{ transform: `translate(${-mousePos.x * 0.3}px, ${-mousePos.y * 0.3}px)` }}>
          <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tight leading-[1.1] mb-6">
            Focus on <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-[length:200%_auto] animate-shimmer">
              what matters.
            </span>
          </h1>
          <p className="text-lg md:text-2xl font-medium text-gray-500/90 tracking-wide max-w-xl mx-auto mb-10 leading-relaxed">
            Eliminate noise and amplify productivity with the next generation of project management.
          </p>
          
          <button 
            onClick={scrollToLogin}
            className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gray-900 text-white rounded-2xl font-bold transition-all hover:scale-105 active:scale-95 shadow-xl hover:shadow-indigo-500/20"
          >
            Get Started
            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">east</span>
          </button>
        </div>
      </div>

      {/* Scroll Hint */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-400 animate-bounce cursor-pointer" onClick={scrollToLogin}>
        <span className="text-[10px] font-bold uppercase tracking-widest">Scroll to start</span>
        <span className="material-symbols-outlined">expand_more</span>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-[#fafafa] font-sans selection:bg-indigo-500/30">
      
      {/* ── Section 1: Hero Branding ── */}
      <BrandingHero />

      {/* ── Section 2: Login Form ── */}
      <div 
        ref={loginSectionRef}
        className="relative flex items-center justify-center min-h-screen p-6 sm:p-12 overflow-hidden bg-white"
      >
        {/* Subtle background decoration for form section */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-50 rounded-full blur-3xl opacity-50" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-50 rounded-full blur-3xl opacity-50" />

        <div className="w-full max-w-[440px] relative z-10">
          <div className="bg-white rounded-[32px] shadow-2xl border border-gray-100 p-8 sm:p-12 transition-all duration-500 relative">
            
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-3">
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </h2>
              <p className="text-gray-500 font-medium">
                {isLogin ? 'Enter your details to access your workspace' : 'Start your journey with TeamSync today'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">

              {/* Role Toggle */}
              <div className="relative flex p-1.5 bg-gray-50 rounded-2xl border border-gray-200">
                <div className={`absolute inset-y-1.5 w-[calc(50%-6px)] bg-white rounded-xl shadow-sm border border-gray-100 transition-all duration-300 ease-out ${form.role === 'admin' ? 'translate-x-full left-1.5' : 'translate-x-0 left-1.5'}`} />
                {['member', 'admin'].map(r => (
                  <button
                    key={r} type="button"
                    onClick={() => setForm({ ...form, role: r })}
                    className={`relative z-10 flex-1 py-2.5 text-sm font-bold rounded-xl transition-colors duration-300 capitalize
                      ${form.role === r ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'}
                    `}
                  >
                    {r}
                  </button>
                ))}
              </div>

              {!isLogin && (
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-gray-400 group-focus-within:text-indigo-500 transition-colors" style={{ fontSize: '20px' }}>person</span>
                  </div>
                  <input
                    type="text" id="name" required
                    value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                    className="block w-full pl-11 pr-4 pt-6 pb-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm transition-all focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none peer"
                    placeholder=" "
                  />
                  <label htmlFor="name" className="absolute text-[13px] font-bold text-gray-400 duration-200 transform -translate-y-3 scale-85 top-[18px] z-10 origin-[0] left-11 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-85 peer-focus:-translate-y-3 peer-focus:text-indigo-600 pointer-events-none">
                    Full Name
                  </label>
                </div>
              )}

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-gray-400 group-focus-within:text-indigo-500 transition-colors" style={{ fontSize: '20px' }}>mail</span>
                </div>
                <input
                  type="email" id="email" required
                  value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                  className="block w-full pl-11 pr-4 pt-6 pb-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm transition-all focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none peer"
                  placeholder=" "
                />
                <label htmlFor="email" className="absolute text-[13px] font-bold text-gray-400 duration-200 transform -translate-y-3 scale-85 top-[18px] z-10 origin-[0] left-11 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-85 peer-focus:-translate-y-3 peer-focus:text-indigo-600 pointer-events-none">
                  Email Address
                </label>
              </div>

              <div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-gray-400 group-focus-within:text-indigo-500 transition-colors" style={{ fontSize: '20px' }}>lock</span>
                  </div>
                  <input
                    type={showPassword ? "text" : "password"} id="password" required minLength={6}
                    value={form.password} onChange={e => setForm({...form, password: e.target.value})}
                    className="block w-full pl-11 pr-12 pt-6 pb-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm transition-all focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none peer"
                    placeholder=" "
                  />
                  <label htmlFor="password" className="absolute text-[13px] font-bold text-gray-400 duration-200 transform -translate-y-3 scale-85 top-[18px] z-10 origin-[0] left-11 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-85 peer-focus:-translate-y-3 peer-focus:text-indigo-600 pointer-events-none">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-indigo-600 transition-colors"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
                {isLogin && (
                  <div className="flex justify-end mt-3 px-1">
                    <a href="#" className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors">
                      Forgot password?
                    </a>
                  </div>
                )}
              </div>

              <button
                type="submit" disabled={loading}
                className="w-full mt-2 py-4 px-6 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-indigo-200 transition-all hover:bg-indigo-700 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="loader-spinner !w-5 !h-5 !border-2 !border-white/20 !border-t-white" />
                ) : (
                  <>
                    {isLogin ? 'Sign In' : 'Create Account'}
                    <span className="material-symbols-outlined text-[20px]">east</span>
                  </>
                )}
              </button>

              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-gray-100"></div>
                <span className="flex-shrink-0 mx-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Secure Connect</span>
                <div className="flex-grow border-t border-gray-100"></div>
              </div>

              <button
                type="button"
                className="w-full py-4 px-6 bg-white border border-gray-200 text-gray-700 font-bold rounded-2xl shadow-sm transition-all hover:bg-gray-50 hover:border-gray-300 flex items-center justify-center gap-3"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>
            </form>

            <div className="mt-10 text-center text-sm font-bold">
              <span className="text-gray-400">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
              </span>
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-indigo-600 hover:text-indigo-800 transition-colors ml-2"
              >
                {isLogin ? 'Sign up for free' : 'Sign in to workspace'}
              </button>
            </div>
          </div>
          
          <p className="mt-8 text-center text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">
            &copy; 2026 TeamSync. All Rights Reserved.
          </p>
        </div>
      </div>
    </div>
  );
}

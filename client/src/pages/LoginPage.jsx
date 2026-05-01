import { useState, useEffect } from 'react';
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

  // Subtle parallax effect tracking
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

  return (
    <div className="flex min-h-screen bg-[#fafafa] font-sans overflow-hidden relative selection:bg-indigo-500/30">
      
      {/* ── Left Side (Visual / Branding Panel) ── */}
      <div className="hidden lg:flex lg:w-[55%] relative bg-gradient-to-br from-indigo-100/80 via-purple-50 to-pink-100/50 items-center justify-center overflow-hidden border-r border-white/50">
        
        {/* Top-Left Branding */}
        <div className="absolute top-8 left-10 z-20 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg">
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>sync</span>
          </div>
          <span className="font-extrabold text-gray-900 tracking-tight text-xl">TeamSync</span>
        </div>

        {/* Very light grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.05)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_20%,transparent_100%)]"></div>

        {/* ── Floating 3D Background Elements ── */}
        <div 
          className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-indigo-300/30 rounded-full mix-blend-multiply filter blur-[80px] animate-antigravity"
          style={{ transform: `translate(${-mousePos.x * 2}px, ${-mousePos.y * 2}px)` }}
        />
        <div 
          className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-300/30 rounded-full mix-blend-multiply filter blur-[100px] animate-antigravity-reverse animation-delay-2000"
          style={{ transform: `translate(${mousePos.x * 3}px, ${mousePos.y * 3}px)` }}
        />
        <div 
          className="absolute top-1/2 left-1/2 w-[300px] h-[300px] bg-pink-300/20 rounded-full mix-blend-multiply filter blur-[60px] animate-levitate animation-delay-4000"
        />

        {/* ── Floating UI Cards (Mini Dashboard Preview) ── */}
        
        {/* Task List Card (Tilted) */}
        <div 
          className="absolute top-[15%] right-[15%] w-64 bg-white/60 backdrop-blur-md border border-white/60 rounded-2xl p-4 shadow-[0_20px_40px_-15px_rgba(99,102,241,0.15)] animate-antigravity animation-delay-2000 rotate-[-8deg] z-0"
          style={{ transform: `rotate(-8deg) translate(${mousePos.x}px, ${mousePos.y}px)` }}
        >
          <div className="w-8 h-8 rounded-lg bg-indigo-100/80 mb-4 flex items-center justify-center">
            <span className="material-symbols-outlined text-indigo-500 text-[18px]">task_alt</span>
          </div>
          <div className="space-y-3">
            <div className="h-2.5 w-3/4 bg-gray-200/80 rounded-full"></div>
            <div className="h-2.5 w-1/2 bg-gray-200/80 rounded-full"></div>
            <div className="h-2.5 w-5/6 bg-gray-200/80 rounded-full"></div>
          </div>
        </div>

        {/* Progress Ring Card */}
        <div 
          className="absolute bottom-[20%] left-[10%] w-48 bg-white/70 backdrop-blur-lg border border-white/60 rounded-2xl p-5 shadow-[0_20px_40px_-15px_rgba(99,102,241,0.2)] animate-antigravity rotate-[5deg] z-0"
          style={{ transform: `rotate(5deg) translate(${-mousePos.x * 1.5}px, ${-mousePos.y * 1.5}px)` }}
        >
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Progress</h4>
          <div className="relative w-20 h-20 mx-auto">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-100" />
              <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="226" strokeDashoffset="67" className="text-indigo-500 transition-all duration-1000 ease-out" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold text-gray-800">70%</span>
            </div>
          </div>
        </div>

        {/* Stats Card */}
        <div 
          className="absolute top-[40%] left-[5%] w-40 bg-white/50 backdrop-blur-sm border border-white/40 rounded-[20px] p-4 shadow-[0_15px_30px_-10px_rgba(124,58,237,0.15)] animate-levitate animation-delay-6000 rotate-[-3deg] z-0"
          style={{ transform: `rotate(-3deg) translate(${mousePos.x * 2}px, ${-mousePos.y * 2}px)` }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
              <span className="material-symbols-outlined text-purple-600">local_fire_department</span>
            </div>
            <div>
              <div className="text-2xl font-black text-gray-900">24</div>
              <div className="text-[10px] font-bold text-gray-500 uppercase">Tasks</div>
            </div>
          </div>
        </div>

        {/* ── Visual Content (Text) ── */}
        <div className="relative z-10 text-center px-16 flex flex-col items-center max-w-2xl" style={{ transform: `translate(${-mousePos.x * 0.5}px, ${-mousePos.y * 0.5}px)` }}>
          <div className="absolute -top-32 mb-10 w-16 h-16 rounded-2xl bg-white/80 backdrop-blur-xl flex items-center justify-center text-indigo-600 shadow-xl shadow-indigo-500/20 border border-white/50">
            <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>flare</span>
          </div>
          <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight mb-4 leading-tight">
            Focus on <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">what matters.</span>
          </h1>
          <p className="text-xl font-medium text-gray-500/90 tracking-wide">
            Let everything else float away.
          </p>
        </div>

      </div>

      {/* ── Right Side (Login Panel) ── */}
      <div className="w-full lg:w-[45%] flex items-center justify-center p-6 sm:p-12 relative z-10 min-h-screen">
        
        {/* Mobile Background */}
        <div className="lg:hidden absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50 -z-10 overflow-hidden">
           <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-200/30 rounded-full mix-blend-multiply blur-[80px] animate-antigravity"></div>
           <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-200/30 rounded-full mix-blend-multiply blur-[80px] animate-antigravity-reverse"></div>
        </div>

        {/* ── Centered Glassmorphic Card ── */}
        <div className="w-full max-w-[420px] animate-levitate animation-delay-2000">
          
          <div className="bg-white/70 backdrop-blur-xl rounded-[20px] shadow-[0_20px_60px_-15px_rgba(99,102,241,0.1)] border border-white/60 p-8 sm:p-10 transition-transform duration-500 hover:-translate-y-1 relative">
            
            {/* Subtle inner top glare */}
            <div className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-white to-transparent opacity-100"></div>

            <div className="mb-8">
              <h2 className="text-[28px] font-extrabold text-gray-900 tracking-tight mb-1.5 flex items-center gap-2">
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </h2>
              <p className="text-gray-500 text-sm font-medium">
                {isLogin ? 'Sign in to TeamSync to continue' : 'Join TeamSync and experience deep focus'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              
              {/* Toggle Tabs (Member / Admin) */}
              <div className="relative flex p-1 bg-gray-100/60 rounded-[14px] border border-gray-200/50 backdrop-blur-sm">
                {/* Sliding Indicator */}
                <div 
                  className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-[10px] shadow-sm border border-gray-200/50 transition-all duration-300 ease-out ${form.role === 'admin' ? 'translate-x-full' : 'translate-x-0'}`} 
                />
                
                {['member', 'admin'].map(r => (
                  <button
                    key={r} type="button"
                    onClick={() => setForm({ ...form, role: r })}
                    className={`relative z-10 flex-1 py-2 text-sm font-semibold rounded-[10px] transition-colors duration-300 capitalize
                      ${form.role === r ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-700'}
                    `}
                  >
                    {r}
                  </button>
                ))}
              </div>

              {!isLogin && (
                <div className="relative group mt-2">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-gray-400 group-focus-within:text-indigo-500 transition-colors" style={{ fontSize: '20px' }}>person</span>
                  </div>
                  <input
                    type="text" id="name" required
                    value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                    className="block w-full pl-11 pr-4 pt-6 pb-2.5 bg-white/60 border border-gray-200/80 rounded-xl text-sm transition-all focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 outline-none peer shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]"
                    placeholder=" "
                  />
                  <label htmlFor="name" className="absolute text-[13px] font-medium text-gray-400 duration-200 transform -translate-y-3 scale-85 top-[18px] z-10 origin-[0] left-11 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-85 peer-focus:-translate-y-3 peer-focus:text-indigo-600 pointer-events-none">
                    Full Name
                  </label>
                </div>
              )}

              <div className="relative group mt-2">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-gray-400 group-focus-within:text-indigo-500 transition-colors" style={{ fontSize: '20px' }}>mail</span>
                </div>
                <input
                  type="email" id="email" required
                  value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                  className="block w-full pl-11 pr-4 pt-6 pb-2.5 bg-white/60 border border-gray-200/80 rounded-xl text-sm transition-all focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 outline-none peer shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]"
                  placeholder=" "
                />
                <label htmlFor="email" className="absolute text-[13px] font-medium text-gray-400 duration-200 transform -translate-y-3 scale-85 top-[18px] z-10 origin-[0] left-11 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-85 peer-focus:-translate-y-3 peer-focus:text-indigo-600 pointer-events-none">
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
                    className="block w-full pl-11 pr-12 pt-6 pb-2.5 bg-white/60 border border-gray-200/80 rounded-xl text-sm transition-all focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 outline-none peer shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]"
                    placeholder=" "
                  />
                  <label htmlFor="password" className="absolute text-[13px] font-medium text-gray-400 duration-200 transform -translate-y-3 scale-85 top-[18px] z-10 origin-[0] left-11 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-85 peer-focus:-translate-y-3 peer-focus:text-indigo-600 pointer-events-none">
                    Password
                  </label>
                  
                  {/* Show/Hide Toggle */}
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
                  <div className="flex justify-end mt-3">
                    <a href="#" className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors">
                      Forgot password?
                    </a>
                  </div>
                )}
              </div>

              <button
                type="submit" disabled={loading}
                className="w-full mt-2 py-3.5 px-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-[length:200%_auto] hover:bg-[position:100%_0] text-white text-[15px] font-bold rounded-xl shadow-[0_8px_20px_-6px_rgba(99,102,241,0.5)] transform transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_24px_-6px_rgba(99,102,241,0.7)] active:translate-y-0 active:scale-[0.98] flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span className="loader-spinner !w-5 !h-5 !border-2 !border-white/40 !border-t-white" />
                ) : (
                  <>
                    {isLogin ? 'Sign In' : 'Create Account'}
                    <span className="material-symbols-outlined text-[18px] opacity-90 transition-transform">east</span>
                  </>
                )}
              </button>

              {/* Divider */}
              <div className="relative flex items-center py-1">
                <div className="flex-grow border-t border-gray-200/80"></div>
                <span className="flex-shrink-0 mx-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Or</span>
                <div className="flex-grow border-t border-gray-200/80"></div>
              </div>

              {/* Minimal Google Button */}
              <button
                type="button"
                className="w-full py-3 px-4 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 text-sm font-bold rounded-xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] flex items-center justify-center gap-3"
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

            <div className="mt-8 text-center text-[13px] font-medium text-gray-500">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="text-indigo-600 hover:text-indigo-800 hover:underline transition-colors ml-1 font-bold"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

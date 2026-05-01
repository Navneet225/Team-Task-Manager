import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import Sidebar from './components/Sidebar';

function ProtectedLayout() {
  const { user, loading, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  if (loading) return (
    <div className="flex items-center justify-center h-screen w-full" style={{ background: 'var(--surface)' }}>
      <div className="flex flex-col items-center gap-4">
        <div className="loader-spinner" />
        <p style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: 500, letterSpacing: '0.05em' }}>
          Loading workspace...
        </p>
      </div>
    </div>
  );
  if (!user) return <Navigate to="/login" replace />;
  
  return (
    <div className="flex h-screen w-full overflow-hidden" style={{ background: 'var(--surface)' }}>
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#FAFAFA]">
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 -ml-2 text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-100"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-md bg-indigo-600 flex items-center justify-center text-white">
              <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>workspaces</span>
            </div>
            <span className="font-bold text-gray-900 tracking-tight text-base">TeamSync</span>
          </div>
          <div className="flex items-center gap-1">
            {/* Mobile Notifications */}
            <div className="relative">
              <button
                onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); }}
                className={`p-2 rounded-full transition-colors ${showNotifications ? 'bg-indigo-50 text-indigo-600' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>notifications</span>
              </button>
              {showNotifications && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)}></div>
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-float border border-gray-100 overflow-hidden z-50 animate-scale-in origin-top-right">
                    <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                      <h3 className="font-semibold text-gray-900 text-sm">Notifications</h3>
                      <span className="text-[10px] uppercase tracking-wider bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-bold">0 New</span>
                    </div>
                    <div className="p-8 text-center flex flex-col items-center bg-white">
                      <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                        <span className="material-symbols-outlined text-gray-400" style={{ fontSize: '24px' }}>notifications_paused</span>
                      </div>
                      <p className="text-gray-900 font-medium text-sm">You&apos;re all caught up!</p>
                      <p className="text-gray-500 text-xs mt-1">Check back later for updates.</p>
                    </div>
                  </div>
                </>
              )}
            </div>
            {/* Mobile Profile */}
            <div className="relative">
              <button
                onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); }}
                className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm border border-white shadow-sm"
              >
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </button>
              {showProfile && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowProfile(false)}></div>
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50 animate-scale-in origin-top-right">
                    <div className="p-4 border-b border-gray-50 bg-gray-50/50">
                      <p className="text-sm font-bold text-gray-900 truncate">{user?.name}</p>
                      <p className="text-xs text-gray-500 truncate mt-0.5">{user?.email}</p>
                      <span className="inline-flex mt-1.5 text-[10px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full capitalize">{user?.role}</span>
                    </div>
                    <div className="p-1.5 text-sm">
                      <button className="w-full flex items-center gap-2.5 px-3 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-md transition-colors" onClick={() => setShowProfile(false)}>
                        <span className="material-symbols-outlined text-gray-400" style={{ fontSize: '18px' }}>person</span>
                        Profile Settings
                      </button>
                      <button className="w-full flex items-center gap-2.5 px-3 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-md transition-colors" onClick={() => setShowProfile(false)}>
                        <span className="material-symbols-outlined text-gray-400" style={{ fontSize: '18px' }}>settings</span>
                        Preferences
                      </button>
                    </div>
                    <div className="p-1.5 border-t border-gray-50">
                      <button
                        onClick={() => { setShowProfile(false); logout(); }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors font-medium"
                      >
                        <span className="material-symbols-outlined text-red-500" style={{ fontSize: '18px' }}>logout</span>
                        Sign Out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Desktop Top Bar */}
        <header className="hidden lg:flex items-center justify-between px-8 py-4 bg-white border-b border-gray-200">
          <div className="w-96">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" style={{ fontSize: '18px' }}>search</span>
              <input 
                type="text" 
                placeholder="Search tasks, projects..." 
                className="input-minimal !pl-10 bg-gray-50 border-transparent focus:bg-white focus:border-indigo-500"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className={`p-2 rounded-full transition-colors ${showNotifications ? 'bg-indigo-50 text-indigo-600' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>notifications</span>
              </button>
              
              {showNotifications && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)}></div>
                  <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-float border border-gray-100 overflow-hidden z-50 animate-scale-in origin-top-right">
                    <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                      <h3 className="font-semibold text-gray-900 text-sm">Notifications</h3>
                      <span className="text-[10px] uppercase tracking-wider bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-bold">0 New</span>
                    </div>
                    <div className="p-8 text-center flex flex-col items-center bg-white">
                      <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                        <span className="material-symbols-outlined text-gray-400" style={{ fontSize: '24px' }}>notifications_paused</span>
                      </div>
                      <p className="text-gray-900 font-medium text-sm">You&apos;re all caught up!</p>
                      <p className="text-gray-500 text-xs mt-1">Check back later for updates.</p>
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="relative pl-4 border-l border-gray-200">
              <button 
                onClick={() => setShowProfile(!showProfile)}
                className="flex items-center gap-3 text-left hover:bg-gray-50 p-1.5 pr-2 rounded-lg transition-colors"
              >
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold text-gray-900 leading-tight">{user?.name || 'User'}</p>
                  <p className="text-xs text-gray-500 capitalize">{user?.role || 'Member'}</p>
                </div>
                <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm shadow-sm border border-white">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="material-symbols-outlined text-gray-400" style={{ fontSize: '18px' }}>expand_more</span>
              </button>

              {showProfile && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowProfile(false)}></div>
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50 animate-scale-in origin-top-right">
                    <div className="p-4 border-b border-gray-50 bg-gray-50/50">
                      <p className="text-sm font-bold text-gray-900 truncate">{user?.name}</p>
                      <p className="text-xs text-gray-500 truncate mt-0.5">{user?.email}</p>
                    </div>
                    <div className="p-1.5 text-sm">
                      <button className="w-full flex items-center gap-2.5 px-3 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-md transition-colors" onClick={() => setShowProfile(false)}>
                        <span className="material-symbols-outlined text-gray-400 group-hover:text-indigo-500" style={{ fontSize: '18px' }}>person</span>
                        Profile Settings
                      </button>
                      <button className="w-full flex items-center gap-2.5 px-3 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-md transition-colors" onClick={() => setShowProfile(false)}>
                        <span className="material-symbols-outlined text-gray-400 group-hover:text-indigo-500" style={{ fontSize: '18px' }}>settings</span>
                        Preferences
                      </button>
                    </div>
                    <div className="p-1.5 border-t border-gray-50">
                      <button 
                        onClick={() => { setShowProfile(false); logout(); }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors font-medium"
                      >
                        <span className="material-symbols-outlined text-red-500" style={{ fontSize: '18px' }}>logout</span>
                        Sign Out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 lg:p-8">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/:id" element={<ProjectDetailPage />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

function AppRoutes() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <LoginPage />} />
      <Route path="/*" element={<ProtectedLayout />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#ffffff',
              color: '#111827',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              fontFamily: 'inherit',
              padding: '12px 16px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
            },
            success: { iconTheme: { primary: '#10b981', secondary: '#ffffff' } },
            error:   { iconTheme: { primary: '#ef4444', secondary: '#ffffff' } },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  );
}

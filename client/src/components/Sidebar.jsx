import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/', icon: 'dashboard', label: 'Dashboard', exact: true },
  { to: '/projects', icon: 'folder_open', label: 'Projects' },
];

export default function Sidebar({ isOpen, setIsOpen }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-[260px] bg-white border-r border-gray-200
        flex flex-col h-full transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo Section */}
        <div className="h-[73px] flex items-center px-6 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm">
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>workspaces</span>
            </div>
            <div className="font-bold text-gray-900 tracking-tight text-xl">TeamSync</div>
          </div>
          
          {/* Mobile Close Button */}
          <button 
            className="ml-auto lg:hidden p-1 text-gray-400 hover:text-gray-600"
            onClick={() => setIsOpen(false)}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>close</span>
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-1">
          <div className="px-3 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Menu
          </div>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.exact}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200
                ${isActive 
                  ? 'bg-indigo-50 text-indigo-700 font-medium' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
              `}
            >
              {({ isActive }) => (
                <>
                  <span 
                    className={`material-symbols-outlined ${isActive ? 'text-indigo-600' : 'text-gray-400'}`} 
                    style={{ fontSize: '20px' }}
                  >
                    {item.icon}
                  </span>
                  {item.label}
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-50 hover:text-red-600 transition-colors"
          >
            <span className="material-symbols-outlined text-gray-400 group-hover:text-red-500" style={{ fontSize: '20px' }}>logout</span>
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}

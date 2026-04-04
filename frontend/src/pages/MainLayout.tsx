import { Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';  

export const MainLayout = () => {
  const { data: auth } = useAuth();
 
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-mono selection:bg-blue-500/30">
      {/* 1. THE HEADER (Persistent) */}
      <header className="border-b border-slate-900 bg-slate-950/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          
          {/* Brand/Logo */}
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center text-xs font-black shadow-[0_0_15px_rgba(37,99,235,0.4)]">
              OS
            </div>
            <span className="hidden md:block text-[10px] uppercase font-black tracking-tighter">
              OpenSource-Helper <span className="text-blue-500">v1.0</span>
            </span>
          </div>
          
          {/* 2. THE TAB SYSTEM (Navigation) */}
          <nav className="flex gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                `px-6 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
                  isActive ? 'bg-slate-800 text-white shadow-inner' : 'text-slate-500 hover:text-slate-300'
                }`
              }
            >
              Home
            </NavLink>
            <NavLink 
              to="/gemini" 
              className={({ isActive }) => 
                `px-6 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
                  isActive ? 'bg-slate-800 text-white shadow-inner' : 'text-slate-500 hover:text-slate-300'
                }`
              }
            >
              Gemini
            </NavLink>
          </nav>

          {/* User Profile / Status */}
          <div className="flex items-center gap-3">
             <div className="text-right hidden sm:block">
               <p className="text-[8px] text-slate-500 font-black uppercase">Identity</p>
               <p className="text-[10px] text-white font-bold">{auth?.user?.username || 'Guest'}</p>
             </div>
             <div className="h-8 w-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] font-bold">
               {auth?.user?.username?.charAt(0).toUpperCase() || '?'}
             </div>
          </div>
        </div>
      </header>

      {/* 3. THE VIEWPORT (Dynamic) */}
      <main className="max-w-7xl mx-auto p-6 min-h-[calc(100vh-64px)]">
        {/* This is where HomeTab or GeminiTab will be rendered */}
        <Outlet />
      </main>

      {/* 4. THE FOOTER (Optional) */}
      <footer className="py-8 text-center border-t border-slate-900/50">
        <p className="text-[7px] text-slate-700 uppercase font-black tracking-[0.4em]">
          Engineered on Fedora // {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
};
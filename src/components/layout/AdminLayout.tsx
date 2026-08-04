import { Outlet, Link, useLocation } from 'react-router-dom';
import { ShieldCheck, Calendar, Settings, Clock, CalendarOff, LogOut, LayoutDashboard, MonitorSmartphone } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function AdminLayout() {
  const { signOut } = useAuth();
  const location = useLocation();

  const navItems = [
    { name: 'Overview', path: '/admin', icon: LayoutDashboard },
    { name: 'Appointments', path: '/admin/appointments', icon: Calendar },
    { name: 'Services', path: '/admin/services', icon: MonitorSmartphone },
    { name: 'Business Hours', path: '/admin/hours', icon: Clock },
    { name: 'Blocked Dates', path: '/admin/blocked-dates', icon: CalendarOff },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1C2424] text-gray-300 flex flex-col">
        <div className="p-6">
          <Link to="/" className="flex items-center gap-2 text-white">
            <ShieldCheck className="w-6 h-6 text-[#4F8D8B]" />
            <span className="font-semibold text-lg tracking-tight">Admin Portal</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors ${
                  isActive 
                    ? 'bg-[#2A3636] text-white font-medium' 
                    : 'hover:bg-[#2A3636]/50 hover:text-white'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-[#4F8D8B]' : 'text-gray-400'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button
            onClick={signOut}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-white border-b border-gray-200 h-16 flex items-center px-8 shrink-0">
          <h1 className="text-xl font-medium text-gray-800">
            {navItems.find(item => item.path === location.pathname)?.name || 'Dashboard'}
          </h1>
        </header>
        <div className="flex-1 overflow-auto p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

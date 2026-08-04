import { Outlet, Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#FCFDFD]">
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-[#2C5254] text-white p-2 rounded-lg group-hover:bg-[#1E3B3D] transition-colors">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <span className="font-semibold text-xl tracking-tight text-gray-900">TechRepair</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <Link to="/" className="hover:text-[#2C5254] transition-colors">Home</Link>
            <Link to="/#services" className="hover:text-[#2C5254] transition-colors">Services</Link>
            <Link to="/#about" className="hover:text-[#2C5254] transition-colors">About</Link>
            <Link to="/admin" className="hover:text-[#2C5254] transition-colors">Admin</Link>
          </nav>

          <Link
            to="/book"
            className="bg-[#2C5254] hover:bg-[#1E3B3D] text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm"
          >
            Book Repair
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-[#1C2424] text-white py-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <ShieldCheck className="w-6 h-6 text-[#4F8D8B]" />
              <span className="font-semibold text-xl tracking-tight">TechRepair</span>
            </div>
            <p className="text-gray-400 max-w-sm leading-relaxed">
              Premium computer repair services tailored for professionals. Fast, reliable, and secure.
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-4 text-gray-200">Services</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>Hardware Diagnostics</li>
              <li>Data Recovery</li>
              <li>System Optimization</li>
              <li>Component Upgrades</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-4 text-gray-200">Company</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>About Us</li>
              <li>Contact</li>
              <li><Link to="/admin" className="hover:text-white transition-colors">Admin Login</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 pt-12 mt-12 border-t border-gray-800 text-sm text-gray-500 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} TechRepair. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

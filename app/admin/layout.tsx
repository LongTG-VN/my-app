'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { 
  UsersIcon, 
  MapPinIcon, 
  HomeModernIcon, 
  Bars3Icon, 
  CalendarDaysIcon,
  ArrowLeftOnRectangleIcon
} from '@heroicons/react/24/outline';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isChecking, setIsChecking] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const userJson = localStorage.getItem('USER_INFO');
    setIsChecking(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("USER_INFO");
    localStorage.removeItem("USER_TOKEN");
    router.push("/auth/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex font-sans">
      
      {/* --- SIDEBAR --- */}
      <aside 
        className={`${
          isSidebarOpen ? 'w-64' : 'w-20'
        } bg-white border-r border-gray-200 transition-all duration-300 flex flex-col h-screen sticky top-0 z-50`}
      >
        <div className="p-6 flex items-center justify-between border-b border-gray-50">
          <span className={`${!isSidebarOpen && 'hidden'} font-black text-xl tracking-tighter text-rose-500 uppercase`}>
            Airbnb Admin
          </span>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Bars3Icon className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2 mt-4">
          <NavItem href="/admin/users" icon={<UsersIcon className="w-6 h-6" />} label="Người dùng" isOpen={isSidebarOpen} active={pathname === '/admin/users'} />
          <NavItem href="/admin/locations" icon={<MapPinIcon className="w-6 h-6" />} label="Vị trí" isOpen={isSidebarOpen} active={pathname === '/admin/locations'} />
          <NavItem href="/admin/rooms" icon={<HomeModernIcon className="w-6 h-6" />} label="Phòng thuê" isOpen={isSidebarOpen} active={pathname === '/admin/rooms'} />
          <NavItem href="/admin/bookings" icon={<CalendarDaysIcon className="w-6 h-6" />} label="Đặt phòng" isOpen={isSidebarOpen} active={pathname === '/admin/bookings'} />
        </nav>

        <div className="p-4 border-t border-gray-50">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-4 w-full p-3 rounded-xl text-gray-500 hover:bg-rose-50 hover:text-rose-600 transition-all group"
          >
            <ArrowLeftOnRectangleIcon className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            <span className={`${!isSidebarOpen && 'hidden'} font-bold text-sm`}>Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-end px-8 gap-4 shadow-sm z-40">
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Administrator</p>
              <p className="text-sm font-black text-gray-800">Admin Account</p>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-black flex items-center justify-center text-white font-black shadow-lg shadow-gray-200">
              A
            </div>
          </div>
        </header>

        <div className="p-8 overflow-y-auto h-[calc(100vh-64px)] bg-gray-50/50">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>

    </div>
  );
};

const NavItem = ({ href, icon, label, isOpen, active }: any) => (
  <Link 
    href={href} 
    className={`flex items-center gap-4 p-3 rounded-2xl transition-all group ${
      active 
      ? 'bg-rose-500 text-white shadow-lg shadow-rose-200' 
      : 'text-gray-500 hover:bg-rose-50 hover:text-rose-500'
    }`}
  >
    <div className={`${active ? '' : 'group-hover:scale-110'} transition-transform`}>
      {icon}
    </div>
    <span className={`${!isOpen && 'hidden'} font-bold text-sm tracking-tight`}>{label}</span>
  </Link>
);

export default Layout;
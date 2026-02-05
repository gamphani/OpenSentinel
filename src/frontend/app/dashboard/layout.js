'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, Map, Database, Settings, LogOut, ShieldCheck } from 'lucide-react';

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    // SECURITY CHECK: Verify Token Exists
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    } else {
      setAuthorized(true);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  if (!authorized) return null; // Don't show anything while checking

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-cdc-green text-white hidden md:flex flex-col">
        <div className="p-6 border-b border-emerald-800">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <ShieldCheck className="text-cdc-gold" /> OpenSentinel
          </h1>
          <p className="text-xs text-emerald-200 mt-1">Sovereign Node ETH-01</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <NavItem icon={LayoutDashboard} label="Overview" active />
          <NavItem icon={Map} label="Mesh Topology" />
          <NavItem icon={Database} label="Data Ingestion" />
          <NavItem icon={Settings} label="Governance" />
        </nav>

        <div className="p-4 border-t border-emerald-800">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 text-emerald-200 hover:text-white transition-colors w-full"
          >
            <LogOut size={20} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}

function NavItem({ icon: Icon, label, active }) {
  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-colors ${active ? 'bg-cdc-gold text-emerald-900 font-semibold' : 'hover:bg-emerald-800 text-emerald-100'}`}>
      <Icon size={20} />
      <span>{label}</span>
    </div>
  );
}
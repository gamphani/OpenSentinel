'use client';

import { useState } from 'react';
import { ShieldCheck, Lock, Activity, Globe } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);

    try {
      const res = await fetch('http://localhost:8000/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('token', data.access_token); // Store JWT
        router.push('/dashboard'); // Redirect to dashboard
      } else {
        alert("Access Denied: Invalid Credentials for Sovereign Node.");
      }
    } catch (err) {
      console.error(err);
      alert("System Error: Node Offline");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Visual Branding */}
      <div className="hidden lg:flex w-1/2 bg-cdc-green relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="relative z-10 text-white p-12 max-w-lg">
          <div className="flex items-center gap-3 mb-6">
            <Globe size={48} className="text-cdc-gold" />
            <h1 className="text-4xl font-bold tracking-tight">OpenSentinel</h1>
          </div>
          <h2 className="text-2xl font-light mb-4 text-emerald-100">Sovereign Surveillance Mesh</h2>
          <p className="text-emerald-100/80 leading-relaxed">
            Welcome to the National Health Security Node. This system operates under local jurisdiction, empowering the Ministry with AI-driven intelligence while maintaining strict data sovereignty.
          </p>
          <div className="mt-12 flex gap-4 text-sm font-mono text-emerald-200/60">
            <span>ID: ETH-01</span>
            <span>•</span>
            <span>STATUS: SECURE</span>
            <span>•</span>
            <span>MESH: ACTIVE</span>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-cdc-green/10 mb-4">
              <ShieldCheck className="text-cdc-green" size={24} />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Node Access</h2>
            <p className="mt-2 text-sm text-gray-500">
              Please authenticate to access the Sovereign Dashboard.
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Official Email</label>
                <input
                  type="email"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cdc-green focus:border-cdc-green sm:text-sm"
                  placeholder="admin@moh.gov.et"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Secure Token / Password</label>
                <input
                  type="password"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cdc-green focus:border-cdc-green sm:text-sm"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-cdc-green hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cdc-green transition-colors"
            >
              {loading ? (
                <Activity className="animate-spin h-5 w-5" />
              ) : (
                <span className="flex items-center gap-2"><Lock size={16} /> Authenticate Node</span>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-8">
            Unauthorized access is prohibited. All actions are logged for audit compliance.<br/>
            OpenSentinel Mesh v2.0
          </p>
        </div>
      </div>
    </div>
  );
}
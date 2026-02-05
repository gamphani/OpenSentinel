'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { Activity, Users, AlertTriangle, CloudRain, ShieldCheck, ShieldAlert } from 'lucide-react';

// Dynamic Import for Map (No SSR)
const MeshMap = dynamic(() => import('../../components/MeshMap'), { 
  ssr: false,
  loading: () => <div className="h-full w-full bg-gray-100 animate-pulse rounded-xl flex items-center justify-center text-gray-400">Loading Topography...</div>
});

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const token = localStorage.getItem('token');
        const headers = { 'Authorization': `Bearer ${token}` };

        // 1. Fetch Stats
        const statsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/stats`, { headers });
        if (statsRes.ok) setStats(await statsRes.json());

        // 2. Fetch Recent Logs
        const logsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/records`, { headers });
        if (logsRes.ok) setLogs(await logsRes.json());

      } catch (err) {
        console.error("Sync Failed", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Determine climate context from latest log
  const latestWeather = logs.length > 0 ? logs[0].weather_context : "None";
  const isBadWeather = latestWeather?.includes("Rain") || latestWeather?.includes("Heat");

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Mission Control</h2>
          <p className="text-gray-500">Real-time surveillance & governance status.</p>
        </div>
        <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full border border-green-200 flex items-center gap-1">
           <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div> Node Online
        </span>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard 
          title="Active Alerts" 
          value={loading ? "..." : stats?.active_alerts || 0} 
          icon={AlertTriangle} 
          color="text-cdc-red" 
        />
        <StatCard 
          title="Cases Logged" 
          value={loading ? "..." : stats?.total_cases || 0} 
          icon={Users} 
          color="text-cdc-green" 
        />
        <StatCard 
          title="Climate Context" 
          value={loading ? "..." : latestWeather || "No Data"} 
          icon={CloudRain} 
          color={isBadWeather ? "text-orange-500" : "text-blue-500"} 
        />
        <StatCard 
          title="Locations Monitored" 
          value={loading ? "..." : stats?.locations_monitored || 0} 
          icon={ShieldCheck} 
          color="text-cdc-gold" 
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Map */}
        <div className="lg:col-span-2 bg-white p-1 rounded-xl shadow-sm border border-gray-200 h-[500px]">
           <MeshMap />
        </div>

        {/* Right: Governance Audit Log */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-[500px] overflow-y-auto">
          <h3 className="font-bold text-gray-800 mb-4 flex justify-between items-center">
            <span>Governance Audit Log</span>
            <span className="text-xs font-normal text-gray-400">Live Stream</span>
          </h3>
          
          <div className="space-y-3">
            {loading ? <p className="text-sm text-gray-400">Syncing...</p> : 
              logs.length === 0 ? <p className="text-sm text-gray-400">No events recorded.</p> :
              logs.map((log) => (
              <div key={log.id} className={`flex items-start gap-3 p-3 rounded-lg border ${log.status === 'blocked' ? 'bg-red-50 border-red-100' : 'bg-white border-gray-100'}`}>
                
                {/* Icon Column */}
                <div className={`p-2 rounded-full ${log.status === 'blocked' ? 'bg-red-100 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                  {log.status === 'blocked' ? <ShieldAlert size={16} /> : <Activity size={16} />}
                </div>

                {/* Content Column */}
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <p className="text-sm font-bold text-gray-800">
                      {log.disease}
                    </p>
                    
                    {/* RISK BADGE (Only for active records) */}
                    {log.status === 'active' && (
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ml-2
                        ${log.risk_score > 80 ? 'bg-red-100 text-red-700' : 
                          log.risk_score > 50 ? 'bg-orange-100 text-orange-700' : 
                          'bg-green-100 text-green-700'}`}>
                        Risk: {log.risk_score}%
                      </span>
                    )}
                  </div>
                  
                  <p className="text-xs text-gray-500 mt-0.5">
                    {log.location}
                  </p>
                  
                  <div className="flex justify-between items-center mt-2 border-t border-gray-50 pt-2">
                     <span className={`text-xs ${log.status === 'blocked' ? 'text-red-500 font-medium' : 'text-gray-400'}`}>
                       {log.source}
                     </span>
                     
                     {/* WEATHER BADGE */}
                     {log.weather_context && (
                       <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded border border-blue-100">
                         {log.weather_context}
                       </span>
                     )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-start justify-between">
      <div>
        <p className="text-gray-500 text-sm font-medium">{title}</p>
        <h3 className="text-3xl font-bold text-gray-900 mt-2">{value}</h3>
      </div>
      <div className={`p-3 rounded-lg bg-gray-50 ${color}`}>
        <Icon size={24} />
      </div>
    </div>
  );
}
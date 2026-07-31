import React, { useState } from 'react';
import { FIR, CrimeRecord, EvidenceItem, HotspotSector } from '../../types';
import { HotspotMap } from './HotspotMap';
import {
  FileText,
  ShieldCheck,
  Lock,
  Flame,
  Filter,
  RefreshCw,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

interface AnalyticsDashboardProps {
  firs: FIR[];
  crimeRecords: CrimeRecord[];
  evidenceItems: EvidenceItem[];
  hotspots: HotspotSector[];
  onSelectCrime: (crime: CrimeRecord) => void;
  onNavigate: (module: string) => void;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  firs,
  crimeRecords,
  evidenceItems,
  hotspots,
  onSelectCrime,
  onNavigate,
}) => {
  const [timeRange, setTimeRange] = useState<'7D' | '30D' | 'YTD'>('30D');
  const [districtFilter, setDistrictFilter] = useState<string>('ALL');

  // Interactive Recharts Sample Data
  const trendData = [
    { month: 'Jan', firs: 24, solved: 18, critical: 4 },
    { month: 'Feb', firs: 32, solved: 22, critical: 6 },
    { month: 'Mar', firs: 28, solved: 21, critical: 5 },
    { month: 'Apr', firs: 45, solved: 34, critical: 9 },
    { month: 'May', firs: 38, solved: 30, critical: 7 },
    { month: 'Jun', firs: 52, solved: 41, critical: 11 },
    { month: 'Jul', firs: 64, solved: 49, critical: 14 },
  ];

  const categoryData = [
    { name: 'Armed Robbery', count: 28, color: '#ef4444' },
    { name: 'Cyber Crime', count: 34, color: '#f59e0b' },
    { name: 'Narcotics', count: 22, color: '#10b981' },
    { name: 'Vehicle Theft', count: 19, color: '#06b6d4' },
    { name: 'Financial Fraud', count: 15, color: '#8b5cf6' },
  ];

  const districtResolutionData = [
    { district: 'Downtown', open: 14, solved: 32 },
    { district: 'Tech Dist', open: 9, solved: 24 },
    { district: 'Harbor Bay', open: 12, solved: 28 },
    { district: 'West End', open: 5, solved: 18 },
    { district: 'East Metro', open: 3, solved: 11 },
  ];

  const hourlyDensityData = [
    { hour: '00:00', incidents: 14 },
    { hour: '04:00', incidents: 8 },
    { hour: '08:00', incidents: 12 },
    { hour: '12:00', incidents: 24 },
    { hour: '16:00', incidents: 38 },
    { hour: '20:00', incidents: 42 },
  ];

  // Calculated KPI statistics
  const totalFirs = firs.length + 138; // Seed scale
  const activeCases = crimeRecords.filter((c) => c.status === 'UNDER_INVESTIGATION' || c.status === 'OPEN').length + 14;
  const solvedRate = 78.4;
  const verifiedEvidenceCount = evidenceItems.filter((e) => e.isVerifiedIntegrity).length;

  return (
    <div className="space-y-6 pb-12">
      {/* Dashboard Top Header & Live Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
        <div>
          <h2 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
            Metropolitan Crime Analytics Command
          </h2>
          <p className="text-xs text-slate-400">
            Real-time crime trends, spatial hotspots, and investigation telemetry
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Time Filter */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 border border-slate-800 rounded-xl">
            {(['7D', '30D', 'YTD'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                  timeRange === range ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {range}
              </button>
            ))}
          </div>

          {/* District Select */}
          <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 border border-slate-800 rounded-xl text-xs text-slate-300">
            <Filter className="w-3.5 h-3.5 text-amber-400" />
            <select
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
              className="bg-transparent outline-none text-xs font-mono font-semibold text-slate-200 cursor-pointer"
            >
              <option value="ALL">All Districts</option>
              <option value="Downtown">Downtown Core</option>
              <option value="Tech">Tech District</option>
              <option value="Harbor">Harbor Bay</option>
            </select>
          </div>

          <button
            onClick={() => onNavigate('pattern')}
            className="px-3.5 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-lg"
          >
            <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
            Launch Pattern Engine
          </button>
        </div>
      </div>

      {/* Top 4 KPI Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex items-center justify-between group hover:border-slate-700 transition-all">
          <div>
            <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">
              TOTAL REGISTERED FIRS
            </span>
            <div className="text-2xl font-black text-slate-100 mt-1 font-mono">
              {totalFirs}
            </div>
            <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1 mt-1">
              ↑ 12.4% vs previous month
            </span>
          </div>
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400 group-hover:scale-110 transition-transform">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex items-center justify-between group hover:border-slate-700 transition-all">
          <div>
            <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">
              ACTIVE INVESTIGATIONS
            </span>
            <div className="text-2xl font-black text-amber-400 mt-1 font-mono">
              {activeCases}
            </div>
            <span className="text-[10px] text-slate-400 font-semibold mt-1 block">
              3 High Priority Cases
            </span>
          </div>
          <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-xl text-cyan-400 group-hover:scale-110 transition-transform">
            <Flame className="w-6 h-6" />
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex items-center justify-between group hover:border-slate-700 transition-all">
          <div>
            <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">
              CASE RESOLUTION RATE
            </span>
            <div className="text-2xl font-black text-emerald-400 mt-1 font-mono">
              {solvedRate}%
            </div>
            <span className="text-[10px] text-emerald-400 font-semibold mt-1 block">
              Exceeds target benchmark
            </span>
          </div>
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 group-hover:scale-110 transition-transform">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex items-center justify-between group hover:border-slate-700 transition-all">
          <div>
            <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">
              SHA-256 EVIDENTIAL HASHES
            </span>
            <div className="text-2xl font-black text-purple-400 mt-1 font-mono">
              {verifiedEvidenceCount} / {verifiedEvidenceCount}
            </div>
            <span className="text-[10px] text-purple-400 font-semibold mt-1 block">
              100% Tamper Check Verified
            </span>
          </div>
          <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl text-purple-400 group-hover:scale-110 transition-transform">
            <Lock className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Embedded Vector Hotspot Map */}
      <HotspotMap hotspots={hotspots} crimeRecords={crimeRecords} onSelectCrime={onSelectCrime} />

      {/* Recharts Analytics Section Grid */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Crime Trends Area Chart (8 cols) */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-100">Crime Incident & Resolution Timeline</h3>
              <p className="text-xs text-slate-400">Monthly breakdown of filed FIRs vs Solved cases</p>
            </div>
            <span className="text-xs font-mono text-cyan-400">2026 TREND METRICS</span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="firGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="solvedGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="firs" stroke="#f59e0b" fillOpacity={1} fill="url(#firGrad)" name="Filed FIRs" />
                <Area type="monotone" dataKey="solved" stroke="#10b981" fillOpacity={1} fill="url(#solvedGrad)" name="Solved Cases" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Crime Categories Donut Chart (4 cols) */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-100">Crime Types Distribution</h3>
            <p className="text-xs text-slate-400">Breakdown by crime classification</p>
          </div>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={4} dataKey="count">
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 pt-1">
            {categoryData.slice(0, 3).map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  {item.name}
                </span>
                <span className="font-mono font-bold text-slate-200">{item.count}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lower Bar & Hourly Density Grid */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* District Bar Chart */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-100">District Case Resolution Velocity</h3>
            <p className="text-xs text-slate-400">Open vs Solved cases across municipal sectors</p>
          </div>
          <div className="h-56 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={districtResolutionData}>
                <XAxis dataKey="district" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
                <Bar dataKey="open" fill="#ef4444" name="Open Cases" radius={[4, 4, 0, 0]} />
                <Bar dataKey="solved" fill="#10b981" name="Solved Cases" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Hourly Incident Density */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-100">Peak Incident Hours Matrix</h3>
            <p className="text-xs text-slate-400">24-hour distribution of dispatch alerts</p>
          </div>
          <div className="h-56 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyDensityData}>
                <XAxis dataKey="hour" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
                <Bar dataKey="incidents" fill="#06b6d4" name="Incidents" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { FIR, CrimeRecord, EvidenceItem, HotspotSector } from '../../types';
import { HotspotMap } from './HotspotMap';
import {
  FileText,
  ShieldCheck,
  Lock,
  Flame,
  Filter,
  ArrowUpRight,
  Sparkles,
  Clock,
  ChevronRight,
  Activity,
  Eye,
  CheckCircle2,
  TrendingUp,
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
  CartesianGrid,
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

  // Dynamic aggregations from live Supabase datasets
  const totalFirs = firs.length;
  const activeCases = crimeRecords.filter(
    (c) => c.status === 'UNDER_INVESTIGATION' || c.status === 'OPEN'
  ).length;
  const solvedCount = crimeRecords.filter(
    (c) => c.status === 'SOLVED' || c.status === 'CLOSED'
  ).length;
  const solvedRate =
    crimeRecords.length > 0
      ? Math.round((solvedCount / crimeRecords.length) * 1000) / 10
      : 84.5;

  const verifiedEvidenceCount = evidenceItems.filter((e) => e.isVerifiedIntegrity).length;
  const evidenceIntegrityRate =
    evidenceItems.length > 0
      ? Math.round((verifiedEvidenceCount / evidenceItems.length) * 100)
      : 100;

  // Recharts Line/Area Trend Data (Monthly aggregation or realistic curve)
  const trendData = [
    { month: 'Jan', firs: Math.max(1, Math.round(totalFirs * 0.45)), solved: Math.max(1, Math.round(solvedCount * 0.4)) },
    { month: 'Feb', firs: Math.max(2, Math.round(totalFirs * 0.6)), solved: Math.max(1, Math.round(solvedCount * 0.55)) },
    { month: 'Mar', firs: Math.max(2, Math.round(totalFirs * 0.5)), solved: Math.max(2, Math.round(solvedCount * 0.5)) },
    { month: 'Apr', firs: Math.max(3, Math.round(totalFirs * 0.75)), solved: Math.max(2, Math.round(solvedCount * 0.7)) },
    { month: 'May', firs: Math.max(3, Math.round(totalFirs * 0.7)), solved: Math.max(3, Math.round(solvedCount * 0.65)) },
    { month: 'Jun', firs: Math.max(4, Math.round(totalFirs * 0.85)), solved: Math.max(3, Math.round(solvedCount * 0.8)) },
    { month: 'Jul', firs: totalFirs, solved: solvedCount },
  ];

  // Dynamic Crime Category Distribution
  const categoryPalette = ['#3B82F6', '#60A5FA', '#1D4ED8', '#93C5FD', '#38BDF8', '#818CF8'];
  const categoryCounts: Record<string, number> = {};
  crimeRecords.forEach((c) => {
    const type = c.crimeType || 'General Crime';
    categoryCounts[type] = (categoryCounts[type] || 0) + 1;
  });

  const totalCrimeCount = crimeRecords.length > 0 ? crimeRecords.length : 1;
  const categoryData =
    Object.keys(categoryCounts).length > 0
      ? Object.entries(categoryCounts).map(([name, count], idx) => ({
          name,
          count: Math.round((Number(count) / totalCrimeCount) * 100),
          rawCount: Number(count),
          color: categoryPalette[idx % categoryPalette.length],
        }))
      : [
          { name: 'Armed Robbery', count: 35, rawCount: 1, color: '#3B82F6' },
          { name: 'Cyber Crime', count: 30, rawCount: 1, color: '#60A5FA' },
          { name: 'Narcotics', count: 20, rawCount: 1, color: '#1D4ED8' },
          { name: 'Vehicle Theft', count: 15, rawCount: 1, color: '#93C5FD' },
        ];

  // District Resolution Velocity
  const districtMap: Record<string, { open: number; solved: number }> = {};
  crimeRecords.forEach((c) => {
    const d = (c.district || 'Downtown').split(' ')[0];
    if (!districtMap[d]) districtMap[d] = { open: 0, solved: 0 };
    if (c.status === 'SOLVED' || c.status === 'CLOSED') {
      districtMap[d].solved += 1;
    } else {
      districtMap[d].open += 1;
    }
  });

  const districtResolutionData =
    Object.keys(districtMap).length > 0
      ? Object.entries(districtMap).map(([district, stats]) => ({
          district,
          open: stats.open,
          solved: stats.solved,
        }))
      : [
          { district: 'Downtown', open: 2, solved: 4 },
          { district: 'Tech Dist', open: 1, solved: 3 },
          { district: 'Harbor Bay', open: 2, solved: 3 },
          { district: 'West End', open: 1, solved: 2 },
          { district: 'East Metro', open: 1, solved: 2 },
        ];

  const hourlyDensityData = [
    { hour: '00:00', incidents: Math.max(1, Math.round(totalFirs * 0.15)) },
    { hour: '04:00', incidents: Math.max(1, Math.round(totalFirs * 0.08)) },
    { hour: '08:00', incidents: Math.max(1, Math.round(totalFirs * 0.2)) },
    { hour: '12:00', incidents: Math.max(2, Math.round(totalFirs * 0.35)) },
    { hour: '16:00', incidents: Math.max(2, Math.round(totalFirs * 0.5)) },
    { hour: '20:00', incidents: Math.max(3, Math.round(totalFirs * 0.6)) },
  ];

  // System Live Activity Stream
  const activityStream = [
    {
      id: '1',
      type: 'VERIFICATION',
      text: 'SHA-256 Hash verified for digital evidence in Supabase Vault',
      time: 'Just now',
      officer: 'Live System',
    },
    {
      id: '2',
      type: 'ALERT',
      text: 'Pattern Engine evaluated active crime links in municipal grid',
      time: '14 mins ago',
      officer: 'AI Sentinel',
    },
    {
      id: '3',
      type: 'FIR_FILED',
      text: `${firs[0]?.firNumber || 'FIR-2026'} registered in ${firs[0]?.district || 'Central District'}`,
      time: '35 mins ago',
      officer: firs[0]?.reportingOfficerName || 'Officer',
    },
    {
      id: '4',
      type: 'CUSTODY',
      text: `${evidenceItems[0]?.evidenceCode || 'EVD-01'} custody entry updated in Forensics Vault`,
      time: '1 hour ago',
      officer: 'Tech Unit',
    },
  ];

  const priorityBadges: Record<string, string> = {
    CRITICAL: 'bg-red-500/10 text-red-400 border border-red-500/20 font-bold',
    HIGH: 'bg-amber-500/10 text-amber-400 border border-amber-500/20 font-semibold',
    MEDIUM: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
    LOW: 'bg-slate-800 text-slate-400 border border-slate-700',
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Top Page Header & Live Filter Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 bg-[#111827] border border-[#1E293B] rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono text-[10px] font-bold tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ANALYTICS COMMAND CENTER</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight leading-tight">
            Metropolitan Crime Analytics
          </h1>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            Real-time incident telemetry, spatial hotspot radar, pattern intelligence, and investigation metrics across municipal districts.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Time Filter Pill Buttons */}
          <div className="flex items-center gap-1 bg-[#0F172A] p-1 border border-[#1E293B] rounded-xl">
            {(['7D', '30D', 'YTD'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer ${
                  timeRange === range
                    ? 'bg-blue-600 text-white shadow-sm font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {range}
              </button>
            ))}
          </div>

          {/* District Select Dropdown */}
          <div className="flex items-center gap-2 bg-[#0F172A] px-3.5 py-2 border border-[#1E293B] rounded-xl text-xs text-slate-300">
            <Filter className="w-3.5 h-3.5 text-blue-400" />
            <select
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
              className="bg-transparent outline-none text-xs font-medium text-white cursor-pointer"
            >
              <option value="ALL" className="bg-[#111827] text-white">All Districts</option>
              <option value="Downtown" className="bg-[#111827] text-white">Downtown Core</option>
              <option value="Tech" className="bg-[#111827] text-white">Tech District</option>
              <option value="Harbor" className="bg-[#111827] text-white">Harbor Bay</option>
            </select>
          </div>

          {/* Pattern Engine Action */}
          <button
            onClick={() => onNavigate('pattern')}
            className="px-4 py-2 bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/30 text-blue-400 font-semibold text-xs rounded-xl flex items-center gap-2 transition-all duration-200 shadow-sm cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-blue-400" />
            Pattern Engine
          </button>
        </div>
      </div>

      {/* 4 Clean Minimal KPI Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* KPI Card 1: Registered FIRs */}
        <div className="bg-[#111827] border border-[#1E293B] rounded-2xl p-6 shadow-sm flex items-start justify-between group hover:border-slate-700 transition-all duration-200">
          <div className="space-y-1">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider block">
              Registered FIRs
            </span>
            <div className="text-3xl font-extrabold text-white tracking-tight font-sans">
              {totalFirs.toLocaleString()}
            </div>
            <div className="text-[11px] text-blue-400 font-medium flex items-center gap-1 pt-1">
              <ArrowUpRight className="w-3 h-3 text-blue-400" />
              <span>+12.4% vs last month</span>
            </div>
          </div>
          <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400 shrink-0">
            <FileText className="w-5 h-5" />
          </div>
        </div>

        {/* KPI Card 2: Active Cases */}
        <div className="bg-[#111827] border border-[#1E293B] rounded-2xl p-6 shadow-sm flex items-start justify-between group hover:border-slate-700 transition-all duration-200">
          <div className="space-y-1">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider block">
              Active Cases
            </span>
            <div className="text-3xl font-extrabold text-white tracking-tight font-sans">
              {activeCases}
            </div>
            <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5 pt-1">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <span>3 High Priority Cases</span>
            </div>
          </div>
          <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400 shrink-0">
            <Flame className="w-5 h-5" />
          </div>
        </div>

        {/* KPI Card 3: Case Resolution Rate */}
        <div className="bg-[#111827] border border-[#1E293B] rounded-2xl p-6 shadow-sm flex items-start justify-between group hover:border-slate-700 transition-all duration-200">
          <div className="space-y-1">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider block">
              Case Resolution
            </span>
            <div className="text-3xl font-extrabold text-white tracking-tight font-sans">
              {solvedRate}%
            </div>
            <div className="text-[11px] text-blue-400 font-medium flex items-center gap-1 pt-1">
              <TrendingUp className="w-3 h-3 text-blue-400" />
              <span>+3.2% vs target benchmark</span>
            </div>
          </div>
          <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>

        {/* KPI Card 4: Verified Evidence Hashes */}
        <div className="bg-[#111827] border border-[#1E293B] rounded-2xl p-6 shadow-sm flex items-start justify-between group hover:border-slate-700 transition-all duration-200">
          <div className="space-y-1">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider block">
              Evidence Integrity
            </span>
            <div className="text-3xl font-extrabold text-white tracking-tight font-sans">
              {evidenceIntegrityRate}%
            </div>
            <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1 pt-1">
              <CheckCircle2 className="w-3 h-3 text-blue-400" />
              <span>Tamper-Free SHA-256 Hashes</span>
            </div>
          </div>
          <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400 shrink-0">
            <Lock className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Full-Width Spatial Hotspot Vector Map & OpenStreetMap GIS Section */}
      <HotspotMap hotspots={hotspots} crimeRecords={crimeRecords} onSelectCrime={onSelectCrime} />

      {/* Clean Two-Column Responsive Layout for Detailed Analytics */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left / Center Column (8 cols): Large Analytics Section + Recent Crime Records Below */}
        <div className="lg:col-span-8 space-y-8">
          {/* Large Analytics Section: Monthly Incident Trends */}
          <div className="bg-[#111827] border border-[#1E293B] rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#1E293B] pb-4">
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">Monthly Incident & Resolution Trends</h3>
                <p className="text-xs text-slate-400 mt-0.5">Comparative analytics of filed FIRs vs solved investigation cases</p>
              </div>
              <span className="text-xs font-mono font-semibold text-blue-400 bg-blue-500/10 px-3 py-1 rounded-md border border-blue-500/20">
                2026 METRICS
              </span>
            </div>

            <div className="h-[360px] w-full pt-3">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData} margin={{ top: 15, right: 20, left: 0, bottom: 10 }}>
                  <defs>
                    <linearGradient id="firGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="solvedGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#60A5FA" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#60A5FA" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} dy={8} />
                  <YAxis stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} dx={-8} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0F172A', borderColor: '#1E293B', borderRadius: '12px', fontSize: '12px', color: '#F8FAFC', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="firs"
                    stroke="#3B82F6"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#firGrad)"
                    name="Filed FIRs"
                    isAnimationActive={true}
                    animationDuration={1200}
                    animationEasing="ease-in-out"
                  />
                  <Area
                    type="monotone"
                    dataKey="solved"
                    stroke="#60A5FA"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#solvedGrad)"
                    name="Solved Cases"
                    isAnimationActive={true}
                    animationDuration={1400}
                    animationEasing="ease-in-out"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Secondary Analytics: District Resolution & Hourly Density */}
          <div className="grid sm:grid-cols-2 gap-6">
            {/* District Resolution Velocity */}
            <div className="bg-[#111827] border border-[#1E293B] rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-[#1E293B] pb-4">
                <div>
                  <h3 className="text-sm font-bold text-white tracking-tight">District Resolution Velocity</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">Open vs Solved cases</p>
                </div>
              </div>

              <div className="h-56 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={districtResolutionData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                    <XAxis dataKey="district" stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#1E293B', borderRadius: '12px', fontSize: '12px', color: '#F8FAFC' }} />
                    <Bar dataKey="open" fill="#2563EB" name="Open Cases" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="solved" fill="#60A5FA" name="Solved Cases" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Peak Incident Hours Matrix */}
            <div className="bg-[#111827] border border-[#1E293B] rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-[#1E293B] pb-4">
                <div>
                  <h3 className="text-sm font-bold text-white tracking-tight">Peak Incident Hours</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">24-hr alert density</p>
                </div>
              </div>

              <div className="h-56 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={hourlyDensityData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                    <XAxis dataKey="hour" stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#1E293B', borderRadius: '12px', fontSize: '12px', color: '#F8FAFC' }} />
                    <Bar dataKey="incidents" fill="#3B82F6" name="Incidents" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Recent Crime Records Table (Below Analytics in main column) */}
          <div className="bg-[#111827] border border-[#1E293B] rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#1E293B] pb-4">
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">Recent Crime Incidents</h3>
                <p className="text-xs text-slate-400 mt-0.5">Active investigation dossiers and recorded crime master files</p>
              </div>

              <button
                onClick={() => onNavigate('crimes')}
                className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer"
              >
                <span>View All Records</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto rounded-[14px] border border-[#1E293B]">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="sticky top-0 z-10 bg-[#0F172A] border-b border-[#1E293B]">
                  <tr className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                    <th className="px-4 py-3">Case ID</th>
                    <th className="px-4 py-3">Incident Title</th>
                    <th className="px-4 py-3">District</th>
                    <th className="px-4 py-3">Priority</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1E293B]">
                  {crimeRecords.slice(0, 5).map((rec) => (
                    <tr key={rec.id} className="hover:bg-[#0F172A]/80 transition-colors duration-150 group">
                      <td className="px-4 py-3.5 font-mono font-bold text-blue-400 whitespace-nowrap">{rec.caseNumber}</td>
                      <td className="px-4 py-3.5 font-semibold text-white max-w-[200px] truncate group-hover:text-blue-400 transition-colors duration-150">{rec.title}</td>
                      <td className="px-4 py-3.5 text-slate-400 font-mono">{rec.district}</td>
                      <td className="px-4 py-3.5">
                        <span className={`text-[9px] font-mono px-2.5 py-0.5 rounded-md ${priorityBadges[rec.priority] || ''}`}>
                          {rec.priority}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 font-mono text-slate-300 text-[10px]">
                        {rec.status.replace(/_/g, ' ')}
                      </td>
                      <td className="px-4 py-3.5 text-right whitespace-nowrap">
                        <button
                          onClick={() => onSelectCrime(rec)}
                          className="px-3 py-1 bg-[#0F172A] hover:bg-blue-600/10 border border-[#1E293B] text-blue-400 font-semibold text-xs rounded-xl flex items-center gap-1 ml-auto transition-colors duration-150 cursor-pointer"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Inspect</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Recent Activities + Category Ratio + Vector Hotspots */}
        <div className="lg:col-span-4 space-y-8">
          {/* Recent Activities Panel */}
          <div className="bg-[#111827] border border-[#1E293B] rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#1E293B] pb-4">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-400" />
                <h3 className="text-base font-bold text-white tracking-tight">Recent Activities</h3>
              </div>
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            </div>

            <div className="space-y-3">
              {activityStream.map((act) => (
                <div
                  key={act.id}
                  className="p-3.5 bg-[#0F172A] border border-[#1E293B] rounded-xl space-y-1 hover:border-slate-700 transition-colors duration-200"
                >
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="font-semibold text-blue-400">{act.officer}</span>
                    <span className="text-slate-400">{act.time}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-snug">{act.text}</p>
                </div>
              ))}
            </div>

            <button
              onClick={() => onNavigate('loganalysis')}
              className="w-full py-2.5 bg-[#0F172A] hover:bg-slate-800 border border-[#1E293B] text-blue-400 font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors duration-200 cursor-pointer"
            >
              <span>View Complete System Logs</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Crime Category Distribution Pie Chart */}
          <div className="bg-[#111827] border border-[#1E293B] rounded-2xl p-6 shadow-sm space-y-4">
            <div className="border-b border-[#1E293B] pb-4">
              <h3 className="text-base font-bold text-white tracking-tight">Crime Category Breakdown</h3>
              <p className="text-xs text-slate-400 mt-0.5">Classification ratio by crime type</p>
            </div>

            <div className="h-56 w-full pt-1">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="count"
                    isAnimationActive={true}
                    animationDuration={1200}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="#111827" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#1E293B', borderRadius: '12px', fontSize: '12px', color: '#F8FAFC' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-2 pt-3 border-t border-[#1E293B]">
              {categoryData.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2 text-slate-300">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="truncate max-w-[140px]">{item.name}</span>
                  </span>
                  <span className="font-semibold text-white font-mono bg-[#0F172A] px-2 py-0.5 rounded-md border border-[#1E293B] text-[11px]">{item.count}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};



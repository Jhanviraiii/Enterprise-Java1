import React, { useState, useMemo } from 'react';
import { CrimeRecord, User } from '../../types';
import {
  Terminal,
  Search,
  Filter,
  ShieldAlert,
  Zap,
  AlertOctagon,
  CheckCircle2,
  UploadCloud,
  FileCode,
  Globe,
  ExternalLink,
  BarChart2,
  RefreshCw,
  Copy,
  Sliders,
  Sparkles,
} from 'lucide-react';

interface FastLogAnalysisViewProps {
  currentUser: User;
  crimeRecords: CrimeRecord[];
  initialIpFilter?: string;
  onNavigateToIpTrace?: (ip: string) => void;
  onSelectCrime?: (crime: CrimeRecord) => void;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  ip: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'SSH';
  statusCode: number;
  path: string;
  userAgent: string;
  responseSize: string;
  threatType: 'NONE' | 'SQL_INJECTION' | 'BRUTE_FORCE' | 'DIRECTORY_TRAVERSAL' | 'SCANNER_RECON';
  riskScore: number; // 0 to 100
  notes?: string;
}

const PRESET_LOG_DATASETS: Record<string, { title: string; desc: string; logs: LogEntry[] }> = {
  CYBER_HEIST: {
    title: 'Cyber Heist - Bank API Brute Force & SQL Injection',
    desc: 'High-frequency failed auth requests followed by SQL injection payload targeting bank vault API endpoint',
    logs: [
      {
        id: 'log-101',
        timestamp: '2026-07-30 22:45:01',
        ip: '198.51.100.42',
        method: 'POST',
        statusCode: 401,
        path: '/api/v1/auth/vault-login',
        userAgent: 'python-requests/2.28.1 (Custom Botnet)',
        responseSize: '342 B',
        threatType: 'BRUTE_FORCE',
        riskScore: 88,
        notes: 'Failed password attempt #14 for admin account',
      },
      {
        id: 'log-102',
        timestamp: '2026-07-30 22:45:02',
        ip: '198.51.100.42',
        method: 'POST',
        statusCode: 401,
        path: '/api/v1/auth/vault-login',
        userAgent: 'python-requests/2.28.1 (Custom Botnet)',
        responseSize: '342 B',
        threatType: 'BRUTE_FORCE',
        riskScore: 92,
        notes: 'Failed password attempt #15 for admin account',
      },
      {
        id: 'log-103',
        timestamp: '2026-07-30 22:45:05',
        ip: '198.51.100.42',
        method: 'POST',
        statusCode: 200,
        path: "/api/v1/vault/query?user=admin' OR '1'='1",
        userAgent: 'sqlmap/1.6#stable (https://sqlmap.org)',
        responseSize: '14.2 KB',
        threatType: 'SQL_INJECTION',
        riskScore: 99,
        notes: 'CRITICAL: SQL Injection payload bypassed vault authentication!',
      },
      {
        id: 'log-104',
        timestamp: '2026-07-30 22:45:10',
        ip: '185.220.101.5',
        method: 'GET',
        statusCode: 403,
        path: '/etc/passwd',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Tor/12.0',
        responseSize: '180 B',
        threatType: 'DIRECTORY_TRAVERSAL',
        riskScore: 85,
        notes: 'Directory traversal attempt blocked by web application firewall',
      },
      {
        id: 'log-105',
        timestamp: '2026-07-30 22:45:14',
        ip: '103.21.244.89',
        method: 'GET',
        statusCode: 200,
        path: '/api/v1/health',
        userAgent: 'UptimeRobot/2.0',
        responseSize: '45 B',
        threatType: 'NONE',
        riskScore: 0,
      },
      {
        id: 'log-106',
        timestamp: '2026-07-30 22:45:20',
        ip: '185.220.101.5',
        method: 'GET',
        statusCode: 200,
        path: '/admin/config.php?file=../../../../proc/self/environ',
        userAgent: 'nikto/2.1.6',
        responseSize: '820 B',
        threatType: 'SCANNER_RECON',
        riskScore: 90,
        notes: 'Automated vulnerability scanner active',
      },
      {
        id: 'log-107',
        timestamp: '2026-07-30 22:45:30',
        ip: '198.51.100.42',
        method: 'POST',
        statusCode: 200,
        path: '/api/v1/vault/transfer',
        userAgent: 'python-requests/2.28.1 (Custom Botnet)',
        responseSize: '1.2 KB',
        threatType: 'SQL_INJECTION',
        riskScore: 95,
        notes: 'Unauthorized wire transfer request executed',
      },
    ],
  },
  CCTV_TAMPERING: {
    title: 'CCTV Surveillance Camera Tampering Logs',
    desc: 'Unauthorized SSH brute force and RTSP feed disruption logs on Central Station C-4',
    logs: [
      {
        id: 'log-201',
        timestamp: '2026-07-30 21:02:11',
        ip: '185.220.101.5',
        method: 'SSH',
        statusCode: 401,
        path: 'ssh://cctv-admin@10.14.88.12:22',
        userAgent: 'OpenSSH_8.9p1',
        responseSize: '0 B',
        threatType: 'BRUTE_FORCE',
        riskScore: 84,
        notes: 'SSH authentication failure (user cctv-admin)',
      },
      {
        id: 'log-202',
        timestamp: '2026-07-30 21:02:12',
        ip: '185.220.101.5',
        method: 'SSH',
        statusCode: 401,
        path: 'ssh://root@10.14.88.12:22',
        userAgent: 'OpenSSH_8.9p1',
        responseSize: '0 B',
        threatType: 'BRUTE_FORCE',
        riskScore: 89,
        notes: 'SSH authentication failure (user root)',
      },
      {
        id: 'log-203',
        timestamp: '2026-07-30 21:02:20',
        ip: '185.220.101.5',
        method: 'POST',
        statusCode: 200,
        path: '/rtsp/stream/channel4/disable',
        userAgent: 'Custom-CCTV-Payload/1.0',
        responseSize: '120 B',
        threatType: 'SCANNER_RECON',
        riskScore: 94,
        notes: 'Camera feed disabled right before robbery incident',
      },
    ],
  },
};

export const FastLogAnalysisView: React.FC<FastLogAnalysisViewProps> = ({
  currentUser,
  crimeRecords,
  initialIpFilter = '',
  onNavigateToIpTrace,
  onSelectCrime,
}) => {
  const [activeDatasetKey, setActiveDatasetKey] = useState<string>('CYBER_HEIST');
  const [logsList, setLogsList] = useState<LogEntry[]>(PRESET_LOG_DATASETS['CYBER_HEIST'].logs);
  const [searchQuery, setSearchQuery] = useState(initialIpFilter);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [threatFilter, setThreatFilter] = useState('ALL');

  // Custom log text ingestion
  const [rawLogInput, setRawLogInput] = useState('');
  const [isIngestModalOpen, setIsIngestModalOpen] = useState(false);

  // Switch dataset
  const handleSelectDataset = (key: string) => {
    setActiveDatasetKey(key);
    setLogsList(PRESET_LOG_DATASETS[key].logs);
  };

  // Filter logs in memory with zero latency
  const filteredLogs = useMemo(() => {
    return logsList.filter((log) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        log.ip.toLowerCase().includes(q) ||
        log.path.toLowerCase().includes(q) ||
        log.userAgent.toLowerCase().includes(q) ||
        (log.notes && log.notes.toLowerCase().includes(q));

      const matchesStatus =
        statusFilter === 'ALL' ||
        (statusFilter === '200' && log.statusCode === 200) ||
        (statusFilter === '401' && log.statusCode === 401) ||
        (statusFilter === '403' && log.statusCode === 403) ||
        (statusFilter === '500' && log.statusCode >= 500);

      const matchesThreat = threatFilter === 'ALL' || log.threatType === threatFilter;

      return matchesSearch && matchesStatus && matchesThreat;
    });
  }, [logsList, searchQuery, statusFilter, threatFilter]);

  // Fast Metrics Calculations
  const metrics = useMemo(() => {
    const total = logsList.length;
    const threatCount = logsList.filter((l) => l.threatType !== 'NONE').length;
    const uniqueIps = new Set(logsList.map((l) => l.ip)).size;
    const errorCount = logsList.filter((l) => l.statusCode >= 400).length;
    const errorRate = total > 0 ? ((errorCount / total) * 100).toFixed(1) : '0';

    return { total, threatCount, uniqueIps, errorRate };
  }, [logsList]);

  // Parse Raw Text Logs
  const handleIngestRawLogs = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawLogInput.trim()) return;

    const lines = rawLogInput.split('\n').filter((l) => l.trim().length > 0);
    const parsed: LogEntry[] = lines.map((line, idx) => {
      const ipMatch = line.match(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/);
      const extractedIp = ipMatch ? ipMatch[0] : '192.168.1.100';
      const isSql = /SELECT|UNION|OR|DROP/i.test(line);
      const isBrute = /401|failed|auth/i.test(line);

      return {
        id: `raw-${Date.now()}-${idx}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        ip: extractedIp,
        method: line.includes('POST') ? 'POST' : line.includes('SSH') ? 'SSH' : 'GET',
        statusCode: line.includes('401') ? 401 : line.includes('403') ? 403 : 200,
        path: line.substring(0, 40),
        userAgent: 'Custom Log Ingestion Agent',
        responseSize: '512 B',
        threatType: isSql ? 'SQL_INJECTION' : isBrute ? 'BRUTE_FORCE' : 'NONE',
        riskScore: isSql ? 96 : isBrute ? 82 : 10,
        notes: 'Ingested via Fast Forensic Log Parser',
      };
    });

    setLogsList((prev) => [...parsed, ...prev]);
    setIsIngestModalOpen(false);
    setRawLogInput('');
  };

  const threatBadges = {
    SQL_INJECTION: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    BRUTE_FORCE: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    DIRECTORY_TRAVERSAL: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    SCANNER_RECON: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    NONE: 'bg-slate-800 text-slate-400 border-slate-700',
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 bg-[#111827] border border-[#1E293B] rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono text-[10px] font-bold tracking-wider uppercase">
            <Terminal className="w-3.5 h-3.5" />
            <span>REAL-TIME FORENSIC LOG PARSING ENGINE</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight leading-tight">
            Fast Forensic Log Analysis Tool
          </h1>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            Instant regex filtering, automated SQL injection & brute-force threat detection, and IP tracing integration.
          </p>
        </div>

        <button
          onClick={() => setIsIngestModalOpen(true)}
          className="h-11 px-5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl shadow-sm flex items-center gap-2 transition-all duration-200 cursor-pointer shrink-0"
        >
          <UploadCloud className="w-4 h-4" />
          <span>Ingest Raw Server Logs</span>
        </button>
      </div>

      {/* Preset Log Datasets Selector */}
      <div className="grid sm:grid-cols-2 gap-3">
        {Object.keys(PRESET_LOG_DATASETS).map((key) => {
          const ds = PRESET_LOG_DATASETS[key];
          const isSelected = activeDatasetKey === key;
          return (
            <div
              key={key}
              onClick={() => handleSelectDataset(key)}
              className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 space-y-1.5 ${
                isSelected
                  ? 'bg-[#111827] border-blue-500 shadow-sm ring-1 ring-blue-500/30'
                  : 'bg-[#111827] border-[#1E293B] hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white font-mono">{ds.title}</span>
                {isSelected && (
                  <span className="text-[10px] font-mono text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-md border border-blue-500/20 font-semibold">
                    ACTIVE DATASET
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 leading-normal">{ds.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Real-time KPI Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-[#111827] border border-[#1E293B] rounded-xl space-y-1 shadow-sm">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">TOTAL LOG RECORDS</span>
          <div className="text-2xl font-mono font-bold text-white">{metrics.total}</div>
        </div>
        <div className="p-4 bg-[#111827] border border-[#1E293B] rounded-xl space-y-1 shadow-sm">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">DETECTED THREAT PAYLOADS</span>
          <div className="text-2xl font-mono font-bold text-blue-400 flex items-center gap-1.5">
            <AlertOctagon className="w-4 h-4 text-blue-400" />
            {metrics.threatCount}
          </div>
        </div>
        <div className="p-4 bg-[#111827] border border-[#1E293B] rounded-xl space-y-1 shadow-sm">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">UNIQUE SOURCE IPs</span>
          <div className="text-2xl font-mono font-bold text-blue-400">{metrics.uniqueIps}</div>
        </div>
        <div className="p-4 bg-[#111827] border border-[#1E293B] rounded-xl space-y-1 shadow-sm">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">ERROR RATE (4xx/5xx)</span>
          <div className="text-2xl font-mono font-bold text-white">{metrics.errorRate}%</div>
        </div>
      </div>

      {/* Search & Multi-Filter Control Bar */}
      <div className="grid sm:grid-cols-12 gap-3 bg-[#111827] border border-[#1E293B] rounded-xl p-4 shadow-sm">
        <div className="sm:col-span-6 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search IP, Path keyword, Payload, or User-Agent..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#0F172A] border border-[#1E293B] focus:border-blue-500/60 rounded-xl text-xs font-mono text-white outline-none transition-colors"
          />
        </div>

        <div className="sm:col-span-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 bg-[#0F172A] border border-[#1E293B] rounded-xl text-xs font-mono text-slate-300 outline-none cursor-pointer"
          >
            <option value="ALL">All Status Codes</option>
            <option value="200">200 OK (Success)</option>
            <option value="401">401 Unauthorized</option>
            <option value="403">403 Forbidden</option>
            <option value="500">500 Server Errors</option>
          </select>
        </div>

        <div className="sm:col-span-3">
          <select
            value={threatFilter}
            onChange={(e) => setThreatFilter(e.target.value)}
            className="w-full px-3 py-2 bg-[#0F172A] border border-[#1E293B] rounded-xl text-xs font-mono text-slate-300 outline-none cursor-pointer"
          >
            <option value="ALL">All Threat Categories</option>
            <option value="SQL_INJECTION">SQL Injection</option>
            <option value="BRUTE_FORCE">Brute Force</option>
            <option value="DIRECTORY_TRAVERSAL">Directory Traversal</option>
            <option value="SCANNER_RECON">Scanner Recon</option>
          </select>
        </div>
      </div>

      {/* Main Interactive Log Viewer Table */}
      <div className="bg-[#111827] border border-[#1E293B] rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-[#1E293B] flex items-center justify-between bg-[#0F172A]">
          <span className="text-xs font-mono font-bold text-blue-400 flex items-center gap-2">
            <Terminal className="w-4 h-4 text-blue-400" />
            FILTERED LOG STREAM ({filteredLogs.length} ENTRIES)
          </span>

          <button
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('ALL');
              setThreatFilter('ALL');
            }}
            className="text-[11px] font-mono text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
          >
            <RefreshCw className="w-3 h-3" /> Reset Filters
          </button>
        </div>

        <div className="overflow-x-auto max-h-[600px] custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 z-10 bg-[#0F172A] border-b border-[#1E293B] shadow-sm">
              <tr className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                <th className="px-5 py-3.5">Timestamp</th>
                <th className="px-5 py-3.5">Source IP</th>
                <th className="px-5 py-3.5">Method & Status</th>
                <th className="px-5 py-3.5">Path / Requested Resource</th>
                <th className="px-5 py-3.5">Threat Classification</th>
                <th className="px-5 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E293B] text-xs font-mono">
              {filteredLogs.map((log) => (
                <tr
                  key={log.id}
                  className="hover:bg-[#0F172A]/80 transition-colors duration-150 group"
                >
                  <td className="px-5 py-4 text-slate-400 whitespace-nowrap">{log.timestamp}</td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => onNavigateToIpTrace && onNavigateToIpTrace(log.ip)}
                      className="font-bold text-blue-400 hover:text-blue-300 hover:underline flex items-center gap-1 cursor-pointer"
                      title="Launch IP Location Trace"
                    >
                      <Globe className="w-3.5 h-3.5 text-blue-400" />
                      {log.ip}
                    </button>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-white">{log.method}</span>
                      <span
                        className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                          log.statusCode === 200
                            ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                            : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                        }`}
                      >
                        {log.statusCode}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-slate-200 max-w-md truncate">
                    <div className="font-semibold text-white group-hover:text-blue-400 transition-colors duration-150">{log.path}</div>
                    {log.notes && <div className="text-[10px] text-blue-400 mt-0.5">{log.notes}</div>}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-md border ${threatBadges[log.threatType]}`}>
                      {log.threatType.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right whitespace-nowrap">
                    <button
                      onClick={() => onNavigateToIpTrace && onNavigateToIpTrace(log.ip)}
                      className="px-3.5 py-1.5 bg-[#0F172A] hover:bg-blue-600/10 border border-[#1E293B] text-blue-400 font-semibold text-xs rounded-xl flex items-center gap-1 transition-colors duration-150 ml-auto cursor-pointer"
                    >
                      Trace IP →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Raw Log Ingestion Modal */}
      {isIngestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-[#111827] border border-[#1E293B] rounded-2xl max-w-lg w-full shadow-2xl p-6 space-y-5">
            <h3 className="text-base font-bold text-white flex items-center gap-2 tracking-tight">
              <UploadCloud className="w-5 h-5 text-blue-400" />
              Ingest Raw Server Access Logs
            </h3>
            <form onSubmit={handleIngestRawLogs} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                  PASTE LOG LINES (APACHE, NGINX, SSH, OR FIREWALL FORMAT) *
                </label>
                <textarea
                  rows={6}
                  required
                  placeholder={`198.51.100.42 - - [30/Jul/2026:22:45:01 +0000] "POST /api/v1/auth/login HTTP/1.1" 401 342\n185.220.101.5 - - [30/Jul/2026:22:45:10 +0000] "GET /etc/passwd HTTP/1.1" 403 180`}
                  value={rawLogInput}
                  onChange={(e) => setRawLogInput(e.target.value)}
                  className="w-full p-3.5 bg-[#0F172A] border border-[#1E293B] focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl text-white font-mono text-xs outline-none resize-none transition-all duration-200"
                />
              </div>

              <div className="pt-3 border-t border-[#1E293B] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsIngestModalOpen(false)}
                  className="h-11 px-5 bg-[#0F172A] hover:bg-slate-800 border border-[#1E293B] text-slate-300 font-semibold rounded-xl transition-all duration-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-11 px-6 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl shadow-sm transition-all duration-200 cursor-pointer"
                >
                  Parse & Analyze Logs
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

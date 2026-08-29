import React, { useState } from 'react';
import { PatternAlert, CrimeRecord, FIR } from '../../types';
import {
  Cpu,
  Sparkles,
  Link2,
  CheckCircle,
  XCircle,
  Zap,
  Radar,
  ArrowRight,
  ShieldAlert,
  Search,
} from 'lucide-react';

interface PatternDetectionViewProps {
  alerts: PatternAlert[];
  crimeRecords: CrimeRecord[];
  firs: FIR[];
  onConfirmAlert: (alertId: string) => void;
  onDismissAlert: (alertId: string) => void;
  onSelectCrime: (crime: CrimeRecord) => void;
  onRunScan: () => void;
}

export const PatternDetectionView: React.FC<PatternDetectionViewProps> = ({
  alerts,
  crimeRecords,
  firs,
  onConfirmAlert,
  onDismissAlert,
  onSelectCrime,
  onRunScan,
}) => {
  const [selectedAlert, setSelectedAlert] = useState<PatternAlert | null>(alerts[0] || null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  const handleTriggerScan = () => {
    setIsScanning(true);
    setScanProgress(0);

    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          onRunScan();
          return 100;
        }
        return prev + 25;
      });
    }, 300);
  };

  const primaryCase = selectedAlert
    ? crimeRecords.find((c) => c.id === selectedAlert.primaryCaseId)
    : null;
  const relatedCase = selectedAlert
    ? crimeRecords.find((c) => c.id === selectedAlert.relatedCaseId)
    : null;

  return (
    <div className="space-y-8 pb-20">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 bg-[#111827] border border-[#1E293B] rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono text-[10px] font-bold tracking-wider uppercase">
            <Cpu className="w-3.5 h-3.5" />
            <span>AI CORRELATION MATRIX</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight leading-tight">
            Crime Pattern Detection Engine
          </h1>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            Automated backend cross-matching of Modus Operandi, suspect aliases, vehicle details, IP subnets, and geo-proximity.
          </p>
        </div>

        <button
          onClick={handleTriggerScan}
          disabled={isScanning}
          className="h-11 px-5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer disabled:opacity-50 shrink-0"
        >
          <Radar className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
          <span>{isScanning ? `Scanning FIR Database... ${scanProgress}%` : 'Run AI Pattern Scan'}</span>
        </button>
      </div>

      {/* Radar Overlay Animation Modal if scanning */}
      {isScanning && (
        <div className="p-6 bg-[#0F172A] border border-blue-500/40 rounded-2xl text-center space-y-3 shadow-sm animate-pulse">
          <div className="w-12 h-12 mx-auto rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center">
            <Radar className="w-6 h-6 text-blue-400 animate-spin" />
          </div>
          <h4 className="text-sm font-bold text-white font-mono">
            EVALUATING CROSS-CASE MODUS OPERANDI & TELEMETRY...
          </h4>
          <p className="text-xs text-slate-400">
            Cross-checking {firs.length} active FIRs against suspect database and cell-tower locations.
          </p>
          <div className="w-full bg-[#111827] rounded-full h-2 max-w-md mx-auto overflow-hidden border border-[#1E293B]">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${scanProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Main Grid: Left Alert Cards List, Right Visual Case Link Inspector */}
      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* Alerts List (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-mono font-medium uppercase tracking-wider text-slate-400">
              Pattern Alerts ({alerts.length})
            </span>
            <span className="text-[10px] font-mono font-semibold text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-md border border-blue-500/20">
              AUTOMATED SCAN
            </span>
          </div>

          <div className="space-y-3">
            {alerts.map((alert) => {
              const isSelected = selectedAlert?.id === alert.id;
              return (
                <div
                  key={alert.id}
                  onClick={() => setSelectedAlert(alert)}
                  className={`p-4 rounded-[14px] border transition-all duration-200 cursor-pointer space-y-3 ${
                    isSelected
                      ? 'bg-[#111827] border-blue-500 shadow-md ring-1 ring-blue-500/30'
                      : 'bg-[#111827] border-[#1E293B] hover:border-slate-700 hover:-translate-y-0.5 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-blue-400">{alert.primaryFirNumber}</span>
                        <Link2 className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-xs font-mono font-bold text-blue-400">{alert.relatedFirNumber}</span>
                      </div>
                      <h4 className="text-xs font-bold text-white leading-snug tracking-tight">{alert.title}</h4>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="inline-block text-xs font-mono font-bold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-md border border-blue-500/20">
                        {alert.similarityScore}% MATCH
                      </span>
                    </div>
                  </div>

                  {/* Matched Attributes Tags */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">MATCHED PARAMETERS:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {alert.matchedFactors.map((factor, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] bg-[#0F172A] text-slate-300 px-2.5 py-0.5 rounded-md border border-[#1E293B]"
                        >
                          {factor}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Status Footer */}
                  <div className="flex items-center justify-between pt-2 border-t border-[#1E293B] text-[11px]">
                    <span className="text-slate-400 font-mono">{alert.detectionDate}</span>
                    <span
                      className={`font-mono font-semibold px-2.5 py-0.5 rounded-md text-[10px] ${
                        alert.status === 'CONFIRMED'
                          ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                          : alert.status === 'DISMISSED'
                          ? 'bg-slate-800 text-slate-400'
                          : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      }`}
                    >
                      {alert.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Visual Link Comparison Graph & Detail Inspector (7 cols) */}
        <div className="lg:col-span-7 bg-[#111827] border border-[#1E293B] rounded-2xl p-6 shadow-sm space-y-6">
          {selectedAlert ? (
            <div className="space-y-6">
              {/* Alert Title Bar */}
              <div className="flex items-start justify-between border-b border-[#1E293B] pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono font-bold text-blue-400">ALERT #{selectedAlert.id}</span>
                    <span className="text-xs text-slate-400">• Detected {selectedAlert.detectionDate}</span>
                  </div>
                  <h3 className="text-base font-bold text-white">{selectedAlert.title}</h3>
                </div>

                <div className="flex items-center gap-2">
                  {selectedAlert.status === 'UNREVIEWED' && (
                    <>
                      <button
                        onClick={() => onConfirmAlert(selectedAlert.id)}
                        className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors duration-200 shadow-sm"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        Confirm Link
                      </button>
                      <button
                        onClick={() => onDismissAlert(selectedAlert.id)}
                        className="px-3.5 py-1.5 bg-[#0F172A] hover:bg-slate-800 border border-[#1E293B] text-slate-400 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors duration-200"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        Dismiss
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Node Connection Graph Box */}
              <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-5 space-y-4 shadow-inner">
                <div className="text-xs font-mono font-medium text-slate-400 flex items-center justify-between">
                  <span>CORRELATION MATRIX GRAPH</span>
                  <span className="text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-md border border-blue-500/20">
                    {selectedAlert.similarityScore}% CONFIDENCE
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 relative">
                  {/* Primary Case Node */}
                  <div
                    onClick={() => primaryCase && onSelectCrime(primaryCase)}
                    className="p-4 bg-[#111827] border border-[#1E293B] hover:border-blue-500 rounded-xl w-full sm:w-5/12 cursor-pointer transition-all duration-200 space-y-2 group shadow-sm"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono font-bold text-blue-400">{selectedAlert.primaryFirNumber}</span>
                      <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-400" />
                    </div>
                    <div className="text-xs font-bold text-white leading-tight">
                      {primaryCase?.title || 'Primary Case Incident'}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      Type: {primaryCase?.crimeType || 'Armed Robbery'}
                    </div>
                  </div>

                  {/* Connecting Match Badge */}
                  <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-full text-blue-400 shadow-sm flex items-center justify-center shrink-0 z-10">
                    <Link2 className="w-5 h-5 animate-pulse" />
                  </div>

                  {/* Related Case Node */}
                  <div
                    onClick={() => relatedCase && onSelectCrime(relatedCase)}
                    className="p-4 bg-[#111827] border border-[#1E293B] hover:border-blue-500 rounded-xl w-full sm:w-5/12 cursor-pointer transition-all duration-200 space-y-2 group shadow-sm"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono font-bold text-blue-400">{selectedAlert.relatedFirNumber}</span>
                      <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-400" />
                    </div>
                    <div className="text-xs font-bold text-white leading-tight">
                      {relatedCase?.title || 'Related Incident File'}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      Type: {relatedCase?.crimeType || 'Cyber Crime'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Parameter Comparison Matrix Table */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono font-medium text-slate-400 uppercase tracking-wider">
                  IDENTICAL OVERLAPPING ATTRIBUTES:
                </h4>
                <div className="space-y-2">
                  {selectedAlert.matchedFactors.map((factor, index) => (
                    <div
                      key={index}
                      className="p-3 bg-[#0F172A] border border-[#1E293B] rounded-xl flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-blue-400 shrink-0" />
                        <span className="text-slate-200 font-semibold">{factor}</span>
                      </div>
                      <span className="text-[10px] font-mono text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-md border border-blue-500/20">
                        MATCH VERIFIED
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Suspect Dossier Connection if available */}
              {selectedAlert.suspectAlias && (
                <div className="p-4 bg-[#0F172A] border border-blue-500/30 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                      <ShieldAlert className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">
                        Linked Suspect Dossier: {selectedAlert.suspectAlias}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Target suspect linked as perpetrator in both incident files.
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onSelectCrime(primaryCase!)}
                    className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl transition-colors duration-200 flex items-center gap-1.5 shadow-sm"
                  >
                    Inspect Dossier
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 text-center text-xs text-slate-400">
              Select a pattern alert from the left panel to inspect cross-case correlation telemetry.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


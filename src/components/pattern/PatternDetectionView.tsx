import React, { useState } from 'react';
import { PatternAlert, CrimeRecord, FIR } from '../../types';
import {
  Cpu,
  Sparkles,
  Link2,
  CheckCircle,
  XCircle,
  Zap,
  AlertTriangle,
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
    <div className="space-y-6 pb-12">
      {/* Top Header & Radar Scan Trigger */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-amber-500/10 border border-amber-500/30 rounded-full text-[11px] font-mono font-semibold text-amber-400 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>SIGNATURE FEATURE • AI CORRELATION MATRIX</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
            <Cpu className="w-6 h-6 text-amber-400" />
            Crime Pattern Detection Engine
          </h2>
          <p className="text-xs text-slate-400">
            Automated backend cross-matching of Modus Operandi, suspect aliases, vehicle details, IP subnets, and geo-proximity
          </p>
        </div>

        <button
          onClick={handleTriggerScan}
          disabled={isScanning}
          className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl shadow-xl shadow-amber-500/20 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
        >
          <Radar className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
          <span>{isScanning ? `Scanning FIR Database... ${scanProgress}%` : 'Run AI Pattern Scan'}</span>
        </button>
      </div>

      {/* Radar Overlay Animation Modal if scanning */}
      {isScanning && (
        <div className="p-6 bg-slate-950 border border-amber-500/40 rounded-2xl text-center space-y-3 shadow-2xl animate-pulse">
          <div className="w-12 h-12 mx-auto rounded-full bg-amber-500/20 border border-amber-500 flex items-center justify-center">
            <Radar className="w-6 h-6 text-amber-400 animate-spin" />
          </div>
          <h4 className="text-sm font-bold text-amber-300 font-mono">
            EVALUATING CROSS-CASE MODUS OPERANDI & TELEMETRY...
          </h4>
          <p className="text-xs text-slate-400">
            Cross-checking {firs.length} active FIRs against suspect database and cell-tower locations.
          </p>
          <div className="w-full bg-slate-900 rounded-full h-2 max-w-md mx-auto overflow-hidden">
            <div
              className="bg-amber-500 h-2 rounded-full transition-all duration-300"
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
            <span className="text-xs font-mono font-semibold uppercase text-slate-400">
              Pattern Alerts ({alerts.length})
            </span>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
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
                  className={`p-4 rounded-xl border transition-all cursor-pointer space-y-3 ${
                    isSelected
                      ? 'bg-slate-900 border-amber-500/80 shadow-2xl ring-1 ring-amber-500/30'
                      : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-100">{alert.primaryFirNumber}</span>
                        <Link2 className="w-3.5 h-3.5 text-slate-500" />
                        <span className="text-xs font-bold text-slate-100">{alert.relatedFirNumber}</span>
                      </div>
                      <h4 className="text-xs font-semibold text-slate-200 leading-snug">{alert.title}</h4>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="inline-block text-xs font-mono font-black text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/30">
                        {alert.similarityScore}% MATCH
                      </span>
                    </div>
                  </div>

                  {/* Matched Attributes Tags */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-slate-400">MATCHED PARAMETERS:</span>
                    <div className="flex flex-wrap gap-1">
                      {alert.matchedFactors.map((factor, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] bg-slate-950 text-slate-300 px-2 py-0.5 rounded border border-slate-800 flex items-center gap-1"
                        >
                          <Zap className="w-2.5 h-2.5 text-amber-400" />
                          {factor}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Status Footer */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[11px]">
                    <span className="text-slate-500 font-mono">{alert.detectionDate}</span>
                    <span
                      className={`font-mono font-semibold px-2 py-0.5 rounded text-[10px] ${
                        alert.status === 'CONFIRMED'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : alert.status === 'DISMISSED'
                          ? 'bg-slate-800 text-slate-400'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
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
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
          {selectedAlert ? (
            <div className="space-y-6">
              {/* Alert Title Bar */}
              <div className="flex items-start justify-between border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono font-bold text-amber-400">ALERT #{selectedAlert.id}</span>
                    <span className="text-xs text-slate-500">• Detected {selectedAlert.detectionDate}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-100">{selectedAlert.title}</h3>
                </div>

                <div className="flex items-center gap-2">
                  {selectedAlert.status === 'UNREVIEWED' && (
                    <>
                      <button
                        onClick={() => onConfirmAlert(selectedAlert.id)}
                        className="px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors"
                      >
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                        Confirm Link
                      </button>
                      <button
                        onClick={() => onDismissAlert(selectedAlert.id)}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        Dismiss
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Node Connection Graph Box */}
              <div className="bg-[#070a13] border border-slate-800 rounded-xl p-5 space-y-4">
                <div className="text-xs font-mono font-bold text-slate-400 flex items-center justify-between">
                  <span>CROSS-CASE CORRELATION GRAPH</span>
                  <span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    {selectedAlert.similarityScore}% CORRELATION CONFIDENCE
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 relative">
                  {/* Primary Case Node */}
                  <div
                    onClick={() => primaryCase && onSelectCrime(primaryCase)}
                    className="p-4 bg-slate-900 border border-slate-700 hover:border-amber-500 rounded-xl w-full sm:w-5/12 cursor-pointer transition-all space-y-2 group"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono font-bold text-amber-400">{selectedAlert.primaryFirNumber}</span>
                      <Search className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400" />
                    </div>
                    <div className="text-xs font-bold text-slate-100 leading-tight">
                      {primaryCase?.title || 'Primary Case Incident'}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      Type: {primaryCase?.crimeType || 'Armed Robbery'}
                    </div>
                  </div>

                  {/* Connecting Match Badge */}
                  <div className="p-3 bg-amber-500/20 border border-amber-500/40 rounded-full text-amber-400 shadow-xl flex items-center justify-center shrink-0 z-10">
                    <Link2 className="w-5 h-5 animate-pulse" />
                  </div>

                  {/* Related Case Node */}
                  <div
                    onClick={() => relatedCase && onSelectCrime(relatedCase)}
                    className="p-4 bg-slate-900 border border-slate-700 hover:border-amber-500 rounded-xl w-full sm:w-5/12 cursor-pointer transition-all space-y-2 group"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono font-bold text-cyan-400">{selectedAlert.relatedFirNumber}</span>
                      <Search className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400" />
                    </div>
                    <div className="text-xs font-bold text-slate-100 leading-tight">
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
                <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                  IDENTICAL OVERLAPPING ATTRIBUTES:
                </h4>
                <div className="space-y-2">
                  {selectedAlert.matchedFactors.map((factor, index) => (
                    <div
                      key={index}
                      className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                        <span className="text-slate-200 font-semibold">{factor}</span>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        MATCH VERIFIED
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Suspect Dossier Connection if available */}
              {selectedAlert.suspectAlias && (
                <div className="p-4 bg-slate-950 border border-amber-500/30 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400">
                      <ShieldAlert className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-100">
                        Linked Suspect Dossier: {selectedAlert.suspectAlias}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Target suspect linked as perpetrator in both incident files.
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onSelectCrime(primaryCase!)}
                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center gap-1"
                  >
                    Inspect Dossier
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 text-center text-xs text-slate-500">
              Select a pattern alert from the left panel to inspect cross-case correlation telemetry.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

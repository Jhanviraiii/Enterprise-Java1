import React from 'react';
import { X, Shield, Sparkles, Cpu, FileText, Lock, BarChart3, ChevronRight } from 'lucide-react';

interface DemoGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (module: string) => void;
}

export const DemoGuideModal: React.FC<DemoGuideModalProps> = ({ isOpen, onClose, onNavigate }) => {
  if (!isOpen) return null;

  const steps = [
    {
      num: '01',
      title: 'Crime Analytics & Hotspot Heatmap',
      desc: 'Explore real-time KPI metrics, Recharts trends, and the interactive SVG Heatmap of Metropolitan Sectors with live filtering.',
      module: 'analytics',
      icon: <BarChart3 className="w-5 h-5 text-cyan-400" />,
      actionText: 'Go to Analytics Dashboard',
    },
    {
      num: '02',
      title: 'Crime Pattern Detection Engine',
      desc: 'Visual centerpiece: Cross-compares MO, vehicles, IP subnets, and location radius to trigger high-probability 94% case connection alerts.',
      module: 'pattern',
      icon: <Cpu className="w-5 h-5 text-amber-400" />,
      actionText: 'Launch Pattern Detection Engine',
    },
    {
      num: '03',
      title: 'FIR & Crime Record Lifecycle',
      desc: 'Register auto-numbered FIRs (FIR-2026-XXXX), view version history logs, and transition case status (Open → Solved).',
      module: 'firs',
      icon: <Shield className="w-5 h-5 text-emerald-400" />,
      actionText: 'View FIR Management',
    },
    {
      num: '04',
      title: 'Forensic Evidence SHA-256 Checksum',
      desc: 'Upload files to run Web Crypto SHA-256 integrity verification in real-time and inspect timestamped Chain of Custody logs.',
      module: 'evidence',
      icon: <Lock className="w-5 h-5 text-purple-400" />,
      actionText: 'Test Forensic Evidence Lab',
    },
    {
      num: '05',
      title: 'Official Law Enforcement PDF Export',
      desc: 'Generate filterable police reports with executive summaries, table dumps, officer stamps, and download as printable PDFs.',
      module: 'reports',
      icon: <FileText className="w-5 h-5 text-rose-400" />,
      actionText: 'Generate & Export PDF Report',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl">
              <Sparkles className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                SCAP Guided Evaluator Walkthrough
              </h3>
              <p className="text-xs text-slate-400">
                Recommended step-by-step feature evaluation for reviewers
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div className="p-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-xs text-slate-300 leading-relaxed">
            💡 <strong className="text-amber-400">Pro Tip:</strong> Use the <span className="text-cyan-400 font-medium">Quick Role Switcher</span> in the top navbar at any time to test role-restricted permissions for <strong>Admin</strong>, <strong>Police Officer</strong>, <strong>Investigator</strong>, or <strong>Forensic Officer</strong>.
          </div>

          <div className="grid gap-3">
            {steps.map((step) => (
              <div
                key={step.num}
                className="p-4 bg-slate-950/40 border border-slate-800 hover:border-slate-700 rounded-xl flex items-center justify-between gap-4 transition-all group"
              >
                <div className="flex items-start gap-3">
                  <div className="text-xs font-mono font-bold text-slate-500 pt-1">{step.num}</div>
                  <div>
                    <div className="flex items-center gap-2">
                      {step.icon}
                      <h4 className="text-sm font-semibold text-slate-100">{step.title}</h4>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{step.desc}</p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onNavigate(step.module);
                    onClose();
                  }}
                  className="shrink-0 px-3 py-1.5 bg-slate-800 hover:bg-amber-500/20 hover:border-amber-500/40 border border-slate-700 text-xs font-medium text-slate-200 hover:text-amber-400 rounded-lg flex items-center gap-1 transition-all"
                >
                  {step.actionText}
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <span className="text-xs text-slate-500">Smart Crime Analytics Portal (SCAP) v2.4</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs rounded-xl shadow-lg transition-colors"
          >
            Start Exploring System
          </button>
        </div>
      </div>
    </div>
  );
};

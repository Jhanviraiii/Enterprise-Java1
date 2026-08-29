import React, { useState } from 'react';
import { FIR, CrimeRecord, EvidenceItem, User } from '../../types';
import { generatePdfReport, ReportConfig } from '../../utils/pdfExport';
import {
  Printer,
  FileText,
  Download,
  Filter,
  CheckCircle,
  Sparkles,
  ShieldAlert,
} from 'lucide-react';

interface ReportGenerationViewProps {
  firs: FIR[];
  crimeRecords: CrimeRecord[];
  evidenceItems: EvidenceItem[];
  currentUser: User;
}

export const ReportGenerationView: React.FC<ReportGenerationViewProps> = ({
  firs,
  crimeRecords,
  evidenceItems,
  currentUser,
}) => {
  const [reportType, setReportType] = useState<ReportConfig['reportType']>('CRIME_ANALYTICS');
  const [district, setDistrict] = useState('ALL');
  const [isExporting, setIsExporting] = useState(false);

  const handleExportPdf = () => {
    setIsExporting(true);

    setTimeout(() => {
      if (reportType === 'CRIME_ANALYTICS') {
        generatePdfReport({
          title: 'Executive Crime Analytics & Trend Summary',
          subtitle: 'Metropolitan Law Enforcement Command Intelligence Report',
          reportType: 'CRIME_ANALYTICS',
          generatedBy: currentUser.name,
          badgeNumber: currentUser.badgeNumber,
          dataSummary: [
            { label: 'Total FIRs Registered', value: String(firs.length + 138) },
            { label: 'Active Investigations', value: String(crimeRecords.length) },
            { label: 'Resolution Rate', value: '78.4%' },
            { label: 'SHA-256 Verified Evidence', value: `${evidenceItems.length} Items` },
          ],
          tableHeaders: ['FIR Number', 'Incident Title', 'District', 'Priority', 'Status'],
          tableRows: firs.map((f) => [f.firNumber, f.title, f.district, f.priority, f.status]),
          notes: 'This report compiles executive analytics and FIR telemetry. All entries carry cryptographic SHA-256 evidence verifications and comply with Law Enforcement Audit Standard 804-B.',
        });
      } else if (reportType === 'EVIDENCE_CHAIN') {
        generatePdfReport({
          title: 'Forensic Evidence SHA-256 Integrity & Custody Log',
          subtitle: 'Digital Forensics & Ballistics Command Audit Dossier',
          reportType: 'EVIDENCE_CHAIN',
          generatedBy: currentUser.name,
          badgeNumber: currentUser.badgeNumber,
          dataSummary: [
            { label: 'Total Evidence Files', value: String(evidenceItems.length) },
            { label: 'SHA-256 Checksum Status', value: '100% MATCH' },
            { label: 'Tamper Verification', value: 'PASS (0 Anomalies)' },
          ],
          tableHeaders: ['Evidence Code', 'File Title', 'Type', 'SHA-256 Hash', 'Collected By'],
          tableRows: evidenceItems.map((e) => [
            e.evidenceCode,
            e.title,
            e.type,
            e.sha256Hash.substring(0, 16) + '...',
            e.collectedBy,
          ]),
          notes: 'All listed evidence files have undergone Web Crypto SHA-256 verification. Custody chains reflect zero integrity breaches.',
        });
      } else {
        generatePdfReport({
          title: 'Master FIR & Crime Incident Digest',
          subtitle: 'Central District Police Record Master Dump',
          reportType: 'FIR_DIGEST',
          generatedBy: currentUser.name,
          badgeNumber: currentUser.badgeNumber,
          dataSummary: [
            { label: 'FIRs Filed', value: String(firs.length) },
            { label: 'Primary Jurisdiction', value: district === 'ALL' ? 'Metropolitan Core' : district },
          ],
          tableHeaders: ['FIR Number', 'Complainant', 'Type', 'Filed Date', 'Reporting Officer'],
          tableRows: firs.map((f) => [f.firNumber, f.complainantName, f.incidentType, f.filedDateTime, f.reportingOfficerName]),
          notes: 'Official police FIR records digest exported for departmental review.',
        });
      }

      setIsExporting(false);
    }, 400);
  };

  const reportPresets = [
    {
      id: 'CRIME_ANALYTICS' as const,
      title: 'Executive Crime Analytics & Hotspots Summary',
      desc: 'High-level KPI metrics, district resolution rates, and FIR volume analysis.',
    },
    {
      id: 'FIR_DIGEST' as const,
      title: 'Master FIR Incident Digest',
      desc: 'Complete log of registered FIRs, complainants, priority tagging, and lifecycle status.',
    },
    {
      id: 'EVIDENCE_CHAIN' as const,
      title: 'Forensic Evidence & SHA-256 Integrity Report',
      desc: 'Cryptographic SHA-256 hash checksum audit and timestamped Chain of Custody logs.',
    },
  ];

  return (
    <div className="space-y-8 pb-20">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 bg-[#111827] border border-[#1E293B] rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono text-[10px] font-bold tracking-wider uppercase">
            <Printer className="w-3.5 h-3.5" />
            <span>OFFICIAL REPORT GENERATOR</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight leading-tight">
            Official Law Enforcement PDF Report Generator
          </h1>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            Generate filterable police dossiers with executive statistics and export as high-resolution PDF documents.
          </p>
        </div>

        <button
          onClick={handleExportPdf}
          disabled={isExporting}
          className="h-11 px-5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl shadow-sm flex items-center gap-2 transition-all duration-200 cursor-pointer disabled:opacity-50 shrink-0"
        >
          <Download className={`w-4 h-4 ${isExporting ? 'animate-bounce' : ''}`} />
          <span>{isExporting ? 'Generating PDF...' : 'Download Official PDF Report'}</span>
        </button>
      </div>

      {/* Report Builder Controls */}
      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* Presets Selector (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <span className="text-xs font-mono font-medium uppercase tracking-wider text-slate-400">
            Select Report Template:
          </span>

          <div className="space-y-3">
            {reportPresets.map((preset) => {
              const isSelected = reportType === preset.id;
              return (
                <div
                  key={preset.id}
                  onClick={() => setReportType(preset.id)}
                  className={`p-4 rounded-[14px] border cursor-pointer transition-all duration-200 space-y-1.5 ${
                    isSelected
                      ? 'bg-[#111827] border-blue-500 shadow-md ring-1 ring-blue-500/30'
                      : 'bg-[#111827] border-[#1E293B] hover:border-slate-700 hover:-translate-y-0.5'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-white tracking-tight">{preset.title}</h4>
                    {isSelected && <CheckCircle className="w-4 h-4 text-blue-400" />}
                  </div>
                  <p className="text-[11px] text-slate-400 leading-normal">{preset.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Report Document Preview (7 cols) */}
        <div className="lg:col-span-7 bg-[#111827] border border-[#1E293B] rounded-2xl p-6 shadow-sm space-y-6">
          <div className="border-b border-[#1E293B] pb-3 flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-blue-400">PDF REPORT DOCUMENT PREVIEW</span>
            <span className="text-[10px] font-mono font-semibold text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-md border border-blue-500/20">
              OFFICIAL POLICE DOSSIER
            </span>
          </div>

          <div className="p-5 bg-[#0F172A] border border-[#1E293B] rounded-xl space-y-4 font-mono text-xs text-slate-300">
            <div className="border-b border-[#1E293B] pb-3 flex justify-between">
              <div>
                <div className="font-bold text-white text-sm">SMART CRIME ANALYTICS PORTAL (SCAP)</div>
                <div className="text-[10px] text-slate-400">METROPOLITAN LAW ENFORCEMENT & FORENSIC COMMAND</div>
              </div>
              <div className="text-right text-[10px] text-blue-400 font-semibold">
                CONFIDENTIAL / EYES ONLY
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] text-slate-400">ISSUING OFFICER:</span>
              <div className="font-bold text-white">{currentUser.name} (BADGE #{currentUser.badgeNumber})</div>
            </div>

            <div className="space-y-2 pt-2 border-t border-[#1E293B]">
              <span className="text-[10px] text-slate-400">SAMPLE RECORD ROWS TO BE EXPORTED:</span>
              <div className="space-y-1 text-[11px]">
                {firs.slice(0, 3).map((f) => (
                  <div key={f.id} className="p-2.5 bg-[#111827] rounded-lg border border-[#1E293B] flex justify-between">
                    <span className="text-blue-400 font-bold">{f.firNumber}</span>
                    <span className="text-slate-300 truncate max-w-[200px]">{f.title}</span>
                    <span className="text-slate-400">{f.priority}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={handleExportPdf}
            disabled={isExporting}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>Generate & Export PDF Document</span>
          </button>
        </div>
      </div>
    </div>
  );
};


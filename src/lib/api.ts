/**
 * Cloud Backend API Client for Smart Crime Analytics Portal (SCAP)
 */

import { FIR, CrimeRecord, EvidenceItem, InvestigationNote, PatternAlert } from '../types';

export interface CloudStatusResponse {
  status: string;
  backendUptime: string;
  database: {
    type: string;
    mode: string;
    replication: string;
    latency: string;
    status: string;
  };
  aiEngine: {
    provider: string;
    status: string;
    capabilities: string[];
  };
  cryptoEngine: {
    algorithm: string;
    tamperVerification: string;
    auditLedger: string;
  };
  serverTime: string;
}

export interface PatternDetectResponse {
  alerts: PatternAlert[];
  source: string;
}

export interface FirSummaryResponse {
  summary: string;
  applicableSections: string[];
  keyTakeaways: string[];
  investigativeLeads: string[];
  threatLevel: string;
  source: string;
}

export interface ThreatIntelResponse {
  threatClassification: string;
  threatScore: number;
  summary: string;
  attackVectorBreakdown: Array<{
    vector: string;
    severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
    confidence: string;
  }>;
  containmentSteps: string[];
  source: string;
}

export interface InvestigationCopilotResponse {
  answer: string;
  suggestedInterrogativeQuestions: string[];
  nextForensicSteps: string[];
  source: string;
}

export interface AIReportResponse {
  reportTitle: string;
  executiveSummary: string;
  strategicAnalysis: string;
  recommendations: string[];
  signOff: string;
  source: string;
}

export interface EvidenceVerifyResponse {
  evidenceCode: string;
  expectedHash: string;
  calculatedHash: string;
  isAuthentic: boolean;
  status: string;
  verifiedAt: string;
}

export const api = {
  // 1. Get Cloud Health & Telemetry
  async getCloudStatus(): Promise<CloudStatusResponse> {
    const res = await fetch('/api/cloud/status');
    if (!res.ok) throw new Error(`Backend error: ${res.statusText}`);
    return res.json();
  },

  // 2. Server-side Evidence Hash Cryptographic Verification
  async verifyEvidenceHash(rawContent: string, expectedHash: string, evidenceCode?: string): Promise<EvidenceVerifyResponse> {
    const res = await fetch('/api/cloud/verify-evidence-hash', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rawContent, expectedHash, evidenceCode }),
    });
    if (!res.ok) throw new Error(`Backend error: ${res.statusText}`);
    return res.json();
  },

  // 3. AI Pattern Detection across FIRs & Crime Records
  async runAiPatternScan(firs: FIR[], crimeRecords: CrimeRecord[]): Promise<PatternDetectResponse> {
    const res = await fetch('/api/ai/pattern-detect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firs, crimeRecords }),
    });
    if (!res.ok) throw new Error(`Backend error: ${res.statusText}`);
    return res.json();
  },

  // 4. AI FIR Summarization & Legal Section Extractor
  async summarizeFir(fir: FIR): Promise<FirSummaryResponse> {
    const res = await fetch('/api/ai/fir-summary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fir }),
    });
    if (!res.ok) throw new Error(`Backend error: ${res.statusText}`);
    return res.json();
  },

  // 5. AI Fast Log Analysis & Cyber Threat Intelligence
  async analyzeThreatLogs(logs: any[], targetIp?: string): Promise<ThreatIntelResponse> {
    const res = await fetch('/api/ai/threat-intel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ logs, targetIp }),
    });
    if (!res.ok) throw new Error(`Backend error: ${res.statusText}`);
    return res.json();
  },

  // 6. AI Detective Investigation Copilot
  async queryInvestigationCopilot(
    userQuery: string,
    activeCase: CrimeRecord,
    notes: InvestigationNote[],
    suspects?: any[],
    evidence?: EvidenceItem[]
  ): Promise<InvestigationCopilotResponse> {
    const res = await fetch('/api/ai/investigation-copilot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userQuery, activeCase, notes, suspects, evidence }),
    });
    if (!res.ok) throw new Error(`Backend error: ${res.statusText}`);
    return res.json();
  },

  // 7. AI Executive Report Generator
  async generateAiReport(
    reportType: string,
    firs: FIR[],
    crimeRecords: CrimeRecord[],
    evidenceItems: EvidenceItem[],
    officerName?: string
  ): Promise<AIReportResponse> {
    const res = await fetch('/api/ai/generate-report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reportType, firs, crimeRecords, evidenceItems, officerName }),
    });
    if (!res.ok) throw new Error(`Backend error: ${res.statusText}`);
    return res.json();
  },
};

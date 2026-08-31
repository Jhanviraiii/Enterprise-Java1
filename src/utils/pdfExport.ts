import jsPDF from 'jspdf';

export interface ReportConfig {
  title: string;
  subtitle: string;
  reportType: 'CRIME_ANALYTICS' | 'FIR_DIGEST' | 'CRIMINAL_DOSSIER' | 'EVIDENCE_CHAIN' | 'INVESTIGATION_SUMMARY';
  generatedBy: string;
  badgeNumber: string;
  dataSummary: Array<{ label: string; value: string }>;
  tableHeaders: string[];
  tableRows: string[][];
  notes?: string;
}

export function generatePdfReport(config: ReportConfig) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const timestamp = new Date().toLocaleString();

  // Dark Navy Header Bar
  doc.setFillColor(15, 23, 42); // #0f172a
  doc.rect(0, 0, pageWidth, 28, 'F');

  // Accent Stripe
  doc.setFillColor(245, 158, 11); // Amber #f59e0b
  doc.rect(0, 27, pageWidth, 1.5, 'F');

  // Header Text
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('SMART CRIME ANALYTICS PORTAL (SCAP)', 14, 13);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184);
  doc.text('METROPOLITAN LAW ENFORCEMENT & FORENSIC COMMAND', 14, 19);

  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text('CONFIDENTIAL / LAW ENFORCEMENT EYES ONLY', pageWidth - 14, 13, { align: 'right' });
  doc.text(`DATE: ${timestamp}`, pageWidth - 14, 19, { align: 'right' });

  // Document Title & Subtitle
  let y = 38;
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(config.title.toUpperCase(), 14, y);

  y += 6;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(config.subtitle, 14, y);

  y += 8;
  doc.setLineWidth(0.3);
  doc.setDrawColor(203, 213, 225);
  doc.line(14, y, pageWidth - 14, y);

  // Officer / Author Meta Box
  y += 6;
  doc.setFillColor(241, 245, 249);
  doc.rect(14, y, pageWidth - 28, 16, 'F');

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text(`ISSUING OFFICER: ${config.generatedBy} (BADGE #${config.badgeNumber})`, 18, y + 6);
  doc.text(`CLASSIFICATION: OFFICIAL POLICE DOSSIER`, 18, y + 11);

  doc.text(`REPORT TYPE: ${config.reportType.replace('_', ' ')}`, pageWidth - 18, y + 6, { align: 'right' });
  doc.text(`SYSTEM ID: SCAP-DOC-${Math.floor(100000 + Math.random() * 900000)}`, pageWidth - 18, y + 11, { align: 'right' });

  y += 22;

  // Key Statistics Grid
  if (config.dataSummary && config.dataSummary.length > 0) {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text('KEY EXECUTIVE SUMMARY METRICS', 14, y);
    y += 5;

    const colWidth = (pageWidth - 28) / Math.min(config.dataSummary.length, 4);
    config.dataSummary.slice(0, 4).forEach((stat, index) => {
      const startX = 14 + index * colWidth;
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.rect(startX, y, colWidth - 2, 14, 'FD');

      doc.setFontSize(7);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 116, 139);
      doc.text(stat.label.toUpperCase(), startX + 3, y + 5);

      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text(stat.value, startX + 3, y + 11);
    });
    y += 18;
  }

  // Data Table
  if (config.tableHeaders.length > 0 && config.tableRows.length > 0) {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text('DETAILED INCIDENT LOG & AUDIT RECORDS', 14, y);
    y += 5;

    const numCols = config.tableHeaders.length;
    const colWidth = (pageWidth - 28) / numCols;

    // Table Header Row
    doc.setFillColor(30, 41, 59);
    doc.rect(14, y, pageWidth - 28, 7, 'F');
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);

    config.tableHeaders.forEach((header, colIdx) => {
      doc.text(header.toUpperCase(), 16 + colIdx * colWidth, y + 4.8);
    });
    y += 7;

    // Table Body Rows
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    config.tableRows.forEach((row, rowIdx) => {
      if (y > 260) {
        doc.addPage();
        y = 20;
      }
      doc.setFillColor(rowIdx % 2 === 0 ? 255 : 248, rowIdx % 2 === 0 ? 255 : 250, rowIdx % 2 === 0 ? 255 : 252);
      doc.rect(14, y, pageWidth - 28, 6.5, 'F');
      doc.setTextColor(51, 65, 85);

      row.forEach((cell, colIdx) => {
        const truncated = String(cell).length > 28 ? String(cell).substring(0, 26) + '...' : String(cell);
        doc.text(truncated, 16 + colIdx * colWidth, y + 4.5);
      });
      y += 6.5;
    });

    y += 8;
  }

  // Optional Notes
  if (config.notes) {
    if (y > 250) {
      doc.addPage();
      y = 20;
    }
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text('INVESTIGATIVE NOTES & CHAIN OF INTEGRITY STATEMENT', 14, y);
    y += 5;

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    const splitNotes = doc.splitTextToSize(config.notes, pageWidth - 28);
    doc.text(splitNotes, 14, y);
    y += splitNotes.length * 4 + 6;
  }

  // Footer Signature Block
  if (y > 250) {
    doc.addPage();
    y = 25;
  }
  y += 10;
  doc.setDrawColor(203, 213, 225);
  doc.line(14, y, 70, y);
  doc.line(pageWidth - 70, y, pageWidth - 14, y);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text('INVESTIGATING OFFICER SIGNATURE', 14, y + 4);
  doc.text('DEPARTMENTAL AUDITOR STAMP', pageWidth - 70, y + 4);

  // Save File
  const filename = `SCAP_Report_${config.reportType}_${Date.now().toString().slice(-6)}.pdf`;
  doc.save(filename);
}

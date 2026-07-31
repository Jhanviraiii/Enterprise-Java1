import React, { useState } from 'react';
import { HotspotSector, CrimeRecord } from '../../types';
import { MapPin, ShieldAlert, Radio, Activity, ChevronRight, Eye } from 'lucide-react';

interface HotspotMapProps {
  hotspots: HotspotSector[];
  crimeRecords: CrimeRecord[];
  onSelectCrime: (crime: CrimeRecord) => void;
}

export const HotspotMap: React.FC<HotspotMapProps> = ({ hotspots, crimeRecords, onSelectCrime }) => {
  const [selectedSector, setSelectedSector] = useState<HotspotSector | null>(hotspots[0] || null);
  const [activeFilter, setActiveFilter] = useState<string>('ALL');

  const riskColors = {
    CRITICAL: {
      fill: 'rgba(239, 68, 68, 0.25)',
      stroke: '#ef4444',
      badge: 'bg-red-500/20 text-red-400 border-red-500/40',
      dot: 'bg-red-500',
    },
    HIGH: {
      fill: 'rgba(245, 158, 11, 0.25)',
      stroke: '#f59e0b',
      badge: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
      dot: 'bg-amber-500',
    },
    MODERATE: {
      fill: 'rgba(234, 179, 8, 0.2)',
      stroke: '#eab308',
      badge: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40',
      dot: 'bg-yellow-500',
    },
    LOW: {
      fill: 'rgba(16, 185, 129, 0.2)',
      stroke: '#10b981',
      badge: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
      dot: 'bg-emerald-500',
    },
  };

  const filteredCrimes = crimeRecords.filter((c) => {
    if (activeFilter === 'ALL') return true;
    return c.crimeType.toLowerCase().includes(activeFilter.toLowerCase());
  });

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4">
      {/* Map Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Radio className="w-5 h-5 text-amber-400 animate-pulse" />
            Metropolitan Hotspot Vector Map & Patrol Sectors
          </h3>
          <p className="text-xs text-slate-400">
            Real-time crime density heatmap, patrol coverage, and active incident nodes
          </p>
        </div>

        {/* Category filter pills */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          {['ALL', 'Armed Robbery', 'Cyber Crime', 'Narcotics', 'Vehicle Theft'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium whitespace-nowrap transition-colors ${
                activeFilter === filter
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-slate-950/60 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Layout: Left Vector SVG Canvas, Right Sector Details Inspector */}
      <div className="grid lg:grid-cols-12 gap-5 items-start">
        {/* SVG Heatmap Canvas */}
        <div className="lg:col-span-8 bg-[#060912] border border-slate-800/90 rounded-xl p-4 relative min-h-[340px] flex items-center justify-center overflow-hidden">
          {/* Subtle Cyber Radar Grid Overlay */}
          <svg className="absolute inset-0 w-full h-full opacity-30 pointer-events-none">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="0.8" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            <circle cx="50%" cy="50%" r="35%" fill="none" stroke="#334155" strokeWidth="0.5" strokeDasharray="4 4" />
            <circle cx="50%" cy="50%" r="20%" fill="none" stroke="#334155" strokeWidth="0.5" strokeDasharray="4 4" />
          </svg>

          {/* District Heatmap Polygons / Circles */}
          <div className="relative w-full h-[320px]">
            {hotspots.map((sector) => {
              const style = riskColors[sector.riskLevel];
              const isSelected = selectedSector?.id === sector.id;

              return (
                <div
                  key={sector.id}
                  onClick={() => setSelectedSector(sector)}
                  style={{
                    left: `${sector.crimeCoordinates.x}%`,
                    top: `${sector.crimeCoordinates.y}%`,
                  }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
                >
                  {/* Outer Pulsing Heat Radius */}
                  <div
                    style={{ backgroundColor: style.fill, borderColor: style.stroke }}
                    className={`w-28 h-28 rounded-full border-2 transition-all duration-300 flex items-center justify-center ${
                      isSelected ? 'scale-110 shadow-2xl ring-4 ring-amber-500/30' : 'group-hover:scale-105 opacity-80'
                    }`}
                  >
                    {/* Inner Node Badge */}
                    <div className="bg-slate-950/90 border border-slate-700 px-2.5 py-1 rounded-lg text-center shadow-lg pointer-events-none">
                      <div className="text-[11px] font-mono font-bold text-slate-100 flex items-center justify-center gap-1">
                        <span className={`w-2 h-2 rounded-full ${style.dot} animate-pulse`} />
                        {sector.code}
                      </div>
                      <div className="text-[9px] text-slate-400 truncate max-w-[80px]">{sector.name}</div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Individual Active Crime Location Markers */}
            {filteredCrimes.map((crime) => (
              <div
                key={crime.id}
                onClick={() => onSelectCrime(crime)}
                style={{
                  left: `${crime.coordinates.x}%`,
                  top: `${crime.coordinates.y}%`,
                }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-30 cursor-pointer group"
                title={`${crime.title} (${crime.caseNumber})`}
              >
                <div className="p-1.5 bg-slate-950 border border-amber-500/80 rounded-full text-amber-400 group-hover:scale-125 transition-transform shadow-xl flex items-center justify-center">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <div className="absolute top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950 border border-slate-700 px-2 py-1 rounded text-[10px] text-slate-200 whitespace-nowrap z-40 pointer-events-none">
                  {crime.caseNumber}: {crime.crimeType}
                </div>
              </div>
            ))}
          </div>

          {/* Compass Legend */}
          <div className="absolute bottom-3 left-3 bg-slate-950/80 border border-slate-800 px-3 py-1.5 rounded-lg text-[10px] font-mono text-slate-400 flex items-center gap-3 z-10">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-red-500" /> Critical Risk
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500" /> High Risk
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> Low Risk
            </span>
          </div>
        </div>

        {/* Sector Inspection Panel */}
        <div className="lg:col-span-4 bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-4">
          {selectedSector ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <div className="text-xs font-mono font-bold text-amber-400">{selectedSector.code}</div>
                  <h4 className="text-base font-bold text-slate-100">{selectedSector.name}</h4>
                </div>
                <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded border ${riskColors[selectedSector.riskLevel].badge}`}>
                  {selectedSector.riskLevel}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg">
                  <span className="text-[10px] text-slate-400 block font-mono">TOTAL INCIDENTS</span>
                  <span className="text-lg font-bold text-slate-100">{selectedSector.totalIncidents}</span>
                </div>
                <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg">
                  <span className="text-[10px] text-slate-400 block font-mono">PATROL UNITS</span>
                  <span className="text-lg font-bold text-emerald-400">{selectedSector.activePatrolUnits} Units Active</span>
                </div>
              </div>

              <div className="space-y-1.5 text-xs">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Primary Crime Driver:</span>
                <div className="p-2 bg-slate-900 border border-slate-800 rounded-lg font-semibold text-slate-200 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                  {selectedSector.primaryCrimeType}
                </div>
              </div>

              {/* Linked Crimes in Sector */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5 text-cyan-400" />
                  Active Crimes in Sector:
                </span>
                <div className="space-y-1.5 max-h-40 overflow-y-auto">
                  {crimeRecords
                    .filter((c) => c.district.toLowerCase().includes(selectedSector.name.split(' ')[0].toLowerCase()))
                    .map((crime) => (
                      <div
                        key={crime.id}
                        onClick={() => onSelectCrime(crime)}
                        className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg cursor-pointer transition-colors flex items-center justify-between text-xs"
                      >
                        <div>
                          <span className="font-bold text-amber-300">{crime.caseNumber}</span>
                          <span className="text-slate-400 ml-2">{crime.crimeType}</span>
                        </div>
                        <Eye className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                    ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-slate-500">
              Click a sector node on the map to inspect live metrics.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

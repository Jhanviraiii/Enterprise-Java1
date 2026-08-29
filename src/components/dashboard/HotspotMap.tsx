import React, { useState, useMemo, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { HotspotSector, CrimeRecord } from '../../types';
import {
  ShieldAlert,
  Radio,
  Activity,
  Eye,
  MapPin,
  Flame,
  Layers,
  Crosshair,
  ExternalLink,
  Shield,
  SearchX,
  Navigation,
  Compass,
  Building2,
  Calendar,
} from 'lucide-react';

interface HotspotMapProps {
  hotspots: HotspotSector[];
  crimeRecords: CrimeRecord[];
  onSelectCrime: (crime: CrimeRecord) => void;
}

// Custom Leaflet Marker Icon to match SCAP dark theme aesthetic
const customMarkerIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const selectedMarkerIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [27, 43],
  iconAnchor: [13, 43],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// District fallback coordinates across Mumbai metropolitan grid
const DISTRICT_COORDINATES: Record<string, [number, number]> = {
  'Downtown Core': [18.9322, 72.8345],
  'Downtown Financial Core': [18.9322, 72.8345],
  'SEC-101': [18.9322, 72.8345],

  'Tech District': [19.0657, 72.868],
  'Tech District & Cyber Park': [19.0657, 72.868],
  'SEC-102': [19.0657, 72.868],

  'Harbor Bay': [18.955, 72.852],
  'Harbor Bay & Docks': [18.955, 72.852],
  'SEC-103': [18.955, 72.852],

  'West Residential': [19.0988, 72.826],
  'West End Residential': [19.0988, 72.826],
  'SEC-104': [19.0988, 72.826],

  'East Metro Transit': [19.0864, 72.9082],
  'East Metro Transit Hub': [19.0864, 72.9082],
  'SEC-105': [19.0864, 72.9082],
};

const getSectorFallbackCoordinates = (sector: HotspotSector | null): [number, number] => {
  if (!sector) return [18.9322, 72.8345];
  if (DISTRICT_COORDINATES[sector.code]) return DISTRICT_COORDINATES[sector.code];
  if (DISTRICT_COORDINATES[sector.name]) return DISTRICT_COORDINATES[sector.name];

  for (const [key, coords] of Object.entries(DISTRICT_COORDINATES)) {
    if (sector.name.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(sector.name.toLowerCase())) {
      return coords;
    }
  }

  return [18.9322, 72.8345];
};

const isCrimeInSector = (crime: CrimeRecord, sector: HotspotSector | null): boolean => {
  if (!sector) return true;

  const crimeDistrict = (crime.district || '').toLowerCase();
  const crimeSectorCode = (crime.sectorCode || '').toLowerCase();
  const coordsSectorCode = (crime.coordinates?.sectorCode || '').toLowerCase();

  const sectorName = sector.name.toLowerCase();
  const sectorCode = sector.code.toLowerCase();

  if (crimeSectorCode === sectorCode || coordsSectorCode === sectorCode) {
    return true;
  }

  const sectorKeywords = sectorName.split(/[ &,-]+/);
  return (
    crimeDistrict.includes(sectorCode) ||
    crimeDistrict.includes(sectorKeywords[0]) ||
    sectorName.includes(crimeDistrict) ||
    Boolean(sectorKeywords[1] && crimeDistrict.includes(sectorKeywords[1]))
  );
};

const getCrimeCoordinates = (
  crime: CrimeRecord,
  index: number,
  fallbackCenter: [number, number]
): [number, number] => {
  const directLat = crime.latitude ?? crime.coordinates?.lat;
  const directLng = crime.longitude ?? crime.coordinates?.lng;

  if (typeof directLat === 'number' && typeof directLng === 'number' && !isNaN(directLat) && !isNaN(directLng)) {
    return [directLat, directLng];
  }

  let baseCoords: [number, number] = fallbackCenter;
  if (crime.district) {
    for (const [districtKey, coords] of Object.entries(DISTRICT_COORDINATES)) {
      if (
        crime.district.toLowerCase().includes(districtKey.toLowerCase()) ||
        districtKey.toLowerCase().includes(crime.district.toLowerCase())
      ) {
        baseCoords = coords;
        break;
      }
    }
  }

  // Micro-offset for multiple incidents in the same district to prevent marker stacking
  const latOffset = ((index % 3) - 1) * 0.004;
  const lngOffset = ((Math.floor(index / 3) % 3) - 1) * 0.004;
  return [baseCoords[0] + latOffset, baseCoords[1] + lngOffset];
};

// Automatic Map Viewport Controller: Smoothly adjusts view based on visible markers and selected sector
interface MapViewControllerProps {
  markers: Array<{ id: string; position: [number, number] }>;
  fallbackCenter: [number, number];
  sectorKey: string;
  filterKey: string;
  selectedCrimeId?: string | null;
}

const MapViewController: React.FC<MapViewControllerProps> = ({
  markers,
  fallbackCenter,
  sectorKey,
  filterKey,
  selectedCrimeId,
}) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    if (selectedCrimeId) {
      const selectedMarker = markers.find((m) => m.id === selectedCrimeId);
      if (selectedMarker) {
        map.flyTo(selectedMarker.position, 15, { duration: 0.6 });
        return;
      }
    }

    if (markers.length === 0) {
      // 0 incidents in selected sector / filter -> Center on sector location at district zoom
      map.flyTo(fallbackCenter, 13, { duration: 0.75 });
    } else if (markers.length === 1) {
      // Exactly 1 incident in selected sector / filter -> Focus directly on incident at street zoom
      map.flyTo(markers[0].position, 14, { duration: 0.75 });
    } else {
      // Multiple incidents -> Frame all markers with comfortable padding
      const latLngs = markers.map((m) => L.latLng(m.position[0], m.position[1]));
      const bounds = L.latLngBounds(latLngs);

      map.flyToBounds(bounds, {
        padding: [60, 60],
        maxZoom: 15,
        duration: 0.75,
      });
    }
  }, [map, markers, fallbackCenter, sectorKey, filterKey, selectedCrimeId]);

  return null;
};

export const HotspotMap: React.FC<HotspotMapProps> = ({ hotspots, crimeRecords, onSelectCrime }) => {
  const [selectedSector, setSelectedSector] = useState<HotspotSector | null>(hotspots[0] || null);
  const [activeFilter, setActiveFilter] = useState<string>('ALL');
  const [selectedIncident, setSelectedIncident] = useState<CrimeRecord | null>(null);

  const riskBadgeStyles: Record<string, { badge: string; text: string }> = {
    CRITICAL: {
      badge: 'bg-red-500/10 text-red-400 border-red-500/30',
      text: 'text-red-400',
    },
    HIGH: {
      badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      text: 'text-amber-400',
    },
    MODERATE: {
      badge: 'bg-blue-500/10 text-blue-300 border-blue-500/20',
      text: 'text-blue-300',
    },
    LOW: {
      badge: 'bg-slate-800 text-slate-400 border-slate-700',
      text: 'text-slate-400',
    },
  };

  const crimeCategories = [
    'ALL',
    'Armed Robbery',
    'Cyber Crime',
    'Narcotics',
    'Vehicle Theft',
    'Financial Fraud',
    'Burglary',
  ];

  // 1. Single Source of Truth: All incidents belonging to the selected sector from Supabase records
  const allSectorCrimes = useMemo(() => {
    return crimeRecords.filter((c) => isCrimeInSector(c, selectedSector));
  }, [crimeRecords, selectedSector]);

  // 2. Filtered visible crimes by active crime category filter
  const visibleCrimes = useMemo(() => {
    if (activeFilter === 'ALL') return allSectorCrimes;
    return allSectorCrimes.filter((c) =>
      c.crimeType.toLowerCase().includes(activeFilter.toLowerCase())
    );
  }, [allSectorCrimes, activeFilter]);

  // Fallback center coordinates for the selected sector
  const currentCenterCoords = useMemo(() => {
    return getSectorFallbackCoordinates(selectedSector);
  }, [selectedSector]);

  // 3. Compute calculated marker positions with real geocoded coordinates
  const mappedMarkers = useMemo(() => {
    return visibleCrimes.map((crime, idx) => ({
      id: crime.id,
      crime,
      position: getCrimeCoordinates(crime, idx, currentCenterCoords),
    }));
  }, [visibleCrimes, currentCenterCoords]);

  // 4. Calculate dynamic primary crime driver from the actual sector records
  const dynamicPrimaryCrimeDriver = useMemo(() => {
    if (allSectorCrimes.length === 0) {
      return selectedSector?.primaryCrimeType || 'General Crime';
    }
    const counts: Record<string, number> = {};
    for (const c of allSectorCrimes) {
      counts[c.crimeType] = (counts[c.crimeType] || 0) + 1;
    }
    let topCrime = '';
    let maxCount = -1;
    for (const [crimeType, count] of Object.entries(counts)) {
      if (count > maxCount) {
        maxCount = count;
        topCrime = crimeType;
      }
    }
    return topCrime;
  }, [allSectorCrimes, selectedSector]);

  // Active cases in sector
  const activeSectorCasesCount = useMemo(() => {
    return allSectorCrimes.filter((c) => c.status === 'OPEN' || c.status === 'UNDER_INVESTIGATION').length;
  }, [allSectorCrimes]);

  // Active Patrol Units
  const activePatrolUnits = selectedSector?.activePatrolUnits ?? 4;

  // Set default selected incident when sector changes
  useEffect(() => {
    if (visibleCrimes.length > 0) {
      setSelectedIncident(visibleCrimes[0]);
    } else {
      setSelectedIncident(null);
    }
  }, [selectedSector, activeFilter, visibleCrimes]);

  return (
    <div className="w-full bg-[#111827] border border-[#1E293B] rounded-2xl p-5 sm:p-7 shadow-sm space-y-6">
      {/* 1. Header & Filter Bar */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-5 pb-5 border-b border-[#1E293B]">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono text-[10px] font-bold tracking-wider uppercase">
            <Radio className="w-3 h-3 text-blue-400 animate-pulse" />
            <span>GIS SPATIAL INTELLIGENCE & PATROL RADAR</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <MapPin className="w-5 h-5 text-blue-400 shrink-0" />
            <span>Hotspot Vector Map & OpenStreetMap GIS</span>
          </h2>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            Database-synchronized patrol radar, geocoded incident markers, and active case coordinates across the Mumbai metropolitan grid.
          </p>
        </div>

        {/* Crime Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {crimeCategories.map((filter) => {
            const countInSector =
              filter === 'ALL'
                ? allSectorCrimes.length
                : allSectorCrimes.filter((c) => c.crimeType.toLowerCase().includes(filter.toLowerCase())).length;

            const isActive = activeFilter === filter;

            return (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150 flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 border border-blue-500'
                    : 'bg-[#0F172A] text-slate-400 border border-[#1E293B] hover:text-white hover:border-slate-600'
                }`}
              >
                <span>{filter}</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-blue-800 text-blue-100' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {countInSector}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Responsive 2-Column Layout: Left Map (65-70%), Right Sector Inspector (30-35%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: Interactive OpenStreetMap with Status Overlays */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col space-y-3">
          <div className="relative bg-[#0B1120] border border-[#1E293B] rounded-2xl overflow-hidden shadow-inner h-[400px] sm:h-[480px] lg:h-[580px] w-full z-0">
            {/* Top Overlay Badges on Map */}
            <div className="absolute top-3 left-3 z-[400] flex flex-wrap gap-2 pointer-events-none">
              <div className="bg-[#0F172A]/90 backdrop-blur-md border border-[#1E293B] px-3 py-1 rounded-xl text-[11px] font-mono text-slate-300 flex items-center gap-2 shadow-lg">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-semibold text-white">
                  {selectedSector ? `${selectedSector.code} ${selectedSector.name.split(' ')[0].toUpperCase()} RADAR` : 'MUMBAI METRO RADAR'}
                </span>
              </div>
              <div className="bg-[#0F172A]/90 backdrop-blur-md border border-[#1E293B] px-3 py-1 rounded-xl text-[11px] font-mono text-blue-400 flex items-center gap-1.5 shadow-lg">
                <Crosshair className="w-3.5 h-3.5 text-blue-400" />
                <span>
                  {mappedMarkers.length} of {allSectorCrimes.length} Incidents Mapped
                </span>
              </div>
            </div>

            <MapContainer
              center={currentCenterCoords}
              zoom={12}
              scrollWheelZoom={true}
              style={{ width: '100%', height: '100%' }}
              className="z-0"
            >
              {/* Dynamic Viewport Controller that flies and frames bounds automatically */}
              <MapViewController
                markers={mappedMarkers}
                fallbackCenter={currentCenterCoords}
                sectorKey={selectedSector?.id || 'all'}
                filterKey={activeFilter}
                selectedCrimeId={selectedIncident?.id}
              />

              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              />

              {mappedMarkers.map(({ crime, position }) => {
                const isSelected = selectedIncident?.id === crime.id;
                const lat = position[0].toFixed(5);
                const lng = position[1].toFixed(5);
                const landmark = crime.landmark || crime.coordinates?.landmark || 'Municipal Area';
                const station = crime.nearestPoliceStation || crime.coordinates?.nearestStation || 'Local Division';

                return (
                  <Marker
                    key={crime.id}
                    position={position}
                    icon={isSelected ? selectedMarkerIcon : customMarkerIcon}
                    eventHandlers={{
                      click: () => setSelectedIncident(crime),
                    }}
                  >
                    <Popup>
                      <div className="p-1 space-y-2 text-slate-100 font-sans min-w-[240px]">
                        <div className="flex items-center justify-between border-b border-slate-700/60 pb-1.5">
                          <span className="font-mono font-bold text-xs text-blue-400">{crime.caseNumber}</span>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                            {crime.crimeType}
                          </span>
                        </div>

                        <div>
                          <div className="font-semibold text-xs text-white leading-tight">{crime.title}</div>
                          <div className="text-[11px] text-slate-400 mt-1 flex items-start gap-1">
                            <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                            <span className="leading-snug">{crime.locationAddress || crime.district}</span>
                          </div>
                        </div>

                        <div className="p-2 bg-slate-900/80 rounded-lg space-y-1 text-[10px] font-mono text-slate-300 border border-slate-800">
                          <div className="flex justify-between">
                            <span className="text-slate-500">LANDMARK:</span>
                            <span className="text-slate-200 truncate max-w-[140px]">{landmark}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">STATION:</span>
                            <span className="text-slate-200 truncate max-w-[140px]">{station}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">COORDS:</span>
                            <span className="text-blue-400">{lat}, {lng}</span>
                          </div>
                        </div>

                        <div className="flex gap-2 pt-1">
                          <a
                            href={`https://www.google.com/maps?q=${position[0]},${position[1]}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 text-[11px] font-semibold py-1.5 px-2 rounded-lg flex items-center justify-center gap-1 transition-colors cursor-pointer"
                          >
                            <Navigation className="w-3 h-3 text-blue-400" />
                            <span>Open in Maps</span>
                          </a>
                          <button
                            onClick={() => onSelectCrime(crime)}
                            className="flex-1 bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-semibold py-1.5 px-2 rounded-lg flex items-center justify-center gap-1 transition-colors cursor-pointer"
                          >
                            <Eye className="w-3 h-3" />
                            <span>Dossier</span>
                          </button>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
          </div>

          {/* Quick sector selector tabs under the map */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider whitespace-nowrap pl-1 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-blue-400" />
              Focus Sector:
            </span>
            {hotspots.map((sector) => {
              const isSelected = selectedSector?.id === sector.id;
              const sectorIncidentCount = crimeRecords.filter((c) => isCrimeInSector(c, sector)).length;

              return (
                <button
                  key={sector.id}
                  onClick={() => setSelectedSector(sector)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold whitespace-nowrap transition-all duration-150 flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 border border-blue-500 ring-2 ring-blue-400/30'
                      : 'bg-[#0F172A] text-slate-400 border border-[#1E293B] hover:text-white hover:border-slate-700'
                  }`}
                >
                  <span className="font-bold">{sector.code}</span>
                  <span className="text-[11px] opacity-80">{sector.name.split(' ')[0]}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isSelected ? 'bg-blue-800 text-blue-100' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {sectorIncidentCount}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Sector Information & Statistics Dossier Card */}
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col bg-[#0F172A] border border-[#1E293B] rounded-2xl p-5 sm:p-6 space-y-5 justify-between">
          {selectedSector ? (
            <div className="space-y-5 flex-1 flex flex-col justify-between">
              {/* Sector Header */}
              <div className="space-y-2 border-b border-[#1E293B] pb-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-md border border-blue-500/20">
                    {selectedSector.code}
                  </span>
                  <span
                    className={`text-xs font-mono font-bold px-2.5 py-1 rounded-md border ${
                      riskBadgeStyles[selectedSector.riskLevel]?.badge || 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {selectedSector.riskLevel} RISK
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight leading-tight">{selectedSector.name}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Municipal Crime District & Surveillance Sector</p>
                </div>
              </div>

              {/* Statistics Metric Blocks: 2x2 Grid Synchronized with Database Records */}
              <div className="grid grid-cols-2 gap-3">
                {/* Total Incidents vs Mapped */}
                <div className="p-3.5 bg-[#111827] border border-[#1E293B] rounded-xl space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">INCIDENTS</span>
                    <Activity className="w-3.5 h-3.5 text-blue-400" />
                  </div>
                  <div className="text-2xl font-black text-white font-mono">{allSectorCrimes.length}</div>
                  <span className="text-[10px] text-blue-400 block font-mono">
                    {mappedMarkers.length} Mapped on GPS
                  </span>
                </div>

                {/* Patrol Units */}
                <div className="p-3.5 bg-[#111827] border border-[#1E293B] rounded-xl space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">PATROL UNITS</span>
                    <Shield className="w-3.5 h-3.5 text-blue-400" />
                  </div>
                  <div className="text-2xl font-black text-blue-400 font-mono">{activePatrolUnits} Units</div>
                  <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Active On Duty
                  </span>
                </div>
              </div>

              {/* Primary Crime Driver Card (Computed Dynamically from Database Records) */}
              <div className="p-3.5 bg-[#111827] border border-[#1E293B] rounded-xl space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">PRIMARY CRIME DRIVER</span>
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <div className="text-sm font-bold text-white flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="leading-snug">{dynamicPrimaryCrimeDriver}</span>
                </div>
              </div>

              {/* Dedicated Patrol Location Card for Selected Incident */}
              {selectedIncident && (
                <div className="p-3.5 bg-[#111827] border border-blue-500/30 rounded-xl space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-blue-400 flex items-center gap-1">
                      <Compass className="w-3.5 h-3.5 text-blue-400" />
                      PATROL LOCATION DOSSIER
                    </span>
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20">
                      {selectedIncident.caseNumber}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs">
                    <div className="font-bold text-white truncate">{selectedIncident.title}</div>
                    <div className="text-[11px] text-slate-300 flex items-start gap-1">
                      <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                      <span className="leading-snug">{selectedIncident.locationAddress}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-slate-300 pt-1 border-t border-[#1E293B]">
                    <div>
                      <span className="text-slate-500 block">LANDMARK:</span>
                      <span className="text-slate-200 truncate block">
                        {selectedIncident.landmark || selectedIncident.coordinates?.landmark || 'Sector Perimeter'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">STATION:</span>
                      <span className="text-slate-200 truncate block">
                        {selectedIncident.nearestPoliceStation || selectedIncident.coordinates?.nearestStation || 'Local Precinct'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] font-mono text-slate-400">
                      COORDS: {(selectedIncident.latitude ?? selectedIncident.coordinates?.lat ?? 19.076).toFixed(4)}, {(selectedIncident.longitude ?? selectedIncident.coordinates?.lng ?? 72.877).toFixed(4)}
                    </span>
                    <a
                      href={`https://www.google.com/maps?q=${selectedIncident.latitude ?? selectedIncident.coordinates?.lat ?? 19.076},${selectedIncident.longitude ?? selectedIncident.coordinates?.lng ?? 72.877}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 text-[10px] font-semibold rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Navigation className="w-3 h-3 text-blue-400" />
                      <span>Open in Maps</span>
                    </a>
                  </div>
                </div>
              )}

              {/* Active Sector Cases List */}
              <div className="space-y-2.5 pt-2 border-t border-[#1E293B]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-blue-400" />
                    Active Sector Cases ({visibleCrimes.length})
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {activeFilter === 'ALL' ? 'All Types' : activeFilter}
                  </span>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                  {visibleCrimes.length > 0 ? (
                    visibleCrimes.map((crime) => {
                      const isSelected = selectedIncident?.id === crime.id;
                      return (
                        <div
                          key={crime.id}
                          onClick={() => setSelectedIncident(crime)}
                          className={`p-3 rounded-xl cursor-pointer transition-all duration-150 space-y-1.5 border ${
                            isSelected
                              ? 'bg-blue-600/15 border-blue-500/60 shadow-sm'
                              : 'bg-[#111827] hover:bg-slate-800/80 border-[#1E293B] hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-mono font-bold text-xs text-blue-400">
                              {crime.caseNumber}
                            </span>
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#0F172A] text-slate-300 border border-[#1E293B]">
                              {crime.crimeType}
                            </span>
                          </div>
                          <div className="text-xs font-semibold text-white truncate">
                            {crime.title}
                          </div>
                          <div className="flex items-center justify-between text-[11px] text-slate-400">
                            <span className="truncate max-w-[180px]">{crime.locationAddress}</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onSelectCrime(crime);
                              }}
                              className="text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1 text-[10px] cursor-pointer"
                            >
                              Dossier <ExternalLink className="w-2.5 h-2.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-6 bg-[#111827] border border-[#1E293B] rounded-xl text-center space-y-1">
                      <SearchX className="w-5 h-5 text-slate-500 mx-auto" />
                      <div className="text-xs font-semibold text-slate-300">No Incidents Mapped</div>
                      <div className="text-[11px] text-slate-500">
                        No {activeFilter === 'ALL' ? '' : `${activeFilter} `}cases registered in {selectedSector.code}.
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-slate-400">
              Select a sector to inspect live telemetry metrics.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

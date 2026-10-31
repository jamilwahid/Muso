import React, { useEffect, useMemo, useRef, useState } from 'react';
import { LocateFixed, MapPin, Minus, Plus } from 'lucide-react';
import { Center } from '../types/center';

interface MapViewProps {
  centers: Center[];
  selectedCenterId: string | null;
  halalOnly: boolean;
  onSelectCenter: (centerId: string) => void;
}

interface Coordinates {
  lat: number;
  lng: number;
}

interface Tile {
  x: number;
  y: number;
  left: number;
  top: number;
}

interface MarkerGroup {
  centers: Center[];
  x: number;
  y: number;
  lat: number;
  lng: number;
}

const TILE_SIZE = 256;
const DEFAULT_CENTER: Coordinates = { lat: 43.70, lng: -79.39 };
const DEFAULT_ZOOM = 10;
const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

const project = ({ lat, lng }: Coordinates, zoom: number) => {
  const scale = TILE_SIZE * 2 ** zoom;
  const safeLat = clamp(lat, -85.0511, 85.0511) * Math.PI / 180;
  return {
    x: (lng + 180) / 360 * scale,
    y: (1 - Math.log(Math.tan(safeLat) + 1 / Math.cos(safeLat)) / Math.PI) / 2 * scale
  };
};

const unproject = (x: number, y: number, zoom: number): Coordinates => {
  const scale = TILE_SIZE * 2 ** zoom;
  const lng = x / scale * 360 - 180;
  const n = Math.PI - 2 * Math.PI * y / scale;
  const lat = 180 / Math.PI * Math.atan(Math.sinh(n));
  return { lat: clamp(lat, -85.0511, 85.0511), lng };
};

const hasCoordinates = (center: Center) =>
  Number.isFinite(center.location.latitude) && Number.isFinite(center.location.longitude);

export const MapView: React.FC<MapViewProps> = ({ centers, selectedCenterId, halalOnly, onSelectCenter }) => {
  const mapElement = useRef<HTMLDivElement>(null);
  const dragStart = useRef<{ pointerId: number; x: number; y: number; center: Coordinates } | null>(null);
  const [size, setSize] = useState({ width: 800, height: 560 });
  const [mapCenter, setMapCenter] = useState(DEFAULT_CENTER);
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);

  const centerCount = centers.length;
  const centerWithoutSelection = centers.find(center => center.center_id === selectedCenterId);

  useEffect(() => {
    const element = mapElement.current;
    if (!element) return;
    const observer = new ResizeObserver(entries => {
      const rect = entries[0]?.contentRect;
      if (rect) setSize({ width: Math.max(1, rect.width), height: Math.max(1, rect.height) });
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const selectedCenter = centers.find(center => center.center_id === selectedCenterId);
    if (selectedCenter && hasCoordinates(selectedCenter)) {
      setMapCenter({
        lat: selectedCenter.location.latitude as number,
        lng: selectedCenter.location.longitude as number
      });
      setZoom(current => Math.max(current, 13));
    }
  }, [centers, selectedCenterId]);

  const centerWorld = project(mapCenter, zoom);

  const tiles = useMemo(() => {
    const minX = Math.floor((centerWorld.x - size.width / 2) / TILE_SIZE) - 1;
    const maxX = Math.floor((centerWorld.x + size.width / 2) / TILE_SIZE) + 1;
    const minY = Math.max(0, Math.floor((centerWorld.y - size.height / 2) / TILE_SIZE) - 1);
    const maxY = Math.min(2 ** zoom - 1, Math.floor((centerWorld.y + size.height / 2) / TILE_SIZE) + 1);
    const result: Tile[] = [];

    for (let x = minX; x <= maxX; x += 1) {
      for (let y = minY; y <= maxY; y += 1) {
        const wrappedX = ((x % 2 ** zoom) + 2 ** zoom) % 2 ** zoom;
        result.push({
          x: wrappedX,
          y,
          left: size.width / 2 + x * TILE_SIZE - centerWorld.x,
          top: size.height / 2 + y * TILE_SIZE - centerWorld.y
        });
      }
    }
    return result;
  }, [centerWorld.x, centerWorld.y, size.height, size.width, zoom]);

  const markers = useMemo(() => {
    const groups = new Map<string, MarkerGroup>();
    for (const center of centers) {
      if (!hasCoordinates(center)) continue;
      const lat = center.location.latitude as number;
      const lng = center.location.longitude as number;
      const point = project({ lat, lng }, zoom);
      const x = size.width / 2 + point.x - centerWorld.x;
      const y = size.height / 2 + point.y - centerWorld.y;
      if (x < -30 || x > size.width + 30 || y < -30 || y > size.height + 30) continue;

      const key = `${Math.floor(x / 42)}:${Math.floor(y / 42)}`;
      const group = groups.get(key);
      if (group) {
        group.centers.push(center);
        group.x = group.centers.reduce((sum, item) => {
          const projected = project({ lat: item.location.latitude as number, lng: item.location.longitude as number }, zoom);
          return sum + size.width / 2 + projected.x - centerWorld.x;
        }, 0) / group.centers.length;
        group.y = group.centers.reduce((sum, item) => {
          const projected = project({ lat: item.location.latitude as number, lng: item.location.longitude as number }, zoom);
          return sum + size.height / 2 + projected.y - centerWorld.y;
        }, 0) / group.centers.length;
        group.lat = group.centers.reduce((sum, item) => sum + (item.location.latitude as number), 0) / group.centers.length;
        group.lng = group.centers.reduce((sum, item) => sum + (item.location.longitude as number), 0) / group.centers.length;
      } else {
        groups.set(key, { centers: [center], x, y, lat, lng });
      }
    }
    return [...groups.values()];
  }, [centers, centerWorld.x, centerWorld.y, size.height, size.width, zoom]);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest('button')) return;
    dragStart.current = { pointerId: event.pointerId, x: event.clientX, y: event.clientY, center: mapCenter };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const start = dragStart.current;
    if (!start || start.pointerId !== event.pointerId) return;
    const startWorld = project(start.center, zoom);
    setMapCenter(unproject(
      startWorld.x - (event.clientX - start.x),
      startWorld.y - (event.clientY - start.y),
      zoom
    ));
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (dragStart.current?.pointerId === event.pointerId) dragStart.current = null;
  };

  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    setZoom(current => clamp(current + (event.deltaY < 0 ? 1 : -1), 8, 17));
  };

  const zoomBy = (step: number) => setZoom(current => clamp(current + step, 8, 17));
  const recenter = () => {
    setMapCenter(DEFAULT_CENTER);
    setZoom(DEFAULT_ZOOM);
  };

  const selectGroup = (group: MarkerGroup) => {
    if (group.centers.length > 1) {
      setMapCenter({ lat: group.lat, lng: group.lng });
      setZoom(current => clamp(current + 1, 8, 17));
    } else {
      onSelectCenter(group.centers[0].center_id);
    }
  };

  return (
    <section aria-label="Map of childcare centres" className="relative h-[42vh] min-h-[320px] overflow-hidden rounded-2xl border border-slate-200 bg-[#e7eee8] shadow-sm lg:h-full lg:min-h-[560px] lg:rounded-none lg:border-0 lg:border-r">
      <div
        ref={mapElement}
        className="absolute inset-0 cursor-grab touch-none select-none active:cursor-grabbing"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onWheel={handleWheel}
      >
        {tiles.map(tile => (
          <img
            key={`${zoom}/${tile.x}/${tile.y}`}
            src={`https://tile.openstreetmap.org/${zoom}/${tile.x}/${tile.y}.png`}
            alt=""
            draggable={false}
            className="pointer-events-none absolute h-64 w-64 max-w-none"
            style={{ left: tile.left, top: tile.top }}
          />
        ))}

        {markers.map(group => {
          const active = group.centers.some(center => center.center_id === selectedCenterId);
          const count = group.centers.length;
          return (
            <button
              key={group.centers.map(center => center.center_id).join('-')}
              type="button"
              title={count === 1 ? group.centers[0].center_name : `${count} centres here — zoom in`}
              aria-label={count === 1 ? `Select ${group.centers[0].center_name}` : `Zoom in to ${count} centres`}
              onClick={() => selectGroup(group)}
              className={`absolute z-10 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white shadow-lg transition-transform hover:scale-110 ${
                count > 1
                  ? 'h-9 min-w-9 bg-white px-2 text-xs font-bold text-emerald-900'
                  : active
                    ? 'h-10 w-10 bg-emerald-800 text-white ring-4 ring-emerald-800/20'
                    : 'h-8 w-8 bg-white text-emerald-800'
              }`}
              style={{ left: group.x, top: group.y }}
            >
              {count > 1 ? count : <MapPin className={active ? 'h-5 w-5' : 'h-4 w-4'} fill={active ? 'currentColor' : 'none'} />}
            </button>
          );
        })}
      </div>

      <div className="pointer-events-none absolute left-4 top-4 z-20 rounded-xl bg-white/95 px-4 py-3 shadow-lg backdrop-blur">
        <p className="text-sm font-bold text-slate-900">{halalOnly ? 'Halal-tagged centres' : 'All listed centres'}</p>
        <p className="mt-0.5 text-xs text-slate-600">{centerCount.toLocaleString()} in this search</p>
      </div>

      <div className="absolute right-4 top-4 z-20 flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
        <button type="button" aria-label="Zoom in" onClick={() => zoomBy(1)} className="p-2.5 text-slate-700 hover:bg-slate-50">
          <Plus className="h-4 w-4" />
        </button>
        <div className="border-t border-slate-200" />
        <button type="button" aria-label="Zoom out" onClick={() => zoomBy(-1)} className="p-2.5 text-slate-700 hover:bg-slate-50">
          <Minus className="h-4 w-4" />
        </button>
      </div>

      <button
        type="button"
        onClick={recenter}
        className="absolute bottom-9 right-4 z-20 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white/95 px-3 py-2 text-xs font-semibold text-slate-700 shadow-lg hover:bg-white"
      >
        <LocateFixed className="h-4 w-4" />
        Toronto
      </button>

      <a
        href="https://www.openstreetmap.org/copyright"
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-0 right-0 z-20 bg-white/90 px-2 py-1 text-[10px] text-slate-600"
      >
        © OpenStreetMap contributors
      </a>
    </section>
  );
};
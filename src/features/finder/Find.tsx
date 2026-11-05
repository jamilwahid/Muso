import { useEffect, useMemo, useRef, useState } from 'react';
import MapGL, { Layer, NavigationControl, Source, type MapLayerMouseEvent, type MapEvent, type MapRef } from 'react-map-gl';
import type { GeoJSONSource } from 'mapbox-gl';
import type { Center } from '../../types/center';
import data from '../../data/centers.json';
import { matchesFoodOption } from '../../utils/foodOptions';
import { choices } from './foodOptions';
import { Details } from './Details';
import { FoodFilters } from './FoodFilters';
import { Button } from '../../ui/Button';
import 'mapbox-gl/dist/mapbox-gl.css';

const centres = data as Center[];

export function Find() {
  const [option, setOption] = useState(choices[0].value);
  const [selected, setSelected] = useState<Center | null>(null);
  const [error, setError] = useState(false);
  const mapRef = useRef<MapRef>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  const token = import.meta.env.VITE_MAPBOX_TOKEN as string | undefined;
  // Mapbox paint properties need resolved colours rather than CSS var() values.
  // Read the same semantic tokens as the rest of the interface on mount.
  const [mapColors] = useState(() => {
    const styles = getComputedStyle(document.documentElement);
    const color = (name: string) => styles.getPropertyValue(name).trim();
    return { land: color('--color-map-land'), water: color('--color-map-water'), park: color('--color-map-park'), label: color('--color-map-label'), marker: color('--color-map-marker'), selected: color('--color-map-selected'), markerText: color('--color-map-marker-text'), outline: color('--color-surface') };
  });
  const filtered = useMemo(() => centres.filter(c => matchesFoodOption(c.dietary_services, option)), [option]);
  const features = useMemo<GeoJSON.FeatureCollection<GeoJSON.Point>>(() => ({
    type: 'FeatureCollection',
    features: filtered.filter(c => Number.isFinite(c.location.latitude) && Number.isFinite(c.location.longitude)).map(c => ({
      type: 'Feature', geometry: { type: 'Point', coordinates: [c.location.longitude!, c.location.latitude!] }, properties: { id: c.center_id },
    })),
  }), [filtered]);
  const closeDetails = () => { setSelected(null); previousFocus.current?.focus(); previousFocus.current = null; };
  const openDetails = (centre: Center) => { previousFocus.current = document.activeElement as HTMLElement; setSelected(centre); };
  useEffect(() => { if (selected && !filtered.some(c => c.center_id === selected.center_id)) setSelected(null); }, [filtered, selected]);
  useEffect(() => { const handler = (event: KeyboardEvent) => { if (event.key === 'Escape' && selected) closeDetails(); }; window.addEventListener('keydown', handler); return () => window.removeEventListener('keydown', handler); });
  const fallback = !token || error;
  const tintMap = (event: MapEvent) => {
    const map = event.target;
    for (const layer of map.getStyle().layers ?? []) {
      if (layer.type === 'background') map.setPaintProperty(layer.id, 'background-color', mapColors.land);
      if (layer.type === 'fill' && /(^|[-_])water($|[-_])/i.test(layer.id)) map.setPaintProperty(layer.id, 'fill-color', mapColors.water);
      if (layer.type === 'fill' && /(^|[-_])(park|grass)($|[-_])/i.test(layer.id)) map.setPaintProperty(layer.id, 'fill-color', mapColors.park);
      if (layer.type === 'symbol' && /settlement|neighbourhood/i.test(layer.id) && layer.layout?.['text-field']) map.setPaintProperty(layer.id, 'text-color', mapColors.label);
    }
  };
  const handleMapClick = (event: MapLayerMouseEvent) => {
    const feature = event.features?.[0];
    if (!feature) { setSelected(null); return; }
    if (feature.properties?.cluster) {
      const source = mapRef.current?.getSource('centres') as GeoJSONSource | undefined;
      const coordinates = (feature.geometry as GeoJSON.Point).coordinates as [number, number];
      source?.getClusterExpansionZoom(feature.properties.cluster_id, (err, zoom) => {
        if (!err && zoom != null) mapRef.current?.easeTo({ center: coordinates, zoom, duration: 450 });
      });
    } else {
      const centre = filtered.find(c => c.center_id === feature.properties?.id);
      if (centre) openDetails(centre);
    }
  };
  return <main id="main" className="find-page">
    <FoodFilters selected={option} onChange={setOption} />
    <div className="find-body">
      {fallback ? <div className="map-unavailable" role="status"><div><h1>Map unavailable</h1><p>We couldn’t load the map. Please try again in a moment.</p>{token && <Button onClick={() => setError(false)}>Try again</Button>}</div></div> :
        <div className="map-area"><h1 className="visually-hidden">Find childcare in Toronto</h1><div className="keyboard-picker"><label htmlFor="accessible-centre">Choose a centre</label><select id="accessible-centre" value={selected?.center_id ?? ''} onChange={event => { const centre = filtered.find(item => item.center_id === event.target.value); if (centre) { openDetails(centre); if (centre.location.latitude != null && centre.location.longitude != null) mapRef.current?.easeTo({ center: [centre.location.longitude, centre.location.latitude], zoom: 15, duration: 450 }); } }}><option value="">Choose a centre</option>{filtered.map(centre => <option key={centre.center_id} value={centre.center_id}>{centre.center_name} — {centre.location.address}</option>)}</select></div><MapGL ref={mapRef} initialViewState={{ longitude: -79.3832, latitude: 43.6532, zoom: 10.5 }} mapStyle="mapbox://styles/mapbox/light-v11" mapboxAccessToken={token} onLoad={tintMap} onError={() => setError(true)} interactiveLayerIds={['clusters', 'centre-points']} onClick={handleMapClick} onMouseEnter={event => { if (event.features?.length) event.target.getCanvas().style.cursor = 'pointer'; }} onMouseLeave={event => { event.target.getCanvas().style.cursor = ''; }} style={{ width: '100%', height: '100%' }}><NavigationControl position="bottom-right" showCompass={false}/><Source id="centres" type="geojson" data={features} cluster clusterMaxZoom={14} clusterRadius={45}><Layer id="clusters" type="circle" filter={['has', 'point_count']} paint={{ 'circle-color': mapColors.marker, 'circle-radius': ['step', ['get', 'point_count'], 16, 10, 19, 50, 22], 'circle-stroke-width': 2, 'circle-stroke-color': mapColors.outline }}/><Layer id="cluster-count" type="symbol" filter={['has', 'point_count']} layout={{ 'text-field': ['get', 'point_count_abbreviated'], 'text-size': 12 }} paint={{ 'text-color': mapColors.markerText }}/><Layer id="centre-points" type="circle" filter={['!', ['has', 'point_count']]} paint={{ 'circle-color': ['case', ['==', ['get', 'id'], selected?.center_id ?? ''], mapColors.selected, mapColors.marker], 'circle-radius': ['case', ['==', ['get', 'id'], selected?.center_id ?? ''], 11, 8], 'circle-stroke-width': 2, 'circle-stroke-color': mapColors.outline }}/></Source></MapGL></div>}
      {selected && <Details center={selected} close={closeDetails}/>}
    </div>
  </main>;
}

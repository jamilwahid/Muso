import type { Center } from '../types/center';

/** Group markers into stable world-pixel cells at broad zoom levels. */
export function clusterCenters(centers: Center[], zoom: number, mobile: boolean): Center[][] {
  if (!mobile || zoom >= 17) return centers.map(center => [center]);
  const cellSize = 80;
  const scale = 512 * Math.pow(2, Math.floor(zoom));
  const groups = new Map<string, Center[]>();
  for (const center of centers) {
    const longitude = center.location.longitude!;
    const latitude = Math.max(-85, Math.min(85, center.location.latitude!));
    const sin = Math.sin(latitude * Math.PI / 180);
    const x = (longitude + 180) / 360 * scale;
    const y = (0.5 - Math.log((1 + sin) / (1 - sin)) / (4 * Math.PI)) * scale;
    const key = `${Math.floor(x / cellSize)}:${Math.floor(y / cellSize)}`;
    const group = groups.get(key) || [];
    group.push(center);
    groups.set(key, group);
  }
  return [...groups.values()];
}

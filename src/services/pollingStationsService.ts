import { haversineKm, estimateDriveMinutes, estimateWalkMinutes } from '../utils/geo';

/**
 * Interface representing a user's geographical position.
 */
interface UserPosition {
  lat: number;
  lng: number;
}

/**
 * Interface representing a polling station and its related metrics.
 */
export interface PollingStation {
  id: string;
  name: string;
  type: string;
  address: string;
  lat: number;
  lng: number;
  distanceKm: number;
  driveMinutes: number;
  walkMinutes: number;
}

/**
 * OSM Overpass API element structure
 */
interface OverpassElement {
  type: string;
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
}

/**
 * Classifies an OSM element into a polling station type label.
 */
function classifyType(tags: Record<string, string>): string {
  if (tags.amenity === 'school' || tags.amenity === 'college') return 'School / College';
  if (tags.amenity === 'community_centre') return 'Community Centre';
  if (tags.amenity === 'townhall') return 'Town Hall';
  if (tags.amenity === 'library') return 'Public Library';
  if (tags.amenity === 'place_of_worship') return 'Place of Worship';
  if (tags.building === 'government' || tags.government) return 'Government Building';
  if (tags.amenity === 'public_building') return 'Public Building';
  return 'Polling Centre';
}

/**
 * Builds a human-readable address from OSM tags.
 */
function buildAddress(tags: Record<string, string>): string {
  const parts: string[] = [];
  if (tags['addr:housenumber']) parts.push(tags['addr:housenumber']);
  if (tags['addr:street']) parts.push(tags['addr:street']);
  if (tags['addr:suburb'] || tags['addr:neighbourhood']) {
    parts.push(tags['addr:suburb'] || tags['addr:neighbourhood']);
  }
  if (tags['addr:city']) parts.push(tags['addr:city']);
  return parts.length > 0 ? parts.join(', ') : 'Address unavailable';
}

/**
 * Fetches real nearby polling-eligible buildings using the OpenStreetMap Overpass API.
 * Targets schools, community centres, town halls, libraries, and government buildings
 * within a ~3 km radius of the user.
 *
 * @param userPosition - The current position of the user.
 * @returns Sorted list of real nearby polling stations (max 6).
 */
export async function fetchRealPollingStations(userPosition: UserPosition): Promise<PollingStation[]> {
  const { lat, lng } = userPosition;
  const radius = 3000; // metres

  // Overpass QL query — fetch schools, community centres, town halls, libraries, government buildings
  const query = `
    [out:json][timeout:20];
    (
      node["amenity"~"school|college|community_centre|townhall|library|public_building"](around:${radius},${lat},${lng});
      way["amenity"~"school|college|community_centre|townhall|library|public_building"](around:${radius},${lat},${lng});
      node["building"="government"](around:${radius},${lat},${lng});
      way["building"="government"](around:${radius},${lat},${lng});
    );
    out center tags;
  `;

  const response = await fetch('https://overpass-api.de/api/interpreter', {
    method: 'POST',
    body: `data=${encodeURIComponent(query)}`,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });

  if (!response.ok) throw new Error('Overpass API request failed');

  const data: { elements: OverpassElement[] } = await response.json();

  const stations: PollingStation[] = data.elements
    .filter((el) => {
      // must have coordinates
      const hasCoords = (el.lat !== undefined && el.lon !== undefined) ||
        (el.center !== undefined);
      if (!hasCoords) return false;
      // must have a name
      const tags = el.tags ?? {};
      return Boolean(tags.name);
    })
    .map((el, index) => {
      const tags = el.tags ?? {};
      const stationLat = el.lat ?? el.center!.lat;
      const stationLng = el.lon ?? el.center!.lon;
      const distanceKm = haversineKm(lat, lng, stationLat, stationLng);

      return {
        id: `osm-${el.id}`,
        name: tags.name || `Polling Station ${index + 1}`,
        type: classifyType(tags),
        address: buildAddress(tags),
        lat: stationLat,
        lng: stationLng,
        distanceKm,
        driveMinutes: estimateDriveMinutes(distanceKm),
        walkMinutes: estimateWalkMinutes(distanceKm),
      };
    })
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, 6); // top 6 nearest

  return stations;
}

/**
 * Fallback: builds mock polling station data relative to the user's position.
 * Used only when the Overpass API is unavailable.
 */
export function buildPollingStations(userPosition: UserPosition): PollingStation[] {
  const { lat, lng } = userPosition;

  const FALLBACK_STATIONS = [
    { name: 'City Hall',             delta: [0.006,  0.008],  type: 'Town Hall',        id: 'p1' },
    { name: 'Community Center',      delta: [-0.009, 0.004],  type: 'Community Centre', id: 'p2' },
    { name: 'Public Library',        delta: [0.004, -0.010],  type: 'Public Library',   id: 'p3' },
    { name: 'Riverside High School', delta: [-0.006, -0.007], type: 'School / College', id: 'p4' },
    { name: 'Greenway Rec Center',   delta: [0.010,  0.002],  type: 'Community Centre', id: 'p5' },
  ];

  return FALLBACK_STATIONS.map((offset) => {
    const stationLat = lat + offset.delta[0];
    const stationLng = lng + offset.delta[1];
    const distanceKm = haversineKm(lat, lng, stationLat, stationLng);

    return {
      id: offset.id,
      name: offset.name,
      type: offset.type,
      address: 'Address unavailable',
      lat: stationLat,
      lng: stationLng,
      distanceKm,
      driveMinutes: estimateDriveMinutes(distanceKm),
      walkMinutes: estimateWalkMinutes(distanceKm),
    };
  }).sort((a, b) => a.distanceKm - b.distanceKm);
}

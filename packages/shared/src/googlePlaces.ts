import type { LawnAnalysis, StoreOption } from "./types";
import type { StorePoolKey } from "./places";
import { mergeLiveStoresIntoAnalysis, STORE_POOL_QUERIES } from "./places";

interface LatLng {
  lat: number;
  lng: number;
}

interface GeocodeResponse {
  results?: Array<{ geometry: { location: LatLng } }>;
  status: string;
  error_message?: string;
}

interface TextSearchResult {
  name: string;
  formatted_address?: string;
  geometry?: { location: LatLng };
  place_id?: string;
  opening_hours?: { open_now?: boolean };
  business_status?: string;
}

interface TextSearchResponse {
  results?: TextSearchResult[];
  status: string;
  error_message?: string;
}

const EARTH_RADIUS_MI = 3958.8;

export function haversineMiles(a: LatLng, b: LatLng): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_MI * Math.asin(Math.sqrt(h));
}

export function formatDistanceMiles(miles: number): string {
  if (miles < 0.15) return "< 0.2 mi";
  return `~${miles.toFixed(1)} mi`;
}

export async function geocodeUsZip(
  zipCode: string,
  apiKey: string,
): Promise<LatLng> {
  const url = new URL("https://maps.googleapis.com/maps/api/geocode/json");
  url.searchParams.set(
    "components",
    `postal_code:${zipCode}|country:US`,
  );
  url.searchParams.set("key", apiKey);

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Geocoding failed (${res.status})`);

  const data = (await res.json()) as GeocodeResponse;
  if (data.status !== "OK" || !data.results?.[0]) {
    throw new Error(data.error_message ?? `Geocoding status: ${data.status}`);
  }

  return data.results[0].geometry.location;
}

function toStoreOption(
  place: TextSearchResult,
  origin: LatLng,
): StoreOption | null {
  if (!place.geometry?.location || !place.name) return null;
  if (place.business_status === "CLOSED_PERMANENTLY") return null;

  const miles = haversineMiles(origin, place.geometry.location);
  const notes =
    place.opening_hours?.open_now === true
      ? "Open now (per Google Maps)"
      : place.opening_hours?.open_now === false
        ? "May be closed now — check hours"
        : undefined;

  return {
    store_name: place.name,
    distance: formatDistanceMiles(miles),
    address_hint: place.formatted_address,
    notes,
    place_id: place.place_id,
    maps_url: place.place_id
      ? `https://www.google.com/maps/place/?q=place_id:${place.place_id}`
      : undefined,
  };
}

export async function searchStoresNearZip(
  zipCode: string,
  query: string,
  apiKey: string,
  origin?: LatLng,
): Promise<StoreOption[]> {
  const center = origin ?? (await geocodeUsZip(zipCode, apiKey));

  const url = new URL("https://maps.googleapis.com/maps/api/place/textsearch/json");
  url.searchParams.set("query", `${query} near ${zipCode}`);
  url.searchParams.set("key", apiKey);

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Places search failed (${res.status})`);

  const data = (await res.json()) as TextSearchResponse;
  if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
    throw new Error(data.error_message ?? `Places status: ${data.status}`);
  }

  return (data.results ?? [])
    .map((place) => toStoreOption(place, center))
    .filter((store): store is StoreOption => store !== null)
    .slice(0, 5);
}

export async function fetchStorePoolsForZip(
  zipCode: string,
  apiKey: string,
): Promise<Partial<Record<StorePoolKey, StoreOption[]>>> {
  const origin = await geocodeUsZip(zipCode, apiKey);
  const keys = Object.keys(STORE_POOL_QUERIES) as StorePoolKey[];

  const entries = await Promise.all(
    keys.map(async (key) => {
      const stores = await searchStoresNearZip(
        zipCode,
        STORE_POOL_QUERIES[key],
        apiKey,
        origin,
      );
      return [key, stores] as const;
    }),
  );

  return Object.fromEntries(entries);
}

export async function enrichAnalysisWithLiveStores(
  analysis: LawnAnalysis,
  zipCode: string,
  apiKey: string,
): Promise<LawnAnalysis> {
  const pools = await fetchStorePoolsForZip(zipCode, apiKey);
  return mergeLiveStoresIntoAnalysis(analysis, pools);
}

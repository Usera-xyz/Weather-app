import type { GeocodingResponse } from "$lib/types/weather.types";

const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";

export async function searchCity(
  name: string,
  signal?: AbortSignal
): Promise<GeocodingResponse> {
  if (!name.trim()) {
    throw new Error("City name cannot be empty");
  }

  const url = `${GEOCODING_URL}?name=${encodeURIComponent(name.trim())}&count=1&language=es&format=json`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);
  const finalSignal = signal || controller.signal;

  try {
    const res = await fetch(url, { signal: finalSignal });
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`Geocoding API error: ${res.status}`);
    }

    return await res.json();
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      throw new Error("Timeout exceeded for city search");
    }
    throw err;
  }
}

export async function reverseGeocode(
  lat: number,
  lon: number,
  signal?: AbortSignal
): Promise<string | null> {
  const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=es`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);
  const finalSignal = signal || controller.signal;

  try {
    const res = await fetch(url, { signal: finalSignal });
    clearTimeout(timeoutId);
    if (!res.ok) return null;
    const data = await res.json();
    return data.city || data.locality || data.principalSubdivision || null;
  } catch {
    return null;
  }
}
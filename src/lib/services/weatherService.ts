import type { WeatherResponse } from "$lib/types/weather.types";

const WEATHER_URL = "https://api.open-meteo.com/v1/forecast";

export async function getWeather(
  lat: number,
  lon: number,
  signal?: AbortSignal
): Promise<WeatherResponse> {
  if (typeof lat !== "number" || typeof lon !== "number" || isNaN(lat) || isNaN(lon)) {
    throw new Error("Invalid coordinates");
  }

  const params = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lon.toString(),
    current: "temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,uv_index",
    timezone: "auto"
  });

  const url = `${WEATHER_URL}?${params.toString()}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);
  const finalSignal = signal || controller.signal;

  try {
    const res = await fetch(url, { signal: finalSignal });
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`Weather API error: ${res.status}`);
    }

    const data = await res.json();
    if (!data.current || typeof data.current.temperature_2m !== "number" || !data.current.time) {
      throw new Error("Incomplete weather data");
    }

    return {
      current: {
        time: data.current.time,
        temperature_2m: data.current.temperature_2m,
        apparent_temperature: data.current.apparent_temperature,
        relative_humidity_2m: data.current.relative_humidity_2m,
        wind_speed_10m: data.current.wind_speed_10m,
        uv_index: data.current.uv_index,
      }
    };
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      throw new Error("Request timeout");
    }
    throw err;
  }
}
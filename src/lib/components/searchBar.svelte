<script lang="ts">
  import { searchCity, reverseGeocode } from "$lib/services/geocodingService";
  import { getWeather } from "$lib/services/weatherService";
  import type { WeatherResponse } from "$lib/types/weather.types";

  let { onweather }: { onweather?: (data: { city: string; weather: WeatherResponse }) => void } = $props();

  let city = $state<string>("");
  let loading = $state<boolean>(false);
  let error = $state<string>("");
  let abortController: AbortController | null = null;
  let debounceTimer: ReturnType<typeof setTimeout> | null = null;

  async function performSearch(searchCityName?: string) {
    const trimmedCity = (searchCityName ?? city).trim();
    if (!trimmedCity) {
      error = "Write a city name";
      return;
    }

    if (abortController) abortController.abort();
    abortController = new AbortController();

    loading = true;
    error = "";

    try {
      const geo = await searchCity(trimmedCity, abortController.signal);
      if (!geo.results || geo.results.length === 0) {
        error = "City not found";
        return;
      }
      const { latitude, longitude, name } = geo.results[0];
      const weather = await getWeather(latitude, longitude, abortController.signal);
      onweather?.({ city: name, weather });
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;
      error = err instanceof Error ? err.message : "Error obtaining weather";
    } finally {
      loading = false;
      abortController = null;
    }
  }

  async function handleGPS() {
    if (!navigator.geolocation) {
      error = "Geolocation is not supported";
      return;
    }
    if (abortController) abortController.abort();
    abortController = new AbortController();
    loading = true;
    error = "";

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 60000
        });
      });
      const { latitude, longitude } = position.coords;

      
      const [cityNameResult, weather] = await Promise.all([
        reverseGeocode(latitude, longitude, abortController.signal),
        getWeather(latitude, longitude, abortController.signal)
      ]);

      const cityName = cityNameResult ?? "Unknown location";
      onweather?.({ city: cityName, weather });
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;
      if (err instanceof GeolocationPositionError) {
        switch (err.code) {
          case err.PERMISSION_DENIED:
            error = "Permission denied";
            break;
          case err.POSITION_UNAVAILABLE:
            error = "Position unavailable";
            break;
          case err.TIMEOUT:
            error = "Timeout";
            break;
          default:
            error = "Error obtaining location";
        }
      } else {
        error = err instanceof Error ? err.message : "Error obtaining weather";
      }
    } finally {
      loading = false;
      abortController = null;
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault();
      if (debounceTimer) clearTimeout(debounceTimer);
      performSearch();
    }
  }

  function handleSearch() {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => performSearch(), 300);
  }
</script>

<div class="flex flex-col gap-2 p-3 bg-gray-800 rounded-xl w-full max-w-md">
  <div class="flex gap-2 flex-wrap">
    <input
      class="flex-1 min-w-[120px] p-2 rounded bg-gray-700 text-white outline-none focus:ring-2 focus:ring-blue-500"
      placeholder="Search city..."
      bind:value={city}
      onkeydown={handleKeydown}
      disabled={loading}
    />
    <button
      type="button"
      class="bg-blue-500 px-4 py-2 rounded text-white disabled:opacity-50"
      onclick={handleSearch}
      disabled={loading}
    >
      {loading ? "..." : "Search"}
    </button>
    <button
      type="button"
      class="bg-green-600 px-3 py-2 rounded text-white disabled:opacity-50 flex items-center justify-center"
      onclick={handleGPS}
      disabled={loading}
      title="Use my location"
    >
      {loading ? "..." : "📍"}
    </button>
  </div>
  {#if error}
    <p class="text-red-400 text-sm">{error}</p>
  {/if}
</div>
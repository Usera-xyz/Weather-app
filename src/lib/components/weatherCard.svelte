<script lang="ts">
  import type { WeatherResponse } from "$lib/types/weather.types";

  let { weather, cityName }: { weather: WeatherResponse; cityName: string } = $props();

  let currentTemp = $derived(weather.current.temperature_2m);
  let feelsLike = $derived(weather.current.apparent_temperature);
  let humidity = $derived(weather.current.relative_humidity_2m);
  let wind = $derived(weather.current.wind_speed_10m);
  let uv = $derived(weather.current.uv_index);
  
  // Convert to Fahrenheit
  let fahrenheit = $derived(currentTemp != null ? Math.round(currentTemp * 9/5 + 32) : null);
  let feelsLikeF = $derived(feelsLike != null ? Math.round(feelsLike * 9/5 + 32) : null);
  
  let updateTime = $derived(() => {
    if (!weather.current.time) return "Unknown time";
    const date = new Date(weather.current.time);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  });
  
  let minutesAgo = $derived(() => {
    if (!weather.current.time) return null;
    const updateDate = new Date(weather.current.time);
    const now = new Date();
    const diffMs = now.getTime() - updateDate.getTime();
    return Math.floor(diffMs / 60000);
  });
  
  let updateText = $derived(() => {
    const mins = minutesAgo();
    if (mins === null) return "";
    if (mins < 1) return "updated just now";
    if (mins < 60) return `updated ${mins} min ago`;
    const hours = Math.floor(mins / 60);
    return `updated ${hours} hour${hours > 1 ? 's' : ''} ago`;
  });
</script>

<div class="bg-blue-600 text-white p-5 rounded-xl shadow-lg w-full max-w-md text-left">
  <h2 class="text-2xl font-bold">{cityName}</h2>
  <p class="text-sm opacity-90 mt-1">Current weather</p>
  
  <p class="text-5xl font-bold mt-2">
    {currentTemp != null ? `${Math.round(currentTemp)}°C (${fahrenheit}°F)` : "--"}
  </p>
  
  <div class="grid grid-cols-2 gap-x-4 gap-y-2 mt-4 text-sm">
    {#if feelsLike != null}
      <div>Feels like: {Math.round(feelsLike)}°C ({feelsLikeF}°F)</div>
    {/if}
    {#if humidity != null}
      <div>Humidity: {humidity}%</div>
    {/if}
    {#if wind != null}
      <div>Wind: {wind} km/h</div>
    {/if}
    {#if uv != null}
      <div>UV index: {uv}</div>
    {/if}
  </div>
  
  <p class="text-xs opacity-75 mt-4">
    {updateTime()} · {updateText()}
  </p>
</div>
<script lang="ts">
  import SearchBar from "$lib/components/searchBar.svelte";
  import WeatherCard from "$lib/components/weatherCard.svelte";
  import type { WeatherResponse } from "$lib/types/weather.types";

  let weather = $state<WeatherResponse | null>(null);
  let cityName = $state<string>("");

  function handleWeather(data: { city: string; weather: WeatherResponse }) {
    cityName = data.city;
    weather = data.weather;
  }
</script>

<div class="min-h-screen flex flex-col items-center justify-center gap-6 bg-gray-900 text-white p-4">
  <SearchBar onweather={handleWeather} />

  {#if weather && cityName}
    <WeatherCard {weather} {cityName} />
  {/if}
</div>
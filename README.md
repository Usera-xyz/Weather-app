# 🌤️ Weather App – Svelte 5 + TypeScript + Tailwind CSS

A modern, fast weather application that shows real-time weather for any city or your current location. Built with **Svelte 5** (runes mode), **TypeScript**, and **Tailwind CSS**.  
It includes advanced features like debounced search, request cancellation (AbortController), GPS geolocation, reverse geocoding, and temperature in Celsius/Fahrenheit.

---

## ✨ Features

- 🔍 **City search** with debouncing (300ms) – avoids unnecessary API calls
- 📍 **GPS geolocation** – get weather at your current position with reverse geocoding (city name)
- 🌡️ **Temperature** in Celsius and Fahrenheit (both shown side by side)
- 💧 **Feels like, humidity, wind speed, UV index** – detailed weather data
- 🕒 **Update time** – shows when the data was last refreshed and how many minutes ago
- ⚡ **Fast and robust** – AbortController cancels pending requests when you search again
- 🧹 **Clean architecture** – services separated (geocoding, weather), Svelte 5 runes for state
- 📱 **Fully responsive** – works on mobile, tablet and desktop
- 🚀 **Deployed on Netlify** – using `@sveltejs/adapter-netlify`

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| [Svelte 5](https://svelte.dev/) | UI framework with runes mode |
| [TypeScript](https://www.typescriptlang.org/) | Type safety |
| [Tailwind CSS](https://tailwindcss.com/) | Styling (via `@tailwindcss/vite`) |
| [Open‑Meteo](https://open-meteo.com/) | Free weather API (no API key) |
| [Open‑Meteo Geocoding](https://open-meteo.com/en/docs/geocoding-api) | City search |
| [BigDataCloud Reverse Geocoding](https://www.bigdatacloud.com/geocoding-apis/free-reverse-geocode) | Get city name from GPS coordinates (free, no key) |
| [Netlify](https://www.netlify.com/) | Hosting + edge‑ready builds |

---

## 🧠 Advanced Implementation Details

- **Debounced search** – only triggers the API call 300ms after the user stops typing.
- **AbortController** – cancels in‑flight requests when a new search is started, avoiding race conditions.
- **Parallel requests** – for GPS: reverse geocoding and weather fetching run simultaneously (`Promise.all`).
- **Frontend caching (optional)** – you can extend it with `sessionStorage` to cache weather data for 10 minutes (not included in this version, but documented in code comments).
- **Tailwind text-left** – all content aligned to the left, no emojis, clean professional look.
- **Time ago** – shows “updated 5 min ago” using `Date` parsing from the API response.

---

## 📦 Installation & Local Development

```bash
# Clone the repository
git clone https://github.com/TU-USUARIO/weather-app.git
cd weather-app

# Install dependencies
npm install

# Start development server
npm run dev
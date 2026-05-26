export interface WeatherResponse {
  current: {
    time: string;
    temperature_2m: number;
    apparent_temperature?: number;
    relative_humidity_2m?: number;
    wind_speed_10m?: number;
    uv_index?: number;
  };
}

export interface GeocodingResponse {
  results?: Array<{
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    country: string;
    admin1?: string;
  }>;
}
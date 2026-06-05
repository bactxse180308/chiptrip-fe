import apiClient from "../client";
import type { ApiResponse } from "../types";

export interface WeatherDayForecast {
  date: string;
  condition: string | null;
  icon: string | null;
  tempMin: number | null;
  tempMax: number | null;
  humidity: number | null;
  windSpeed: number | null;
  description: string | null;
}

export interface WeatherForecastResponse {
  city: string;
  forecasts: WeatherDayForecast[];
}

export const weatherApi = {
  getForecast: async (city: string, from: string, to: string) => {
    const { data } = await apiClient.get<ApiResponse<WeatherForecastResponse>>("/weather", {
      params: { city, from, to },
    });
    return data.data;
  },
};

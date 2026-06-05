import apiClient from "../client";
import type { ApiResponse } from "../types";

export interface SuggestDestinationsPayload {
  styles: string[];
  budgetVnd: number;
  days: number;
}

export interface DestinationSuggestion {
  name: string;
  emoji: string;
  desc: string;
}

export const aiApi = {
  suggestDestinations: async (payload: SuggestDestinationsPayload) => {
    const { data } = await apiClient.post<ApiResponse<DestinationSuggestion[]>>(
      "/ai/suggest-destinations",
      payload,
      { timeout: 60_000 },
    );
    return data.data;
  },
};

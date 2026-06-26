// Shared trip view-model types. Dữ liệu thật lấy từ backend (xem integrations/api + lib/trip-mapper.ts).

export interface TripItem {
  id: string;
  time: string;
  title: string;
  desc: string;
  cost: string;
  /** Số thô VNĐ từ backend (costVnd) — single source of truth, `cost` chỉ là chuỗi hiển thị. */
  costVnd?: number;
  image: string;
  address?: string;
  lat?: number;
  lng?: number;
  rating?: number;
  tips?: string;
  bookingUrl?: string;
  bookingType?: "hotel" | "restaurant" | "attraction" | "transport" | "cafe";
  placeCacheId?: number;
}

export interface TripDay {
  day: string;
  date: string;
  items: TripItem[];
}

export interface TripPlan {
  id: string;
  destination: string;
  title: string;
  days: TripDay[];
  totalCost: string;
  rating: number;
  duration: string;
  image: string;
  tags: string[];
  dateRange: string;
}

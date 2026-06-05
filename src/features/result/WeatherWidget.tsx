import { useState, useEffect } from "react";
import { Cloud, AlertTriangle } from "lucide-react";
import { weatherApi, type WeatherDayForecast } from "@/integrations/api";

interface WeatherForecast {
  date: string;
  tempMax: number;
  tempMin: number;
  label: string;
  emoji: string;
  shouldGoIndoor: boolean;
}

interface WeatherWidgetProps {
  destination: string;
  dates: string[]; // array of date strings (sorted ascending)
}

// Map OpenWeather icon code -> emoji + "nên ở trong nhà" flag
const mapIcon = (icon: string | null): { emoji: string; indoor: boolean } => {
  const code = (icon ?? "").slice(0, 2);
  switch (code) {
    case "01": return { emoji: "☀️", indoor: false };
    case "02": return { emoji: "🌤️", indoor: false };
    case "03": return { emoji: "⛅", indoor: false };
    case "04": return { emoji: "☁️", indoor: false };
    case "09": return { emoji: "🌧️", indoor: true };
    case "10": return { emoji: "🌦️", indoor: true };
    case "11": return { emoji: "⛈️", indoor: true };
    case "13": return { emoji: "❄️", indoor: true };
    case "50": return { emoji: "🌫️", indoor: false };
    default: return { emoji: "🌡️", indoor: false };
  }
};

const toForecast = (f: WeatherDayForecast): WeatherForecast => {
  const { emoji, indoor } = mapIcon(f.icon);
  return {
    date: f.date,
    tempMax: Math.round(f.tempMax ?? 0),
    tempMin: Math.round(f.tempMin ?? 0),
    label: f.description ?? f.condition ?? "",
    emoji,
    shouldGoIndoor: indoor,
  };
};

/** Convert dd/MM/yyyy → yyyy-MM-dd. Already-ISO strings pass through unchanged. */
const toIso = (s: string): string => {
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(s)) {
    const [d, m, y] = s.split("/");
    return `${y}-${m}-${d}`;
  }
  return s;
};

const WeatherWidget = ({ destination, dates }: WeatherWidgetProps) => {
  const [forecast, setForecast] = useState<WeatherForecast[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // dates may arrive as dd/MM/yyyy from trip-mapper — normalise to yyyy-MM-dd for the API
  const isoDates = dates.map(toIso);
  const from = isoDates[0];
  const to = isoDates[isoDates.length - 1];

  useEffect(() => {
    if (!destination || !from || !to) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");
    weatherApi
      .getForecast(destination, from, to)
      .then((data) => {
        const all = (data?.forecasts ?? []).map(toForecast);
        const tripIso = new Set(isoDates);
        const filtered = all.filter((f) => tripIso.has(f.date));
        setForecast(filtered.length > 0 ? filtered : all.slice(0, isoDates.length || 3));
      })
      .catch(() => setError("Không tải được thời tiết"))
      .finally(() => setLoading(false));
  }, [destination, from, to]);

  if (loading) {
    return (
      <div className="rounded-2xl border border-border bg-card shadow-card p-5 animate-pulse">
        <div className="h-4 bg-muted rounded w-1/2 mb-3" />
        <div className="h-8 bg-muted rounded w-full" />
      </div>
    );
  }

  if (error || forecast.length === 0) return null;

  const hasRainyDay = forecast.some(f => f.shouldGoIndoor);

  return (
    <div className="rounded-2xl border border-border bg-card shadow-card p-5 space-y-3">
      <h3 className="font-display font-bold text-foreground flex items-center gap-2">
        <Cloud className="w-4 h-4 text-chip-orange" /> Thời tiết {destination}
      </h3>

      {hasRainyDay && (
        <div className="flex items-start gap-2 p-3 rounded-xl bg-chip-orange/10 border border-chip-orange/20">
          <AlertTriangle className="w-4 h-4 text-chip-orange flex-shrink-0 mt-0.5" />
          <p className="text-xs text-foreground">
            <span className="font-semibold">Cảnh báo:</span> Có ngày mưa! Chip Trip gợi ý bạn chuẩn bị áo mưa và xem xét hoạt động trong nhà.
          </p>
        </div>
      )}

      <div className="grid grid-cols-3 gap-2">
        {forecast.slice(0, 6).map(f => (
          <div
            key={f.date}
            className={`text-center p-2.5 rounded-xl border transition-all ${
              f.shouldGoIndoor
                ? "border-chip-orange/30 bg-chip-orange/5"
                : "border-border bg-muted/30"
            }`}
          >
            <p className="text-[10px] text-muted-foreground">
              {new Date(f.date).toLocaleDateString("vi-VN", { weekday: "short", day: "numeric", month: "numeric" })}
            </p>
            <span className="text-lg">{f.emoji}</span>
            <p className="text-xs font-medium text-foreground">{f.tempMax}°</p>
            <p className="text-[10px] text-muted-foreground">{f.tempMin}°</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherWidget;

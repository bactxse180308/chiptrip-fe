import { useCallback, useEffect, useMemo, useState, type ElementType } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RefreshCw, UtensilsCrossed, Hotel, Camera, Coffee, MapPin, Loader2, Star } from "lucide-react";
import { toast } from "sonner";
import type { TripItem } from "@/features/planning/trip-data";
import { getPlaceImage } from "@/features/planning/place-image";
import SafeImage from "@/components/SafeImage";
import { tripsApi } from "@/integrations/api";
import type {
  ActivityAlternativeCategory,
  ActivityAlternativeOption,
  ActivityAlternativesResponse,
  ReplaceActivityResponse,
} from "@/integrations/api/modules/trips";

const categories: Array<{ id: ActivityAlternativeCategory; label: string; icon: ElementType; emoji: string }> = [
  { id: "RESTAURANT", label: "Quán ăn", icon: UtensilsCrossed, emoji: "🍜" },
  { id: "HOTEL", label: "Khách sạn", icon: Hotel, emoji: "🏨" },
  { id: "ATTRACTION", label: "Tham quan", icon: Camera, emoji: "📸" },
  { id: "CAFE", label: "Cafe", icon: Coffee, emoji: "☕" },
  { id: "TRANSPORT", label: "Di chuyển", icon: MapPin, emoji: "🚗" },
];

interface Props {
  open: boolean;
  onClose: () => void;
  item: TripItem | null;
  previousItem?: TripItem | null;
  tripId: number | null;
  dayId: number | null;
  activityId: number | null;
  onApplied: (response: ReplaceActivityResponse) => Promise<void> | void;
}

function formatVnd(vnd: number | null | undefined): string {
  if (!vnd) return "Miễn phí";
  if (vnd >= 1_000_000) return `${(vnd / 1_000_000).toFixed(1)}M`;
  return `${Math.round(vnd / 1000)}K`;
}

function formatCredit(value: number | null | undefined): string {
  const n = Number(value ?? 0);
  return Number.isInteger(n) ? String(n) : n.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
}

function bookingTypeFromActivityType(type: string | null | undefined): TripItem["bookingType"] {
  switch (type) {
    case "ACCOMMODATION":
      return "hotel";
    case "FOOD":
      return "restaurant";
    case "TRANSPORT":
      return "transport";
    case "ATTRACTION":
      return "attraction";
    default:
      return "attraction";
  }
}

const SuggestAlternativeModal = ({ open, onClose, item, previousItem, tripId, dayId, activityId, onApplied }: Props) => {
  const [selectedCategory, setSelectedCategory] = useState<ActivityAlternativeCategory | null>(null);
  const [response, setResponse] = useState<ActivityAlternativesResponse | null>(null);
  const [alternatives, setAlternatives] = useState<ActivityAlternativeOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [replacingOptionId, setReplacingOptionId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const canCallApi = Boolean(item && tripId && dayId && activityId);
  const currentIsHotel = item?.bookingType === "hotel";
  const previousIsHotel = previousItem?.bookingType === "hotel";
  const availableCategories = useMemo(
    () => currentIsHotel
      ? categories.filter((cat) => cat.id === "HOTEL")
      : categories.filter((cat) => cat.id !== "HOTEL" || !previousIsHotel),
    [currentIsHotel, previousIsHotel]
  );

  const clearActiveSuggestions = useCallback(() => {
    setSelectedCategory(null);
    setResponse(null);
    setAlternatives([]);
    setLoading(false);
    setReplacingOptionId(null);
    setError(null);
  }, []);

  useEffect(() => {
    if (!open) return;
    setLoading(false);
    setReplacingOptionId(null);
    setError(null);

    if (!tripId || !dayId || !activityId) {
      clearActiveSuggestions();
      return;
    }

    let cancelled = false;
    tripsApi.getActivityAlternatives(tripId, dayId, activityId)
      .then((result) => {
        if (cancelled) return;
        if (!result?.sessionId || !result.category || !result.options?.length) {
          clearActiveSuggestions();
          return;
        }
        if (!availableCategories.some((cat) => cat.id === result.category)) {
          clearActiveSuggestions();
          return;
        }
        setSelectedCategory(result.category);
        setResponse(result);
        setAlternatives(result.options);
      })
      .catch(() => {
        if (!cancelled) clearActiveSuggestions();
      });

    return () => {
      cancelled = true;
    };
  }, [activityId, availableCategories, clearActiveSuggestions, dayId, open, tripId]);

  const loadAlternatives = useCallback(
    async (category: ActivityAlternativeCategory) => {
      if (!item || !tripId || !dayId || !activityId) {
        setError("Không đủ dữ liệu để đổi hoạt động. Hãy mở lịch trình đã lưu.");
        return;
      }
      setSelectedCategory(category);
      setLoading(true);
      setError(null);
      setAlternatives([]);
      try {
        const result = await tripsApi.createActivityAlternatives(tripId, dayId, activityId, {
          category,
          limit: 4,
        });
        setResponse(result);
        setAlternatives(result.options || []);
        if (!result.options?.length) {
          setError("Chưa tìm được gợi ý phù hợp. Thử loại khác.");
        }
      } catch (err: any) {
        const message = err?.response?.data?.message || "Không thể lấy gợi ý thay thế";
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    },
    [activityId, dayId, item, tripId]
  );

  const handleClose = () => {
    onClose();
  };

  const handleSelect = async (option: ActivityAlternativeOption) => {
    if (!tripId || !dayId || !activityId || !response?.sessionId) return;
    setReplacingOptionId(option.optionId);
    try {
      const result = await tripsApi.replaceActivity(tripId, dayId, activityId, {
        sessionId: response.sessionId,
        optionId: option.optionId,
      });
      await onApplied(result);
      handleClose();
    } catch (err: any) {
      const message = err?.response?.data?.message || "Không thể đổi hoạt động";
      toast.error(message);
    } finally {
      setReplacingOptionId(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(value) => { if (!value) handleClose(); }}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-chip-orange" />
            Đổi hoạt động khác
          </DialogTitle>
        </DialogHeader>

        {item && (
          <div className="space-y-4">
            <div className="bg-muted/50 rounded-xl p-3 flex items-center gap-3">
              <SafeImage
                src={item.image && item.image !== "/placeholder.svg" ? item.image : getPlaceImage(item.title, item.bookingType)}
                fallbackSrc={getPlaceImage(item.title, item.bookingType)}
                alt={item.title}
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">Đang thay thế:</p>
                <p className="font-semibold text-foreground truncate">{item.title}</p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Bạn muốn đổi sang loại nào?</p>
              <div className="grid grid-cols-2 gap-2">
                {availableCategories.map((cat) => {
                  const active = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => loadAlternatives(cat.id)}
                      disabled={!canCallApi || loading || replacingOptionId != null}
                      className={`flex items-center gap-2 p-3 rounded-xl border bg-card transition-all text-left disabled:opacity-50 ${
                        active ? "border-chip-orange shadow-warm" : "border-border hover:border-chip-orange/40 hover:shadow-warm"
                      }`}
                    >
                      <span className="text-xl">{cat.emoji}</span>
                      <span className="text-sm font-medium text-foreground">{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {response && (
              <div className="rounded-xl border border-border bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
                {response.freeSwapsRemaining > 0
                  ? `Còn ${response.freeSwapsRemaining} lượt đổi miễn phí cho lịch trình này.`
                  : `Áp dụng lựa chọn sẽ trừ ${formatCredit(response.chargeCreditsIfApplied)} credit.`}
              </div>
            )}

            {loading && (
              <div className="flex flex-col items-center py-8 gap-3">
                <Loader2 className="w-8 h-8 text-chip-orange animate-spin" />
                <p className="text-sm text-muted-foreground">AI đang tìm gợi ý theo lịch trình...</p>
              </div>
            )}

            {error && !loading && (
              <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            {!loading && alternatives.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Gợi ý thay thế:</p>
                <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
                  {alternatives.map((alt) => {
                    const bookingType = bookingTypeFromActivityType(alt.type);
                    const replacing = replacingOptionId === alt.optionId;
                    return (
                      <button
                        key={alt.optionId}
                        onClick={() => handleSelect(alt)}
                        disabled={replacingOptionId != null}
                        className="w-full flex items-start gap-3 p-3 rounded-xl border border-border bg-card hover:border-chip-orange/40 hover:shadow-warm transition-all text-left disabled:opacity-60"
                      >
                        <SafeImage
                          src={alt.imageUrl || getPlaceImage(alt.name, bookingType)}
                          fallbackSrc={getPlaceImage(alt.name, bookingType)}
                          alt={alt.name}
                          className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className="font-semibold text-foreground">{alt.name}</p>
                            <span className="text-sm font-bold text-chip-orange flex-shrink-0">{formatVnd(alt.costVnd)}</span>
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-2">{alt.description || alt.reason}</p>
                          <div className="flex items-center gap-2 mt-2 text-[11px] text-muted-foreground flex-wrap">
                            {alt.rating != null && (
                              <span className="inline-flex items-center gap-1">
                                <Star className="w-3 h-3 text-chip-yellow fill-chip-yellow" />
                                {alt.rating}{alt.reviewCount ? ` (${alt.reviewCount})` : ""}
                              </span>
                            )}
                            {alt.address && <span className="truncate max-w-[240px]">{alt.address}</span>}
                          </div>
                        </div>
                        {replacing && <Loader2 className="w-4 h-4 animate-spin text-chip-orange flex-shrink-0 mt-1" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SuggestAlternativeModal;

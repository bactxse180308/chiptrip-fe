import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion, useReducedMotion } from "framer-motion";
import { Crown, Check, ArrowRight, CalendarRange, Sparkles, Repeat, FileDown } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { paymentsApi } from "@/integrations/api";
import { closeUpgrade, useUpgradeDialog, type UpgradeReason } from "./upgradeStore";

/** Nội dung đổi theo lý do bị khoá (CREDIT_PREMIUM_SPEC.md Mục 6.2). */
const REASON_COPY: Record<UpgradeReason, { eyebrow: string; title: string; sub: string }> = {
  PREMIUM_REQUIRED: {
    eyebrow: "Hạng nhất",
    title: "Tính năng dành cho Premium",
    sub: "Đổi hoạt động bằng AI và xuất PDF mang theo — mở khoá khi bạn lên hạng.",
  },
  DAILY_TRIAL_USED: {
    eyebrow: "Hết vé hôm nay",
    title: "Bạn đã dùng lượt miễn phí hôm nay",
    sub: "Quay lại vào ngày mai, hoặc lên hạng để tạo lịch trình không phải chờ.",
  },
  LIMIT_EXCEEDED: {
    eyebrow: "Chạm trần gói Thường",
    title: "Vượt giới hạn của tài khoản thường",
    sub: "Lên hạng để mở tối đa 10 ngày mỗi chuyến và không giới hạn phong cách.",
  },
  INSUFFICIENT_PAID_CREDITS: {
    eyebrow: "Cần thêm credit",
    title: "Không đủ credit để tiếp tục",
    sub: "Nạp thêm để giữ liền mạch các tính năng Premium.",
  },
};

const PERKS = [
  { icon: CalendarRange, label: "Lịch trình tới 10 ngày" },
  { icon: Sparkles, label: "Không giới hạn phong cách" },
  { icon: Repeat, label: "Đổi hoạt động bằng AI" },
  { icon: FileDown, label: "Xuất PDF mang theo" },
];

const formatVnd = (v: number) => `${v.toLocaleString("vi-VN")}đ`;

export function UpgradeDialog() {
  const { open, reason } = useUpgradeDialog();
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const [selected, setSelected] = useState<string | null>(null);

  const { data: plans } = useQuery({
    queryKey: ["paymentPlans"],
    queryFn: paymentsApi.listPlans,
    enabled: open,
    staleTime: 10 * 60 * 1000,
  });

  // Mặc định chọn gói rẻ nhất khi danh sách về.
  useEffect(() => {
    if (plans?.length && !selected) {
      const cheapest = [...plans].sort((a, b) => a.priceVnd - b.priceVnd)[0];
      setSelected(cheapest.code);
    }
  }, [plans, selected]);

  const copy = REASON_COPY[reason ?? "PREMIUM_REQUIRED"];

  const goCheckout = () => {
    const plan = (selected ?? plans?.[0]?.code ?? "premium").toLowerCase();
    closeUpgrade();
    navigate(`/checkout?plan=${plan}`);
  };

  const goPricing = () => {
    closeUpgrade();
    navigate("/premium");
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) closeUpgrade(); }}>
      <DialogContent className="max-w-md gap-0 overflow-hidden rounded-3xl border-2 border-gold bg-card p-0 shadow-foil">
        {/* ── Stub: gold foil boarding-pass header ── */}
        <div className="relative overflow-hidden bg-foil px-6 pt-6 pb-7">
          <div className="pointer-events-none absolute inset-0 foil-sweep" aria-hidden />
          <div className="relative flex items-center justify-between">
            <span className="font-data text-[10px] uppercase tracking-[0.22em] text-gold">
              ChipTrip · {copy.eyebrow}
            </span>
            <span className="font-data text-[10px] uppercase tracking-[0.22em] text-gold/70">
              Boarding Pass
            </span>
          </div>

          <div className="relative mt-4 flex items-start gap-3">
            <motion.div
              initial={reduceMotion ? false : { scale: 0.6, rotate: -12, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 18 }}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-gold bg-chip-gold/15"
            >
              <Crown className="h-5 w-5 text-gold" />
            </motion.div>
            <div className="min-w-0 flex-1">
              <DialogTitle className="font-display text-xl font-bold leading-snug text-foreground">
                {copy.title}
              </DialogTitle>
            </div>
            <span className="stamp-gold mt-0.5 -rotate-6 select-none whitespace-nowrap px-2 py-1 font-data text-[9px] font-bold uppercase tracking-[0.18em]">
              First Class
            </span>
          </div>

          <DialogDescription className="relative mt-2 max-w-[34ch] text-sm leading-relaxed text-foreground/70">
            {copy.sub}
          </DialogDescription>
        </div>

        {/* ── Perforation between stub and body ── */}
        <div className="relative">
          <div className="h-px border-t-2 border-dashed border-gold/40" />
          <span className="absolute -left-2.5 top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-background" aria-hidden />
          <span className="absolute -right-2.5 top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-background" aria-hidden />
        </div>

        {/* ── Body: perks + fares + CTA ── */}
        <div className="space-y-5 px-6 pb-6 pt-5">
          <ul className="grid grid-cols-2 gap-x-4 gap-y-2.5">
            {PERKS.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-2 text-sm text-foreground/85">
                <Icon className="h-4 w-4 shrink-0 text-gold" aria-hidden />
                <span className="leading-tight">{label}</span>
              </li>
            ))}
          </ul>

          {/* Fares — giá lấy từ BE, FE không hardcode */}
          <div className="space-y-2" role="radiogroup" aria-label="Chọn gói nạp">
            {(plans ?? []).map((plan) => {
              const isSel = selected === plan.code;
              return (
                <button
                  key={plan.code}
                  role="radio"
                  aria-checked={isSel}
                  onClick={() => setSelected(plan.code)}
                  className={`flex w-full items-center gap-3 rounded-2xl border-2 px-4 py-3 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-chip-gold/60 ${
                    isSel
                      ? "border-gold bg-foil shadow-warm"
                      : "border-border bg-background hover:border-gold/50"
                  }`}
                >
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                      isSel ? "border-chip-gold-ink bg-chip-gold-ink text-white" : "border-border"
                    }`}
                  >
                    {isSel && <Check className="h-3 w-3" strokeWidth={3} />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="font-display text-sm font-bold capitalize text-foreground">
                      {plan.code.toLowerCase()}
                    </span>
                    <span className="ml-2 text-xs text-muted-foreground">
                      {plan.credits} lượt tạo lịch trình
                    </span>
                  </span>
                  <span className="font-data text-sm font-bold text-foreground">{formatVnd(plan.priceVnd)}</span>
                </button>
              );
            })}
            {!plans && (
              <>
                <div className="h-[58px] animate-pulse rounded-2xl bg-muted/60" />
                <div className="h-[58px] animate-pulse rounded-2xl bg-muted/40" />
              </>
            )}
          </div>

          <div className="space-y-2 pt-1">
            <button
              onClick={goCheckout}
              className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-chip-yellow to-chip-gold font-display text-base font-bold text-[hsl(25_35%_14%)] shadow-foil transition-all hover:brightness-[1.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-chip-gold-ink focus-visible:ring-offset-2 focus-visible:ring-offset-card active:scale-[0.99]"
            >
              Nâng hạng ngay
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>
            <button
              onClick={goPricing}
              className="h-9 w-full rounded-lg text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Xem chi tiết các gói
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default UpgradeDialog;

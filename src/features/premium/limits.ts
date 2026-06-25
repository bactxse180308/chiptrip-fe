import type { Entitlements } from "@/integrations/api/types";
import type { UpgradeReason } from "./upgradeStore";

/** Số ngày của chuyến (inclusive) từ 2 ngày ISO. 0 nếu thiếu/không hợp lệ. */
export function computeTripDays(start?: string, end?: string): number {
  if (!start || !end) return 0;
  const ms = new Date(end).getTime() - new Date(start).getTime();
  if (Number.isNaN(ms) || ms < 0) return 0;
  return Math.floor(ms / 86_400_000) + 1;
}

export function exceedsDays(ent: Entitlements | undefined, days: number): boolean {
  return ent ? days > ent.limits.maxTripDays : false;
}

export function exceedsStyles(ent: Entitlements | undefined, count: number): boolean {
  // maxStyles của Premium là số rất lớn (sentinel) → count không bao giờ vượt.
  return ent ? count > ent.limits.maxStyles : false;
}

export function hasGenerateCredit(ent: Entitlements | undefined): boolean {
  if (!ent) return true; // chưa biết → để BE chốt chặn, không khoá sớm
  return ent.paidCreditBalance >= 1 || ent.trialCreditBalance >= 1;
}

/**
 * Lý do cần mở UpgradeDialog cho hành động generate — hoặc null nếu được phép.
 * Pre-check (mirror BE): limit trước, hết credit sau. Đồng nhất với CreditService ở BE.
 */
export function generateGateReason(
  ent: Entitlements | undefined,
  days: number,
  stylesCount: number,
): UpgradeReason | null {
  if (!ent) return null;
  if (exceedsDays(ent, days) || exceedsStyles(ent, stylesCount)) return "LIMIT_EXCEEDED";
  if (!hasGenerateCredit(ent)) return "DAILY_TRIAL_USED";
  return null;
}

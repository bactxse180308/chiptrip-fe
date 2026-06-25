import { useSyncExternalStore } from "react";

/** Lý do mở UpgradeDialog — khớp `code` lỗi BE (CREDIT_PREMIUM_SPEC.md Mục 4 & 6.2). */
export type UpgradeReason =
  | "DAILY_TRIAL_USED"
  | "INSUFFICIENT_PAID_CREDITS"
  | "PREMIUM_REQUIRED"
  | "LIMIT_EXCEEDED";

interface UpgradeState {
  open: boolean;
  reason: UpgradeReason | null;
}

/**
 * Store cấp module (không phải React context) để axios interceptor — chạy NGOÀI React —
 * vẫn mở được dialog. Một UpgradeDialog duy nhất mount ở App lắng nghe store này.
 */
let state: UpgradeState = { open: false, reason: null };
const listeners = new Set<() => void>();

function emit() {
  state = { ...state };
  listeners.forEach((l) => l());
}

export function openUpgrade(reason: UpgradeReason) {
  state = { open: true, reason };
  emit();
}

export function closeUpgrade() {
  // Giữ reason để nội dung không "nháy" trong lúc dialog đang chạy animation đóng.
  state = { ...state, open: false };
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return state;
}

export function useUpgradeDialog() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

const UPGRADE_CODES: ReadonlySet<string> = new Set<UpgradeReason>([
  "DAILY_TRIAL_USED",
  "INSUFFICIENT_PAID_CREDITS",
  "PREMIUM_REQUIRED",
  "LIMIT_EXCEEDED",
]);

/** Đọc `code` lỗi BE (top-level hoặc trong meta) → mở dialog đúng lý do. Trả true nếu đã xử lý. */
export function handleUpgradeError(error: unknown): boolean {
  const data = (error as { response?: { data?: { code?: string; meta?: { code?: string } } } })?.response?.data;
  const code = data?.code ?? data?.meta?.code;
  if (code && UPGRADE_CODES.has(code)) {
    openUpgrade(code as UpgradeReason);
    return true;
  }
  return false;
}

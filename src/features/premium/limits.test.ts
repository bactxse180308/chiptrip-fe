// @vitest-environment node
import { describe, it, expect } from "vitest";
import type { Entitlements } from "@/integrations/api/types";
import { computeTripDays, exceedsDays, exceedsStyles, generateGateReason } from "./limits";

const normal: Entitlements = {
  accountType: "NORMAL",
  isPremium: false,
  trialCreditBalance: 1,
  paidCreditBalance: 0,
  limits: { maxTripDays: 3, maxStyles: 5, canExportPdf: false, canRegenerate: false },
};
const premium: Entitlements = {
  accountType: "PREMIUM",
  isPremium: true,
  trialCreditBalance: 1,
  paidCreditBalance: 2,
  limits: { maxTripDays: 10, maxStyles: 2147483647, canExportPdf: true, canRegenerate: true },
};

describe("computeTripDays", () => {
  it("đếm inclusive (cùng ngày = 1)", () => {
    expect(computeTripDays("2026-07-01", "2026-07-01")).toBe(1);
    expect(computeTripDays("2026-07-01", "2026-07-04")).toBe(4);
  });
  it("trả 0 khi thiếu hoặc đảo ngược", () => {
    expect(computeTripDays(undefined, "2026-07-01")).toBe(0);
    expect(computeTripDays("2026-07-05", "2026-07-01")).toBe(0);
  });
});

describe("gate limits", () => {
  it("Normal: 4 ngày vượt, 3 ngày OK", () => {
    expect(exceedsDays(normal, 4)).toBe(true);
    expect(exceedsDays(normal, 3)).toBe(false);
  });
  it("Normal: 6 styles vượt, 5 OK", () => {
    expect(exceedsStyles(normal, 6)).toBe(true);
    expect(exceedsStyles(normal, 5)).toBe(false);
  });
  it("Premium: 10 ngày OK, styles không giới hạn", () => {
    expect(exceedsDays(premium, 10)).toBe(false);
    expect(exceedsStyles(premium, 14)).toBe(false);
  });
});

describe("generateGateReason", () => {
  it("Normal vượt ngày/styles → LIMIT_EXCEEDED (ưu tiên limit trước credit)", () => {
    expect(generateGateReason(normal, 4, 1)).toBe("LIMIT_EXCEEDED");
    expect(generateGateReason(normal, 2, 6)).toBe("LIMIT_EXCEEDED");
  });
  it("Normal hết paid và hết trial → DAILY_TRIAL_USED", () => {
    const noCredit = { ...normal, trialCreditBalance: 0, paidCreditBalance: 0 };
    expect(generateGateReason(noCredit, 2, 1)).toBe("DAILY_TRIAL_USED");
  });
  it("Normal hợp lệ còn trial → null (cho phép)", () => {
    expect(generateGateReason(normal, 3, 5)).toBeNull();
  });
  it("Premium 10 ngày + nhiều styles → null", () => {
    expect(generateGateReason(premium, 10, 14)).toBeNull();
  });
  it("entitlements chưa load → null (để BE chốt chặn)", () => {
    expect(generateGateReason(undefined, 99, 99)).toBeNull();
  });
});

// @vitest-environment node
import { describe, it, expect, beforeEach } from "vitest";
import { handleUpgradeError, openUpgrade, closeUpgrade } from "./upgradeStore";

describe("handleUpgradeError", () => {
  beforeEach(() => closeUpgrade());

  it("map code top-level cho cả 4 lý do credit/premium", () => {
    for (const code of ["PREMIUM_REQUIRED", "DAILY_TRIAL_USED", "LIMIT_EXCEEDED", "INSUFFICIENT_PAID_CREDITS"]) {
      expect(handleUpgradeError({ response: { data: { code } } })).toBe(true);
    }
  });

  it("map code nằm trong meta (FE đọc data.meta.code)", () => {
    expect(handleUpgradeError({ response: { data: { meta: { code: "PREMIUM_REQUIRED" } } } })).toBe(true);
  });

  it("bỏ qua code không liên quan / không có response", () => {
    expect(handleUpgradeError({ response: { data: { code: "NOT_FOUND" } } })).toBe(false);
    expect(handleUpgradeError({ response: { data: {} } })).toBe(false);
    expect(handleUpgradeError(new Error("network"))).toBe(false);
    expect(handleUpgradeError(undefined)).toBe(false);
  });
});

describe("open/close store", () => {
  it("không ném khi gọi (smoke)", () => {
    expect(() => { openUpgrade("LIMIT_EXCEEDED"); closeUpgrade(); }).not.toThrow();
  });
});

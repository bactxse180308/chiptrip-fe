import { describe, expect, it } from "vitest";
import { optimizePlaceImageUrl } from "./place-image";

describe("optimizePlaceImageUrl", () => {
  it("replaces a full-size Google photo transform with a thumbnail transform", () => {
    const original =
      "https://lh3.googleusercontent.com/gps-cs-s/example=w9248-h6936-k-no";

    expect(optimizePlaceImageUrl(original, 160, 160)).toBe(
      "https://lh3.googleusercontent.com/gps-cs-s/example=w160-h160-c",
    );
  });

  it("limits Street View thumbnail dimensions while preserving its identity params", () => {
    const original =
      "https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=abc&cb_client=maps_sv&w=10000&h=10000&yaw=12";
    const optimized = new URL(optimizePlaceImageUrl(original, 160, 160));

    expect(optimized.searchParams.get("panoid")).toBe("abc");
    expect(optimized.searchParams.get("yaw")).toBe("12");
    expect(optimized.searchParams.get("w")).toBe("160");
    expect(optimized.searchParams.get("h")).toBe("160");
  });

  it("requests the desired crop size from Unsplash", () => {
    const original =
      "https://images.unsplash.com/photo-demo?auto=format&fit=crop&q=80&w=400&h=300";
    const optimized = new URL(optimizePlaceImageUrl(original, 160, 160));

    expect(optimized.searchParams.get("fit")).toBe("crop");
    expect(optimized.searchParams.get("w")).toBe("160");
    expect(optimized.searchParams.get("h")).toBe("160");
  });

  it("does not rewrite providers whose resize contract is unknown", () => {
    const original = "https://photos.hotelbeds.com/giata/original/example.jpg";

    expect(optimizePlaceImageUrl(original, 160, 160)).toBe(original);
  });
});

import { describe, it, expect } from "vitest";
import {
  formatStellarAmount,
  shortenAddress,
  mockUsd,
} from "@/lib/format";

describe("Formatting Utilities", () => {
  describe("formatStellarAmount", () => {
    it("trims trailing zeros up to 7 decimal places", () => {
      expect(formatStellarAmount("10.5000000")).toBe("10.5");
      expect(formatStellarAmount(10.12345678)).toBe("10.1234568");
      expect(formatStellarAmount("0.0000000")).toBe("0");
    });
  });

  describe("shortenAddress", () => {
    it("truncates Stellar addresses correctly", () => {
      const addr = "GC5ROKE2F3VTIPNABHRYNEHWOYYTWHJ4WEDNUTP6ZNMVNMGU7PLK2M7N";
      expect(shortenAddress(addr)).toBe("GC5R...2M7N");
    });

    it("returns short inputs unchanged", () => {
      expect(shortenAddress("ABCD")).toBe("ABCD");
    });
  });

  describe("mockUsd", () => {
    it("calculates mock USD value", () => {
      expect(mockUsd(100)).toBe("11.00"); // 100 * 0.11
    });
  });
});

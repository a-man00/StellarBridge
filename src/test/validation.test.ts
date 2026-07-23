import { describe, it, expect } from "vitest";
import {
  isValidStellarAddress,
  validateAmount,
  validateMemo,
} from "@/lib/validation";

describe("Stellar Validation Utilities", () => {
  describe("isValidStellarAddress", () => {
    it("accepts valid Stellar Ed25519 public keys", () => {
      const validAddress = "GC5ROKE2F3VTIPNABHRYNEHWOYYTWHJ4WEDNUTP6ZNMVNMGU7PLK2M7N";
      expect(isValidStellarAddress(validAddress)).toBe(true);
    });

    it("rejects invalid addresses", () => {
      expect(isValidStellarAddress("invalid-address")).toBe(false);
      expect(isValidStellarAddress("0x1234567890abcdef")).toBe(false);
      expect(isValidStellarAddress("")).toBe(false);
    });
  });

  describe("validateAmount", () => {
    it("validates positive XLM amounts within balance", () => {
      const res = validateAmount("10.5", "100.0");
      expect(res.valid).toBe(true);
      expect(res.error).toBeUndefined();
    });

    it("rejects zero or negative amounts", () => {
      expect(validateAmount("0", "100.0").valid).toBe(false);
      expect(validateAmount("-5", "100.0").valid).toBe(false);
    });

    it("rejects non-numeric inputs", () => {
      expect(validateAmount("abc", "100.0").valid).toBe(false);
    });

    it("rejects amounts exceeding available balance", () => {
      const res = validateAmount("150.0", "100.0");
      expect(res.valid).toBe(false);
      expect(res.error).toContain("exceeds your available balance");
    });

    it("rejects amounts with more than 7 decimal places", () => {
      const res = validateAmount("1.12345678", "100.0");
      expect(res.valid).toBe(false);
      expect(res.error).toContain("Maximum 7 decimal places");
    });
  });

  describe("validateMemo", () => {
    it("allows valid memo strings within 28 bytes", () => {
      expect(validateMemo("Rent for July").valid).toBe(true);
      expect(validateMemo("").valid).toBe(true);
    });

    it("rejects memo strings exceeding 28 bytes", () => {
      const longMemo = "This memo is definitely way longer than twenty eight bytes long!";
      const res = validateMemo(longMemo);
      expect(res.valid).toBe(false);
      expect(res.error).toContain("too long");
    });
  });
});

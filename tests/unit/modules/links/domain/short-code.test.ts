import { describe, expect, it } from "vitest";

import { ShortCode } from "../../../../../src/modules/links/domain/short-code";

describe("ShortCode", () => {
  it("creates a valid short code", () => {
    const shortCode = ShortCode.create("abc123");

    expect(shortCode.toString()).toBe("abc123");
  });

  it("accepts hyphens and underscores", () => {
    const shortCode = ShortCode.create("my_link-01");

    expect(shortCode.toString()).toBe("my_link-01");
  });

  it("trims surrounding whitespace", () => {
    const shortCode = ShortCode.create("  abc123  ");

    expect(shortCode.toString()).toBe("abc123");
  });

  it("rejects a short code shorter than four characters", () => {
    expect(() => ShortCode.create("abc")).toThrow("Short code must contain at least 4 characters");
  });

  it("rejects a short code longer than thirty-two characters", () => {
    const value = "a".repeat(33);

    expect(() => ShortCode.create(value)).toThrow("Short code must contain at most 32 characters");
  });

  it("rejects unsupported characters", () => {
    expect(() => ShortCode.create("abc@123")).toThrow(
      "Short code can only contain letters, numbers, hyphens and underscores",
    );
  });

  it("rejects spaces inside the short code", () => {
    expect(() => ShortCode.create("abc 123")).toThrow(
      "Short code can only contain letters, numbers, hyphens and underscores",
    );
  });

  it("compares two short codes by value", () => {
    const first = ShortCode.create("abc123");
    const second = ShortCode.create("abc123");

    expect(first.equals(second)).toBe(true);
  });

  it("considers different short codes as unequal", () => {
    const first = ShortCode.create("abc123");
    const second = ShortCode.create("xyz789");

    expect(first.equals(second)).toBe(false);
  });
});

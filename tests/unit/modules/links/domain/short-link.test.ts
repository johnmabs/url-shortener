import { describe, expect, it } from "vitest";

import { DestinationUrl } from "../../../../../src/modules/links/domain/destination-url";
import { ShortCode } from "../../../../../src/modules/links/domain/short-code";
import { ShortLink } from "../../../../../src/modules/links/domain/short-link";

describe("ShortLink", () => {
  it("creates an active short link", () => {
    const link = ShortLink.create({
      destinationUrl: DestinationUrl.create("https://example.com"),
      shortCode: ShortCode.create("abc123"),
    });

    expect(link.getId()).toBeDefined();
    expect(link.getDestinationUrl().toString()).toBe("https://example.com/");
    expect(link.getShortCode().toString()).toBe("abc123");
    expect(link.getExpiresAt()).toBeNull();
    expect(link.getDisabledAt()).toBeNull();
    expect(link.isDisabled()).toBe(false);
    expect(link.isExpired()).toBe(false);
    expect(link.canRedirect()).toBe(true);
  });

  it("creates a short link with a future expiration date", () => {
    const expiresAt = new Date(Date.now() + 60_000);

    const link = ShortLink.create({
      destinationUrl: DestinationUrl.create("https://example.com"),
      shortCode: ShortCode.create("abc123"),
      expiresAt,
    });

    expect(link.getExpiresAt()).toEqual(expiresAt);
  });

  it("rejects an expiration date in the past", () => {
    const expiresAt = new Date(Date.now() - 60_000);

    expect(() =>
      ShortLink.create({
        destinationUrl: DestinationUrl.create("https://example.com"),
        shortCode: ShortCode.create("abc123"),
        expiresAt,
      }),
    ).toThrow("Expiration date must be in the future");
  });

  it("detects an expired link", () => {
    const now = new Date("2026-09-30T12:00:00.000Z");
    const expiresAt = new Date("2026-09-30T11:00:00.000Z");

    const link = ShortLink.restore({
      id: ShortLink.create({
        destinationUrl: DestinationUrl.create("https://example.com"),
        shortCode: ShortCode.create("abc123"),
      }).getId(),
      destinationUrl: DestinationUrl.create("https://example.com"),
      shortCode: ShortCode.create("abc123"),
      createdAt: new Date("2026-09-29T12:00:00.000Z"),
      expiresAt,
      disabledAt: null,
    });

    expect(link.isExpired(now)).toBe(true);
    expect(link.canRedirect(now)).toBe(false);
  });

  it("disables a short link", () => {
    const now = new Date("2026-09-30T12:00:00.000Z");

    const link = ShortLink.create({
      destinationUrl: DestinationUrl.create("https://example.com"),
      shortCode: ShortCode.create("abc123"),
    });

    link.disable(now);

    expect(link.isDisabled()).toBe(true);
    expect(link.getDisabledAt()).toEqual(now);
    expect(link.canRedirect(now)).toBe(false);
  });

  it("does not change disabledAt when disabling twice", () => {
    const firstDisableAt = new Date("2026-09-30T12:00:00.000Z");
    const secondDisableAt = new Date("2026-09-30T13:00:00.000Z");

    const link = ShortLink.create({
      destinationUrl: DestinationUrl.create("https://example.com"),
      shortCode: ShortCode.create("abc123"),
    });

    link.disable(firstDisableAt);
    link.disable(secondDisableAt);

    expect(link.getDisabledAt()).toEqual(firstDisableAt);
  });
});

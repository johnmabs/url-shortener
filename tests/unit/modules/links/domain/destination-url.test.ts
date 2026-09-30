import { describe, expect, it } from "vitest";

import { DestinationUrl } from "../../../../../src/modules/links/domain/destination-url";

describe("DestinationUrl", () => {
  it("creates a valid HTTP URL", () => {
    const url = DestinationUrl.create("http://example.com");

    expect(url.toString()).toBe("http://example.com/");
  });

  it("creates a valid HTTPS URL", () => {
    const url = DestinationUrl.create("https://example.com/path");

    expect(url.toString()).toBe("https://example.com/path");
  });

  it("trims surrounding whitespace", () => {
    const url = DestinationUrl.create("  https://example.com  ");

    expect(url.toString()).toBe("https://example.com/");
  });

  it("rejects an empty URL", () => {
    expect(() => DestinationUrl.create("")).toThrow("Destination URL cannot be empty");
  });

  it("rejects an invalid URL", () => {
    expect(() => DestinationUrl.create("example")).toThrow("Invalid destination URL");
  });

  it("rejects unsupported protocols", () => {
    expect(() => DestinationUrl.create("ftp://example.com")).toThrow(
      "Destination URL must use HTTP or HTTPS",
    );
  });

  it("compares two URLs by value", () => {
    const first = DestinationUrl.create("https://example.com");
    const second = DestinationUrl.create("https://example.com");

    expect(first.equals(second)).toBe(true);
  });
});

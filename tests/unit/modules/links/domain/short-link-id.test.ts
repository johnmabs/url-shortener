import { describe, expect, it } from "vitest";
import { validate, version } from "uuid";

import { ShortLinkId } from "../../../../../src/modules/links/domain/short-link-id";

describe("ShortLinkId", () => {
  it("generates a valid UUID v7", () => {
    const id = ShortLinkId.generate();

    expect(validate(id.toString())).toBe(true);
    expect(version(id.toString())).toBe(7);
  });

  it("creates an ID from a valid UUID v7", () => {
    const generated = ShortLinkId.generate();

    const id = ShortLinkId.fromString(generated.toString());

    expect(id.toString()).toBe(generated.toString());
  });

  it("rejects an invalid UUID", () => {
    expect(() => ShortLinkId.fromString("invalid-id")).toThrow(
      "Short link ID must be a valid UUID v7",
    );
  });

  it("rejects an empty value", () => {
    expect(() => ShortLinkId.fromString("")).toThrow("Short link ID must be a valid UUID v7");
  });

  it("compares two IDs by value", () => {
    const generated = ShortLinkId.generate();

    const first = ShortLinkId.fromString(generated.toString());
    const second = ShortLinkId.fromString(generated.toString());

    expect(first.equals(second)).toBe(true);
  });

  it("considers different IDs as unequal", () => {
    const first = ShortLinkId.generate();
    const second = ShortLinkId.generate();

    expect(first.equals(second)).toBe(false);
  });
});

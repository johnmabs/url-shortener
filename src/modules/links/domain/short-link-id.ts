import { validate, version, v7 } from "uuid";

export class ShortLinkId {
  private constructor(private readonly value: string) {}

  static generate(): ShortLinkId {
    return new ShortLinkId(v7());
  }

  static fromString(value: string): ShortLinkId {
    const normalizedValue = value.trim();

    if (!validate(normalizedValue) || version(normalizedValue) !== 7) {
      throw new Error("Short link ID must be a valid UUID v7");
    }

    return new ShortLinkId(normalizedValue);
  }

  toString(): string {
    return this.value;
  }

  equals(other: ShortLinkId): boolean {
    return this.value === other.value;
  }
}

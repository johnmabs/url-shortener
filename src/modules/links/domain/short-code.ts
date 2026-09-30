const SHORT_CODE_PATTERN = /^[A-Za-z0-9_-]+$/;

const MIN_LENGTH = 4;
const MAX_LENGTH = 32;

export class ShortCode {
  private constructor(private readonly value: string) {}

  static create(value: string): ShortCode {
    const normalizedValue = value.trim();

    if (normalizedValue.length < MIN_LENGTH) {
      throw new Error(`Short code must contain at least ${MIN_LENGTH} characters`);
    }

    if (normalizedValue.length > MAX_LENGTH) {
      throw new Error(`Short code must contain at most ${MAX_LENGTH} characters`);
    }

    if (!SHORT_CODE_PATTERN.test(normalizedValue)) {
      throw new Error("Short code can only contain letters, numbers, hyphens and underscores");
    }

    return new ShortCode(normalizedValue);
  }

  toString(): string {
    return this.value;
  }

  equals(other: ShortCode): boolean {
    return this.value === other.value;
  }
}

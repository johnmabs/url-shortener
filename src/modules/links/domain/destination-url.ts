export class DestinationUrl {
  private constructor(private readonly value: string) {}

  static create(value: string): DestinationUrl {
    const normalizedValue = value.trim();

    if (normalizedValue.length === 0) {
      throw new Error("Destination URL cannot be empty");
    }

    let parsedUrl: URL;

    try {
      parsedUrl = new URL(normalizedValue);
    } catch {
      throw new Error("Invalid destination URL");
    }

    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      throw new Error("Destination URL must use HTTP or HTTPS");
    }

    return new DestinationUrl(parsedUrl.toString());
  }

  toString(): string {
    return this.value;
  }

  equals(other: DestinationUrl): boolean {
    return this.value === other.value;
  }
}

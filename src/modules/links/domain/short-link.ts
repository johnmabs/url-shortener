import { DestinationUrl } from "./destination-url.js";
import { ShortCode } from "./short-code.js";
import { ShortLinkId } from "./short-link-id.js";

type ShortLinkProps = {
  destinationUrl: DestinationUrl;
  shortCode: ShortCode;
  createdAt: Date;
  expiresAt: Date | null;
  disabledAt: Date | null;
};

export class ShortLink {
  private constructor(
    private readonly id: ShortLinkId,
    private readonly props: ShortLinkProps,
  ) {}

  static create(input: {
    destinationUrl: DestinationUrl;
    shortCode: ShortCode;
    expiresAt?: Date | null | undefined;
  }): ShortLink {
    const now = new Date();

    if (input.expiresAt && input.expiresAt <= now) {
      throw new Error("Expiration date must be in the future");
    }

    return new ShortLink(ShortLinkId.generate(), {
      destinationUrl: input.destinationUrl,
      shortCode: input.shortCode,
      createdAt: now,
      expiresAt: input.expiresAt ?? null,
      disabledAt: null,
    });
  }

  static restore(input: {
    id: ShortLinkId;
    destinationUrl: DestinationUrl;
    shortCode: ShortCode;
    createdAt: Date;
    expiresAt: Date | null;
    disabledAt: Date | null;
  }): ShortLink {
    return new ShortLink(input.id, {
      destinationUrl: input.destinationUrl,
      shortCode: input.shortCode,
      createdAt: input.createdAt,
      expiresAt: input.expiresAt,
      disabledAt: input.disabledAt,
    });
  }

  getId(): ShortLinkId {
    return this.id;
  }

  getDestinationUrl(): DestinationUrl {
    return this.props.destinationUrl;
  }

  getShortCode(): ShortCode {
    return this.props.shortCode;
  }

  getCreatedAt(): Date {
    return this.props.createdAt;
  }

  getExpiresAt(): Date | null {
    return this.props.expiresAt;
  }

  getDisabledAt(): Date | null {
    return this.props.disabledAt;
  }

  isExpired(now = new Date()): boolean {
    return this.props.expiresAt !== null && this.props.expiresAt <= now;
  }

  isDisabled(): boolean {
    return this.props.disabledAt !== null;
  }

  canRedirect(now = new Date()): boolean {
    return !this.isDisabled() && !this.isExpired(now);
  }

  disable(now = new Date()): void {
    if (this.isDisabled()) {
      return;
    }

    this.props.disabledAt = now;
  }
}

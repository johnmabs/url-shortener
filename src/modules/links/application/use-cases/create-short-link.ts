import { DestinationUrl } from "../../domain/destination-url.js";
import { ShortCode } from "../../domain/short-code.js";
import { ShortLink } from "../../domain/short-link.js";
import type { ShortLinkRepository } from "../ports/short-link-repository.js";

type CreateShortLinkInput = {
  destinationUrl: string;
  shortCode: string;
  expiresAt?: Date | null;
};

type CreateShortLinkOutput = {
  id: string;
  destinationUrl: string;
  shortCode: string;
  createdAt: Date;
  expiresAt: Date | null;
};

export class CreateShortLink {
  constructor(private readonly shortLinkRepository: ShortLinkRepository) {}

  async execute(input: CreateShortLinkInput): Promise<CreateShortLinkOutput> {
    const destinationUrl = DestinationUrl.create(input.destinationUrl);
    const shortCode = ShortCode.create(input.shortCode);

    const alreadyExists = await this.shortLinkRepository.existsByShortCode(shortCode);

    if (alreadyExists) {
      throw new Error("Short code already exists");
    }

    const shortLink = ShortLink.create({
      destinationUrl,
      shortCode,
      expiresAt: input.expiresAt,
    });

    await this.shortLinkRepository.save(shortLink);

    return {
      id: shortLink.getId().toString(),
      destinationUrl: shortLink.getDestinationUrl().toString(),
      shortCode: shortLink.getShortCode().toString(),
      createdAt: shortLink.getCreatedAt(),
      expiresAt: shortLink.getExpiresAt(),
    };
  }
}

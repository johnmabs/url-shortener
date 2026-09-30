import { ShortLinkRepository } from "../../../../../src/modules/links/application/ports/short-link-repository.js";
import { ShortCode } from "../../../../../src/modules/links/domain/short-code.js";
import { ShortLink } from "../../../../../src/modules/links/domain/short-link.js";
import { ShortLinkId } from "../../../../../src/modules/links/domain/short-link-id.js";

export class InMemoryShortLinkRepository implements ShortLinkRepository {
  readonly items: ShortLink[] = [];

  async save(shortLink: ShortLink): Promise<void> {
    this.items.push(shortLink);
  }

  async findById(id: ShortLinkId): Promise<ShortLink | null> {
    return this.items.find((item) => item.getId().equals(id)) ?? null;
  }

  async findByShortCode(shortCode: ShortCode): Promise<ShortLink | null> {
    return this.items.find((item) => item.getShortCode().equals(shortCode)) ?? null;
  }

  async existsByShortCode(shortCode: ShortCode): Promise<boolean> {
    return this.items.some((item) => item.getShortCode().equals(shortCode));
  }
}

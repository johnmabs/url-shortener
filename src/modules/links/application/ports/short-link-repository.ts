import { ShortCode } from "../../domain/short-code.js";
import { ShortLink } from "../../domain/short-link.js";
import { ShortLinkId } from "../../domain/short-link-id.js";

export interface ShortLinkRepository {
  save(shortLink: ShortLink): Promise<void>;

  findById(id: ShortLinkId): Promise<ShortLink | null>;

  findByShortCode(shortCode: ShortCode): Promise<ShortLink | null>;

  existsByShortCode(shortCode: ShortCode): Promise<boolean>;
}

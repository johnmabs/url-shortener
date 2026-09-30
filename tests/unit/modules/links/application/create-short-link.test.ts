import { beforeEach, describe, expect, it } from "vitest";

import { CreateShortLink } from "../../../../../src/modules/links/application/use-cases/create-short-link.js";
import { InMemoryShortLinkRepository } from "./in-memory-short-link-repository.js";

describe("CreateShortLink", () => {
  let repository: InMemoryShortLinkRepository;
  let useCase: CreateShortLink;

  beforeEach(() => {
    repository = new InMemoryShortLinkRepository();
    useCase = new CreateShortLink(repository);
  });

  it("creates a short link", async () => {
    const result = await useCase.execute({
      destinationUrl: "https://example.com",
      shortCode: "abc123",
    });

    expect(result.id).toBeDefined();
    expect(result.destinationUrl).toBe("https://example.com/");
    expect(result.shortCode).toBe("abc123");
    expect(result.expiresAt).toBeNull();

    expect(repository.items).toHaveLength(1);
  });

  it("creates a short link with an expiration date", async () => {
    const expiresAt = new Date(Date.now() + 60_000);

    const result = await useCase.execute({
      destinationUrl: "https://example.com",
      shortCode: "abc123",
      expiresAt,
    });

    expect(result.expiresAt).toEqual(expiresAt);
    expect(repository.items).toHaveLength(1);
  });

  it("rejects an already existing short code", async () => {
    await useCase.execute({
      destinationUrl: "https://example.com",
      shortCode: "abc123",
    });

    await expect(
      useCase.execute({
        destinationUrl: "https://openai.com",
        shortCode: "abc123",
      }),
    ).rejects.toThrow("Short code already exists");

    expect(repository.items).toHaveLength(1);
  });

  it("rejects an invalid destination URL", async () => {
    await expect(
      useCase.execute({
        destinationUrl: "invalid-url",
        shortCode: "abc123",
      }),
    ).rejects.toThrow("Invalid destination URL");
  });

  it("rejects an invalid short code", async () => {
    await expect(
      useCase.execute({
        destinationUrl: "https://example.com",
        shortCode: "@@@",
      }),
    ).rejects.toThrow();
  });
});

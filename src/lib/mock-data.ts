// TO_KNOW: this is just for the presentation purposes, not for real-world cases

import { faker } from "@faker-js/faker";
import {
  CATEGORIES,
  STATUSES,
  type ContentItem,
} from "@/types/content";

/**
 * Stable string → number hash for faker.seed().
 * Same sessionId always yields the same numeric seed.
 */
export function hashSeed(sessionId: string): number {
  let hash = 0;
  for (let i = 0; i < sessionId.length; i++) {
    hash = (hash << 5) - hash + sessionId.charCodeAt(i);
    hash |= 0; // force 32-bit signed integer
  }
  return Math.abs(hash);
}

export function generateMockContents(
  sessionId: string,
  count = 1200,
): ContentItem[] {
  const numericHash = hashSeed(sessionId);
  faker.seed(numericHash);

  return Array.from({ length: count }, (_, index) => {
    const category = faker.helpers.arrayElement(CATEGORIES);
    const status = faker.helpers.arrayElement(STATUSES);
    const titleSeed = faker.lorem.words({ min: 2, max: 5 });

    return {
      id: `cnt-${String(index + 1).padStart(4, "0")}`,
      title: titleSeed
        .split(" ")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" "),
      category,
      status,
      views: faker.number.int({ min: 100, max: 2_500_000 }),
    };
  });
}

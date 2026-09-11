export const contentQueryKeys = {
  all: (sessionId: string) => ["contents", sessionId] as const,
};

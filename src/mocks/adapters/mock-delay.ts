export const mockDelay = (ms = 200): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

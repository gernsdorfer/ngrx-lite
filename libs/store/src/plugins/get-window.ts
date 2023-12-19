export const getWindow = (): Window | undefined =>
  typeof window === 'object' ? window : undefined;

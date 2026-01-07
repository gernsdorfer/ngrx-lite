import { vi } from 'vitest';

export function createVitestSpyObj<T extends object>(impl: Partial<T>) {
  return vi.mocked<T>(impl as T, true);
}

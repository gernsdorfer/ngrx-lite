import { vi } from 'vitest';

interface MyState {
  myState: string;
  optionalValue?: string;
}

// Create mock storage objects in hoisted scope
const { mockSessionStorage, mockLocalStorage } = vi.hoisted(() => {
  const createMockStorage = () => {
    let store: Record<string, string> = {};
    return {
      getItem: vi.fn((key: string) => store[key] || null),
      setItem: vi.fn((key: string, value: string) => {
        store[key] = value;
      }),
      removeItem: vi.fn((key: string) => {
        delete store[key];
      }),
      clear: vi.fn(() => {
        store = {};
      }),
      get length() {
        return Object.keys(store).length;
      },
      key: vi.fn((index: number) => Object.keys(store)[index] || null),
    } as unknown as Storage;
  };

  return {
    mockSessionStorage: createMockStorage(),
    mockLocalStorage: createMockStorage(),
  };
});

// Mock getWindow before importing the plugins
vi.mock('./get-window', () => ({
  getWindow: () => ({
    sessionStorage: mockSessionStorage,
    localStorage: mockLocalStorage,
  }),
}));

import {
  localStoragePlugin,
  sessionStoragePlugin,
} from './client-storage.plugin';

describe('sessionStorageHandlerForStores', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getDefaultState', () => {
    describe('load data from storage', () => {
      it('should return default state', () => {
        (mockSessionStorage.getItem as any).mockReturnValue(null);

        expect(
          sessionStoragePlugin.getDefaultState<MyState>('testStore1'),
        ).toEqual(undefined);
      });

      it('should return state from storage', () => {
        (mockSessionStorage.getItem as any).mockReturnValue(
          JSON.stringify(<MyState>{ myState: 'testValue' }),
        );

        expect(
          sessionStoragePlugin.getDefaultState<MyState>('testStore1'),
        ).toEqual({ myState: 'testValue' });
      });
    });
  });

  describe('onStateChange', () => {
    it('should set state to storage', () => {
      sessionStoragePlugin.setStateToStorage<MyState>('testStore1', {
        myState: 'testValue',
      });

      expect(mockSessionStorage.setItem).toHaveBeenCalledWith(
        'testStore1',
        JSON.stringify(<MyState>{ myState: 'testValue' }),
      );
    });
  });
});

describe('localStorageHandlerForStores', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getDefaultState', () => {
    describe('load data from storage', () => {
      it('should return default state', () => {
        (mockLocalStorage.getItem as any).mockReturnValue(null);

        expect(localStoragePlugin.getDefaultState('testStore1')).toEqual(
          undefined,
        );
      });

      it('should return state from storage', () => {
        (mockLocalStorage.getItem as any).mockReturnValue(
          JSON.stringify(<MyState>{ myState: 'testValue' }),
        );

        expect(
          localStoragePlugin.getDefaultState<MyState>('testStore1'),
        ).toEqual({
          myState: 'testValue',
        });
      });
    });
  });

  describe('onStateChange', () => {
    it('should set state to storage', () => {
      localStoragePlugin.setStateToStorage('testStore1', { isLoading: false });

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'testStore1',
        JSON.stringify({ isLoading: false }),
      );
    });
  });
});

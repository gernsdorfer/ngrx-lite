import { ClientStoragePlugin } from '../models';

class ClientStorage implements ClientStoragePlugin {
  constructor(private store?: Storage) {}

  getDefaultState<STATE>(storeName: string): STATE | undefined {
    const stateFromStorage = this.store?.getItem(storeName);
    if (!stateFromStorage) return;
    return JSON.parse(stateFromStorage);
  }

  setStateToStorage<STATE>(storeName: string, state: STATE) {
    this.store?.setItem(storeName, JSON.stringify(state));
  }
}
export const currentWindow = {
  get: () => window,
};

export const getWindow = (): Window | undefined =>
  typeof currentWindow.get() === 'object' ? currentWindow.get() : undefined;

export const sessionStoragePlugin = new ClientStorage(
  getWindow()?.sessionStorage,
);

export const localStoragePlugin = new ClientStorage(getWindow()?.localStorage);

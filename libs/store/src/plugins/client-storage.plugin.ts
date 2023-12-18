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
export const getWindow = (currentWindow?: Window): Window | undefined =>
  typeof currentWindow === 'object' ? currentWindow : undefined;

export const sessionStoragePlugin = new ClientStorage(
  getWindow(window)?.sessionStorage,
);

export const localStoragePlugin = new ClientStorage(
  getWindow(window)?.localStorage,
);

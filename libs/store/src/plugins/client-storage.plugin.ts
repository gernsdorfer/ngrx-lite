import { StoreState } from '../models';

class ClientStoragePlugin implements ClientStoragePlugin {
  constructor(private store: Storage) {}

  getDefaultState<T, E>(storeName: string): StoreState<T, E> | undefined {
    const stateFromStorage = this.store.getItem(storeName);
    if (!stateFromStorage) return;
    return JSON.parse(stateFromStorage);
  }

  setStateToStorage<T, E>(storeName: string, state: StoreState<T, E>) {
    this.store.setItem(storeName, JSON.stringify(state));
  }
}

export const sessionStoragePlugin = new ClientStoragePlugin(
  window.sessionStorage
);

export const localStoragePlugin = new ClientStoragePlugin(window.localStorage);

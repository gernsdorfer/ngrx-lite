import { ClientStoragePlugin } from '../models';
import { getWindow } from './get-window';

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

export const sessionStoragePlugin = new ClientStorage(
  getWindow()?.sessionStorage,
);

export const localStoragePlugin = new ClientStorage(getWindow()?.localStorage);

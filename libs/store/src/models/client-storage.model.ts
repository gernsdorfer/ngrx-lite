import { StoreState } from '../models';

export interface ClientStoragePlugin {
  getDefaultState: <ITEM, ERROR>(
    storeName: string
  ) => StoreState<ITEM, ERROR> | undefined;
  setStateToStorage: <ITEM, ERROR>(
    storeName: string,
    data: StoreState<ITEM, ERROR>
  ) => void;
}

export interface LoadingStoreState<ITEM, ERROR> {
  isLoading: boolean;
  error?: ERROR;
  item?: ITEM;
}
/** @deprecated use LoadingStoreState instead, this methode will be removed in the next major version */
export type StoreState<ITEM, ERROR> = LoadingStoreState<ITEM, ERROR>

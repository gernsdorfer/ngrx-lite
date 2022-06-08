export interface LoadingStoreState<ITEM, ERROR> {
  isLoading: boolean;
  error?: ERROR;
  item?: ITEM;
}

export type LoadingStoreState<ITEM, ERROR> = {
  isLoading: boolean;
  error?: ERROR;
  item?: ITEM;
};

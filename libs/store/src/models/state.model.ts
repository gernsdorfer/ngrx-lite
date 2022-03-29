export interface StoreState<ITEM, ERROR> {
  isLoading: boolean;
  error?: ERROR;
  item?: ITEM;
}

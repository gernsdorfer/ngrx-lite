export interface ClientStoragePlugin {
  getDefaultState: <STATE>(storeName: string) => STATE | undefined;
  setStateToStorage: <STATE>(storeName: string, data: STATE) => void;
}

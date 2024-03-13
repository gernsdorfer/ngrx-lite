import { Injectable, inject } from '@angular/core';
import { StoreFactory, createStoreAsFn } from '@gernsdorfer/ngrx-lite';
import { dynamicStoreASuccessAction } from './dynamic-store';

export type RootState = { counter: number };

const providedIn = 'root';

@Injectable({ providedIn: providedIn })
class RootStoreService {
  private storeFactory = inject(StoreFactory);
  private store = this.storeFactory.createComponentStore<RootState>({
    storeName: 'FunctionRootStore',
    defaultState: { counter: 0 },
  });

  public state = this.store.state;
  onLazyStoreBSuccess = this.store.onActions([dynamicStoreASuccessAction]);
}

export const rootStore = createStoreAsFn(RootStoreService, {
  providedIn: providedIn,
});

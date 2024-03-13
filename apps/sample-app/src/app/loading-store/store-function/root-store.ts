import { Injectable, inject } from '@angular/core';
import {
  LoadingStoreState,
  StoreFactory,
  createStoreAsFn,
} from '@gernsdorfer/ngrx-lite';
import { of } from 'rxjs';
import { dynamicStoreASuccessAction } from './dynamic-store';

export type RootState = LoadingStoreState<{ counter: number }, never>;

const providedIn = 'root';

@Injectable({ providedIn: providedIn })
class RootStoreService {
  private storeFactory = inject(StoreFactory);
  private store = this.storeFactory.createComponentLoadingStore<
    RootState['item'],
    RootState['error']
  >({
    storeName: 'FunctionRootStore',
  });

  public state = this.store.state;
  onLazyStoreBSuccess = this.store.onActions([dynamicStoreASuccessAction]);

  increment = this.store.loadingEffect('INCREMENT', (counter: number) =>
    of({ counter: counter }).pipe(),
  );
}

export const rootStore = createStoreAsFn(RootStoreService, {
  providedIn: providedIn,
});

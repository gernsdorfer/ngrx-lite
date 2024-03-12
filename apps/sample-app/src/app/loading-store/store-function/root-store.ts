import { Injectable, inject } from '@angular/core';
import {
  LoadingStoreState,
  StoreFactory,
  createStoreAsFn,
} from '@gernsdorfer/ngrx-lite';
import { of } from 'rxjs';
import { storeBSuccessAction } from './dynamic-store';

export type MyState = LoadingStoreState<
  { counter: number },
  { message: string }
>;

const providedIn = 'root';

@Injectable({ providedIn: providedIn })
class MyRootFactoryStoreService {
  private storeFactory = inject(StoreFactory);
  private store = this.storeFactory.createComponentLoadingStore<
    MyState['item'],
    MyState['error']
  >({
    storeName: 'FunctionRootStore',
  });

  public counterState = this.store.state;
  onStoreBSuccess = this.store.onActions([storeBSuccessAction]);

  increment = this.store.loadingEffect('INCREMENT', (counter: number) =>
    of({ counter: counter }).pipe(),
  );
}

export const myRootStore = createStoreAsFn(MyRootFactoryStoreService, {
  providedIn: providedIn,
});

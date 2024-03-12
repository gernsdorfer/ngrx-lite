import { Injectable, OnDestroy, inject } from '@angular/core';
import {
  LoadingStoreState,
  StoreFactory,
  createStoreFn,
} from '@gernsdorfer/ngrx-lite';
import { of } from 'rxjs';

export type MyState = LoadingStoreState<
  { counter: number },
  { message: string }
>;

@Injectable()
class MyFactoryStoreService implements OnDestroy {
  private storeFactory = inject(StoreFactory);
  private store = this.storeFactory.createComponentLoadingStore<
    MyState['item'],
    MyState['error']
  >({
    storeName: 'FUNCTION_STORE',
  });

  public counterState = this.store.state;

  increment = this.store.loadingEffect('INCREMENT', (counter: number) =>
    of({ counter: counter }).pipe(),
  );

  ngOnDestroy() {
    this.store.ngOnDestroy();
  }
}
export const myFactoryStore = createStoreFn(MyFactoryStoreService);

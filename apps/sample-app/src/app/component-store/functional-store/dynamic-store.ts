import { inject, Injectable, OnDestroy } from '@angular/core';
import {
  createStoreAsFn,
  DynamicStore,
  getCustomActionWithDynamicStore,
  StoreFactory,
} from '@gernsdorfer/ngrx-lite';

export type DynamicState = { counter: number };
type MyDynamicStoreNames = 'StoreA' | 'StoreB';
const storeName = 'Function_Store';
const incrementAction = 'INCREMENT';

export const dynamicStoreASuccessAction =
  getCustomActionWithDynamicStore<MyDynamicStoreNames>({
    storeName: storeName,
    dynamicStoreName: 'StoreA',
    actionName: incrementAction,
  });

@Injectable()
class DynamicStoreService
  extends DynamicStore<MyDynamicStoreNames>
  implements OnDestroy
{
  private storeFactory = inject(StoreFactory);

  private store = this.storeFactory.createComponentStore<DynamicState>({
    storeName,
    defaultState: { counter: 0 },
  });

  public state = this.store.state;

  increment(counter: number) {
    this.store.setState({ counter: counter }, incrementAction);
  }

  ngOnDestroy() {
    this.store.ngOnDestroy();
  }
}

export const dynamicStore = createStoreAsFn(DynamicStoreService);

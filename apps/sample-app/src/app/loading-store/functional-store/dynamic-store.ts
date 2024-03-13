import { inject, Injectable, OnDestroy } from '@angular/core';
import {
  createStoreAsFn,
  DynamicStore,
  EffectStates,
  getEffectAction,
  LoadingStoreState,
  StoreFactory,
} from '@gernsdorfer/ngrx-lite';
import { of } from 'rxjs';

export type DynamicState = LoadingStoreState<{ counter: number }, never>;
type MyDynamicStoreNames = 'StoreA' | 'StoreB';
const storeName = 'Function_Store';
const incrementEffect = 'INCREMENT';

export const dynamicStoreASuccessAction = getEffectAction<MyDynamicStoreNames>({
  storeName: storeName,
  effectName: incrementEffect,
  type: EffectStates.SUCCESS,
  dynamicStoreName: 'StoreA',
});

@Injectable()
class DynamicStoreService
  extends DynamicStore<MyDynamicStoreNames>
  implements OnDestroy
{
  private storeFactory = inject(StoreFactory);

  private store = this.storeFactory.createComponentLoadingStore<
    DynamicState['item'],
    DynamicState['error']
  >({
    storeName,
  });

  public state = this.store.state;

  increment = this.store.loadingEffect(incrementEffect, (counter: number) =>
    of({ counter: counter }),
  );

  ngOnDestroy() {
    this.store.ngOnDestroy();
  }
}

export const dynamicStore = createStoreAsFn(DynamicStoreService);

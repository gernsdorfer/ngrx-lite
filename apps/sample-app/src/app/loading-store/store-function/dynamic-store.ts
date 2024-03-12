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

export type MyState = LoadingStoreState<
  { counter: number },
  { message: string }
>;
type MyDynamicStoreNames = 'StoreA' | 'StoreB';
const storeName = 'Function_Store';
const incrementEffect = 'INCREMENT';

export const storeBSuccessAction = getEffectAction<MyDynamicStoreNames>({
  storeName: storeName,
  effectName: incrementEffect,
  type: EffectStates.SUCCESS,
  dynamicStoreName: 'StoreB',
});

@Injectable()
export class MyDynamicFactoryStoreService
  extends DynamicStore<MyDynamicStoreNames>
  implements OnDestroy
{
  private storeFactory = inject(StoreFactory);
  private store = this.storeFactory.createComponentLoadingStore<
    MyState['item'],
    MyState['error']
  >({
    storeName,
  });

  public counterState = this.store.state;

  increment = this.store.loadingEffect(incrementEffect, (counter: number) =>
    of({ counter: counter }).pipe(),
  );

  ngOnDestroy() {
    this.store.ngOnDestroy();
  }
}

export const myFactoryStore = createStoreAsFn(MyDynamicFactoryStoreService);

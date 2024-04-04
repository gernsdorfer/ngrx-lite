import { StoreFactory } from '@gernsdorfer/ngrx-lite';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { Subject } from 'rxjs';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type mockCreateStoreAsFn = <INJECTION, STORE>() => {
  inject: () => STORE;
};

export type createStoreAsFnTest<
  CREATOR_FUNCTION extends ReturnType<mockCreateStoreAsFn>,
> = ReturnType<CREATOR_FUNCTION['inject']>;

export const actions$ = new Subject<Action>();
export const storeTestingFactory = () => [
  provideMockActions(() => actions$),
  StoreFactory,
  provideMockStore({}),
];

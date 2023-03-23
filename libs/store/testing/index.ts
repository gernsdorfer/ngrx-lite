import { StoreFactory } from '@gernsdorfer/ngrx-lite';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { Subject } from 'rxjs';

export let actions$ = new Subject<Action>();
export const storeTestingFactory = () => [
  provideMockActions(() => actions$),
  StoreFactory,
  provideMockStore({}),
];

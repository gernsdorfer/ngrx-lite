import { StoreFactory } from '@gernsdorfer/ngrx-lite';
import { provideMockStore } from '@ngrx/store/testing';
import {Observable, Subject} from 'rxjs';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';

export let actions$ = new Subject<Action>();
export const storeTestingFactory = () => [
  provideMockActions(() => actions$),
  StoreFactory,
  provideMockStore({}),
];

import { StoreFactory } from '@gernsdorfer/ngrx-lite';
import { provideMockStore } from '@ngrx/store/testing';

export const storeTestingFactory = () => [StoreFactory, provideMockStore({})];

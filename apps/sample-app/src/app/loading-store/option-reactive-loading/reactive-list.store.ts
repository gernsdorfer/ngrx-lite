import { inject, Injectable } from '@angular/core';
import { LoadingStoreState, StoreFactory } from '@gernsdorfer/ngrx-lite';
import { delay, of } from 'rxjs';

export interface SearchParams {
  query: string;
}

export interface SearchResult {
  hits: string[];
}

export type ReactiveListState = LoadingStoreState<
  SearchResult,
  { message: string }
>;

@Injectable({ providedIn: 'root' })
export class ReactiveListStore {
  private storeFactory = inject(StoreFactory);
  private store = this.storeFactory.createComponentLoadingStore<
    ReactiveListState['item'],
    ReactiveListState['error']
  >({
    storeName: 'REACTIVE_LIST',
  });

  public state = this.store.state;

  public connect = this.store.reactiveLoadingEffect(
    'SEARCH',
    (params: SearchParams) =>
      of({
        hits: [
          `${params.query}-1`,
          `${params.query}-2`,
          `${params.query}-3`,
        ],
      }).pipe(delay(150)),
    { skipSameActions: true, skipWhen: (p) => !p.query },
  );
}

---
sidebar_position: 2
---

# Quick Setup

## Create a new Store 👉 `createComponentStore`

```ts title="app.component.ts"
import { Component, inject } from '@angular/core';
import { StoreFactory } from '@gernsdorfer/ngrx-lite';

export interface MyState {
  counter: number;
}

@Component({
  /* ... */
})
export class AppComponent {
  private storeFactory = inject(StoreFactory);

  private store = this.storeFactory.createComponentStore<MyState>({
    storeName: 'BASIC_COUNTER',
    defaultState: { counter: 0 },
  });
}
```

:::note More Information for `createComponentStore` you can find [here](/docs/api/store-factory#createcomponentstore)
:::

## Read State 👉 `state`

`state` is a `Signal`, so you can read it directly in your template.

```ts title="app.component.ts"
@Component({
  template: `<h2>{{ counterState().counter }}</h2>`,
})
export class AppComponent {
  private storeFactory = inject(StoreFactory);

  private store = this.storeFactory.createComponentStore<MyState>({
    storeName: 'BASIC_COUNTER',
    defaultState: { counter: 0 },
  });

  public counterState = this.store.state;
}
```

:::note More Information for `state` you can find [here](/docs/api/component-store#state)
:::

If you prefer observables, `state$` is still available — see [`state$`](/docs/api/component-store#state-observable).

## Modify state 👉 `setState` 👉 `patchState` 👉 `loadingEffect`

Choose between [synchronous](#synchronous-state-change) and [asynchronous](#asynchronous-state-change) state changes.

### Synchronous State Change

#### Complete State Change

```ts title="app.component.ts"
export class AppComponent {
  private storeFactory = inject(StoreFactory);

  private store = this.storeFactory.createComponentStore<MyState>({
    storeName: 'BASIC_COUNTER',
    defaultState: { counter: 0 },
  });

  update(counter: number) {
    this.store.setState({ counter });
  }
}
```

:::note More Information for `setState` you can find [here](/docs/api/component-store#setstate)
:::

#### Partial Changes

```ts title="app.component.ts"
export class AppComponent {
  private storeFactory = inject(StoreFactory);

  private store = this.storeFactory.createComponentStore<MyState>({
    storeName: 'BASIC_COUNTER',
    defaultState: { counter: 0 },
  });

  patch(counter: number) {
    this.store.patchState({ counter });
  }
}
```

:::note More Information for `patchState` you can find [here](/docs/api/component-store#patchstate)
:::

### Asynchronous State Change

#### Change State with the original `effect` from [@ngrx/component-store](https://ngrx.io/guide/component-store/effect)

```ts title="app.component.ts"
import { Component, inject } from '@angular/core';
import { StoreFactory } from '@gernsdorfer/ngrx-lite';
import { tapResponse } from '@ngrx/operators';
import { Observable } from 'rxjs';

export class AppComponent {
  private storeFactory = inject(StoreFactory);

  private store = this.storeFactory.createComponentStore<MyState>({
    storeName: 'BASIC_COUNTER',
    defaultState: { counter: 0 },
  });

  increment = this.store.effect((counter$: Observable<number>) =>
    counter$.pipe(
      tapResponse({
        next: (counter) => this.store.patchState({ counter: counter + 1 }),
        error: (error) => console.error('error', error),
      }),
    ),
  );
}
```

:::caution
`tapResponse` only accepts the object form (`{ next, error }`). The callback signature was removed in NgRx 22.
:::

#### Change State via `loadingEffect`

Create your store with [`loadingEffect`](/docs/api/component-loading-store#loadingeffect) — it manages
`isLoading`, `item` and `error` for you.

```ts title="app.component.ts"
import { Component, inject } from '@angular/core';
import { LoadingStoreState, StoreFactory } from '@gernsdorfer/ngrx-lite';
import { of } from 'rxjs';

type State = LoadingStoreState<{ counter: number }, { message: string }>;

export class AppComponent {
  private storeFactory = inject(StoreFactory);

  private store = this.storeFactory.createComponentLoadingStore<State['item'], State['error']>({
    storeName: 'LOADING_STORE',
  });

  public counterState = this.store.state;

  increment = this.store.loadingEffect('INCREMENT', (counter: number) => of({ counter: counter + 1 }));
}
```

:::note More Information for `loadingEffect` you can find [here](/docs/api/component-loading-store#loadingeffect)
:::

---
sidebar_position: 2
---

# ComponentStore

The Store is a wrapper around the [NgRx Component Store](https://ngrx.io/guide/component-store). You have the exact
same API plus the extras below.

## `state` {#state}

`state` is a `Signal<STATE>`. Read it directly in your template.

```ts title="app.component.ts"
import { Component, inject } from '@angular/core';
import { StoreFactory } from '@gernsdorfer/ngrx-lite';

interface MyState {
  counter: number;
}

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

## `state$` {#state-observable}

`state$` is the `Observable<STATE>` from the [NgRx Component Store](https://ngrx.io/guide/component-store).
Prefer [`state`](#state) unless you need to compose the value with other streams.

```ts title="app.component.ts"
import { Observable } from 'rxjs';

export class AppComponent {
  private storeFactory = inject(StoreFactory);

  private store = this.storeFactory.createComponentStore<MyState>({
    storeName: 'BASIC_COUNTER',
    defaultState: { counter: 0 },
  });

  public state$: Observable<MyState> = this.store.state$;
}
```

## `setState` {#setstate}

Replace the complete state. Pass a custom action name as the second argument to find the change in the DevTools or to
share it with `@ngrx/effects`.

```ts title="app.component.ts"
export class AppComponent {
  private storeFactory = inject(StoreFactory);

  private store = this.storeFactory.createComponentStore<MyState>({
    storeName: 'BASIC_COUNTER',
    defaultState: { counter: 0 },
  });

  change(counter: number) {
    // logged with the default action name
    this.store.setState({ counter });
  }

  changeWithCustomAction(counter: number) {
    // logged as [COMPONENT_STORE][BASIC_COUNTER] CUSTOM_SET_STATE_NAME
    this.store.setState({ counter }, 'CUSTOM_SET_STATE_NAME');
  }
}
```

## `patchState` {#patchstate}

Patch a part of the state. Like `setState` it accepts a custom action name as the second argument.

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

  patchWithCustomAction(counter: number) {
    this.store.patchState({ counter }, 'CUSTOM_PATCH_STATE_NAME');
  }

  // an updater function receives the current state
  increment() {
    this.store.patchState(({ counter }) => ({ counter: counter + 1 }), 'INCREMENT');
  }
}
```

## `createEffect` {#createeffect}

To use `createEffect`, install `@ngrx/effects` and add `provideEffects([])` to your `ApplicationConfig`.

```ts title="my-component-store.service.ts"
import { inject, Injectable, OnDestroy } from '@angular/core';
import { StoreFactory } from '@gernsdorfer/ngrx-lite';
import { ofType } from '@ngrx/effects';
import { createAction } from '@ngrx/store';
import { tap } from 'rxjs';

export interface MyState {
  counter: number;
}

export const resetAction = createAction('reset');

@Injectable()
export class MyStore implements OnDestroy {
  private storeFactory = inject(StoreFactory);

  private store = this.storeFactory.createComponentStore<MyState>({
    storeName: 'BASIC_COUNTER',
    defaultState: { counter: 0 },
  });

  reset = this.store
    // create an effect
    .createEffect((action) =>
      action.pipe(
        // filter for actions
        ofType(resetAction),
        // change your state
        tap(() => this.store.setState({ counter: 0 }, 'RESET')),
      ),
    );

  ngOnDestroy() {
    this.store.ngOnDestroy();
  }
}
```

:::note
It's necessary to destroy your store after your component is destroyed, to stop the created effect.
Call `ngOnDestroy` on the store.
:::

## `onActions` {#onactions}

Listen for custom actions to execute your business logic.

```ts title="my-component-store.service.ts"
import { inject, Injectable } from '@angular/core';
import { StoreFactory } from '@gernsdorfer/ngrx-lite';
import { createAction } from '@ngrx/store';

export const resetAction = createAction('reset');

@Injectable()
export class MyStore {
  private storeFactory = inject(StoreFactory);

  private store = this.storeFactory.createComponentStore<MyState>({
    storeName: 'BASIC_COUNTER',
    defaultState: { counter: 0 },
  });

  onReset = this.store.onActions([resetAction]);
}
```

```ts title="app.component.ts"
export class AppComponent {
  private myStore = inject(MyStore);

  resetEffect = this.myStore.onReset(() => console.log('Reset was triggered'));
}
```

---
sidebar_position: 6
---

# Share Action events for ngrx

[Demo](https://gernsdorfer.github.io/ngrx-lite/sample-app/#/share-actions)

[Demo-Code](https://github.com/gernsdorfer/ngrx-lite/tree/master/apps/sample-app/src/app/component-store/share-actions)

Every state change of an ngrx-lite store is dispatched as a real [NgRx action](https://ngrx.io/guide/store/actions),
so you can listen for it in a global `@ngrx/effects` effect.

:::note
Add `provideEffects([])` to your `ApplicationConfig` — see [Installation](/docs/installation).
:::

## Share `setState` / `patchState` actions

Build the action with [`getCustomAction`](/docs/api/actions#getcustomaction) and pass the same action name to
`patchState`:

```ts title="my-counter.component.ts"
import { Component, inject } from '@angular/core';
import { getCustomAction, StoreFactory } from '@gernsdorfer/ngrx-lite';

const storeName = 'SHARED_ACTIONS';
const actionName = 'increment';

interface MyState {
  counter: number;
}

export const MyIncrementAction = getCustomAction<MyState>({
  storeName,
  actionName,
});

@Component({
  selector: 'my-app-counter',
  template: `<button (click)="increment()">+</button>`,
})
export class CounterComponent {
  private storeFactory = inject(StoreFactory);

  private store = this.storeFactory.createComponentStore<MyState>({
    storeName,
    defaultState: { counter: 0 },
  });

  public counterState = this.store.state;

  increment() {
    // the action name connects the state change to MyIncrementAction
    this.store.patchState(({ counter }) => ({ counter: counter + 1 }), actionName);
  }
}
```

### Listen in a global effect

```ts title="my-effect.effect.ts"
import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs';
import { MyIncrementAction } from './my-counter.component';

@Injectable()
export class DemoEffect {
  private actions$ = inject(Actions);

  logActions$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(MyIncrementAction),
        tap(({ payload }) => console.log('counter is now', payload.counter)),
      ),
    { dispatch: false },
  );
}
```

:::note
`createEffect` comes from `@ngrx/effects`. Don't confuse it with `createEffect` on the ngrx-lite store, which is
described in [ComponentStore](/docs/api/component-store#createeffect).
:::

## Share `loadingEffect` actions

A `loadingEffect` dispatches three actions — `LOAD`, `SUCCESS` and `ERROR`. Build them with
[`getEffectAction`](/docs/api/actions#geteffectaction):

```ts title="my-counter.component.ts"
import { Component, inject } from '@angular/core';
import { EffectStates, getEffectAction, LoadingStoreState, StoreFactory } from '@gernsdorfer/ngrx-lite';
import { of } from 'rxjs';

const storeName = 'COUNTER';
const incrementEffectName = 'increment';

type State = LoadingStoreState<{ counter: number }, { message: string }>;

// get the SUCCESS action for the increment effect
export const MyIncrementSuccessAction = getEffectAction({
  storeName,
  effectName: incrementEffectName,
  type: EffectStates.SUCCESS,
});

@Component({
  selector: 'my-app-counter',
  template: `<button (click)="incrementEffect(1)">+</button>`,
})
export class CounterComponent {
  private storeFactory = inject(StoreFactory);

  private store = this.storeFactory.createComponentLoadingStore<State['item'], State['error']>({
    storeName,
  });

  public counterState = this.store.state;

  incrementEffect = this.store.loadingEffect(incrementEffectName, (counter: number) => of({ counter: counter + 1 }));
}
```

### Listen in a global effect

```ts title="my-effect.effect.ts"
import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs';
import { MyIncrementSuccessAction } from './my-counter.component';

@Injectable()
export class DemoEffect {
  private actions$ = inject(Actions);

  logActions$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(MyIncrementSuccessAction),
        tap((data) => console.log(data)),
      ),
    { dispatch: false },
  );
}
```

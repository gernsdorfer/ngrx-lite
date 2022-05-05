---
sidebar_position: 4
---

# Share Action events for ngrx

[Demo](https://gernsdorfer.github.io/ngrx-lite/sample-app/#/share-actions)

[Demo-Code](https://github.com/gernsdorfer/ngrx-lite/tree/master/apps/sample-app/src/app/component-store/share-actions)

Create a [ngrx Action](https://ngrx.io/guide/store/actions) to share your State Change Event.

## Share PATCH/SET Action's

```ts title="my-counter.component.ts"
import {Component} from '@angular/core';
import {EffectStates, getCustomAction, LoadingStoreState,} from '@gernsdorfer/ngrx-lite';

const storeName = 'COUNTER';
const actionName = 'INCREMENT';

interface MyState {
    myValue: string;
}
// Get Success Action for increment Effect
export const MyIncrementAction = getCustomAction<{ counter: number }>({
  storeName: storeName,
  actionName: actionName,
});

@Component({
  
})
export class CounterComponent {
  private store = this.storeFactory.createComponentStore<MyState>({
    storeName: 'BASIC_COUNTER',
    defaultState: {counter: 0},
  });

  increment() {
    this.store.patchState(
      ({ counter }) => ({ counter: counter + 1 }),
      actionName
    );
  }
}
```

### Listen in Global Effect

Listen in [@ngrx/Effects](https://ngrx.io/guide/store/actions) for Counter Success Action

```ts title="my-effect.effect.ts"
import {Actions, createLoadingEffect, ofType,} from "@ngrx/effects";
import {MyIncrementAction} from "./my-counter.component.ts";

@Injectable()
export class DemoEffect {
  constructor(private actions$: Actions) {
  }

  logActions$ = createLoadingEffect(
    () =>
      this.actions$.pipe(
        ofType(MyIncrementAction),
        tap((data) => console.log(data))
      ),
    {dispatch: false}
  );
}
```

## Share Loader Effect Action's

```ts title="my-counter.component.ts"
import {Component} from '@angular/core';
import {EffectStates, getEffectAction, LoadingStoreState,} from '@gernsdorfer/ngrx-lite';

const storeName = 'counter';
const incrementEffectName = 'increment'

type State = LoadingStoreState<{ counter: number }, { message: string }>;

// Get Success Action (Load/Success/Error) for increment Effect
export const MyIncrementSuccessAction = getCustomAction<LoadingStoreState<number, never>>({
  storeName: storeName,
  effectName: incrementEffectName,
  type: EffectStates.SUCCESS,
});

@Component({
})
export class CounterComponent {
  private store = this.storeFactory.createComponentLoadingStore<State['item'],
    State['error']>({
    storeName: 'LOADING_STORE',
  });

  incrementEffect = this.counterStore.createLoadingEffect(incrementEffectName,
    (counter: number) => of(counter + 1)
  );
}
```

### Listen in Global Effect

Listen in [@ngrx/Effects](https://ngrx.io/guide/store/actions) for Store Success Action

```ts title="my-effect.effect.ts"
import {Actions, createLoadingEffect, ofType,} from "@ngrx/effects";
import {MyIncrementSuccessAction} from "./my-counter.component.ts";

@Injectable()
export class DemoEffect {
  constructor(private actions$: Actions) {
  }

  logActions$ = createLoadingEffect(
    () =>
      this.actions$.pipe(
        ofType(MyIncrementSuccessAction),
        tap((data) => console.log(data))
      ),
    {dispatch: false}
  );
}
```


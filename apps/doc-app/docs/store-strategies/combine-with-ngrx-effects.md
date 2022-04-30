---
sidebar_position: 4
---

# Share Action events for ngrx

[Demo](https://gernsdorfer.github.io/ngrx-lite/sample-app/#/share-actions)

[Demo-Code](https://github.com/gernsdorfer/ngrx-lite/tree/master/apps/sample-app/src/app/share-actions)

Create a [ngrx Actions](https://ngrx.io/guide/store/actions) to share your State Change Event.

## Define the Effect Action

```ts title="my-counter.component.ts"
import {Component} from '@angular/core';
import {EffectStates, getEffectAction, StoreState,} from '@gernsdorfer/ngrx-lite';

const storeName = 'counter';
const incrementEffectName = 'increment'

// Get Success Action for increment Effect
export const MyIncrementAction = getEffectAction<StoreState<number, never>>({
  storeName: storeName,
  effectName: incrementEffectName,
  type: EffectStates.SUCCESS,
});

@Component({
  selector: 'ngrx-lite-counter',
  templateUrl: 'basic.html',
})
export class CounterComponent {
  private counterStore = this.storeFactory.createStore<number, never>(storeName);

  private incrementEffect = this.counterStore.createLoadingEffect(incrementEffectName,
    (counter: number) => of(counter + 1)
  );
}
```

## Listen in Global Effect

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


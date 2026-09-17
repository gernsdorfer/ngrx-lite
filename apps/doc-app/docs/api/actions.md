---
sidebar_position: 4
---

# Actions

Share your state changes with actions.

You can create actions for state changes in the [ngrx-lite/component-store](/docs/api/component-store) or for state
changes made by a `loadingEffect` in the
[ngrx-lite/loading-store](/docs/api/component-loading-store#loadingeffect).

Every action the library dispatches is typed `[COMPONENT_STORE][<storeName>] <actionName>`, which is how the local
state becomes visible in the global store and the DevTools.

## `getCustomAction` {#getcustomaction}

:::warning
This method does _not_ support the lazy functional
[ngrx-lite/component-store](/docs/store-strategies/functional-store).
For lazy functional stores use [`getCustomActionWithDynamicStore`](#getcustomactionwithdynamicstore).
:::

Get an action for a [ngrx-lite/component-store](/docs/api/component-store) or
[ngrx-lite/loading-store](/docs/api/component-loading-store).

```ts title="effect.action.ts"
import { getCustomAction } from '@gernsdorfer/ngrx-lite';

const myEffectAction = getCustomAction<{ counter: number }>({
  storeName: 'storeName',
  actionName: 'myAction',
});
```

## `getCustomActionWithDynamicStore` {#getcustomactionwithdynamicstore}

Get an action for a lazy functional [ngrx-lite/component-store](/docs/store-strategies/functional-store).

```ts title="effect.action.ts"
import { getCustomActionWithDynamicStore } from '@gernsdorfer/ngrx-lite';

const myEffectAction = getCustomActionWithDynamicStore<'StoreA'>({
  storeName: 'storeName',
  dynamicStoreName: 'StoreA',
  actionName: 'myAction',
});
```

## `getEffectAction` {#geteffectaction}

Get an action for a `loadingEffect` — one of `LOAD`, `SUCCESS` or `ERROR` — in the
[ngrx-lite/loading-store](/docs/api/component-loading-store#loadingeffect).

```ts title="effect.action.ts"
import { EffectStates, getEffectAction } from '@gernsdorfer/ngrx-lite';

const myEffectAction = getEffectAction({
  storeName: 'storeName',
  effectName: 'incrementEffectName',
  dynamicStoreName: 'StoreA',
  type: EffectStates.SUCCESS,
});
```

`EffectStates` is exported by the library:

```ts
enum EffectStates {
  LOAD = 'LOAD',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}
```

---
sidebar_position: 4
---

# Actions

Share your State Changes with Actions.

You can create Action's for State changes in the [ngrx-lite/component-store](/docs/api/component-store) or State changes in the `loadingEffect` in the [ngrx-lite/loading-store](/docs/api/component-loading-store#loadingeffect)

## `getCustomAction`

:::warning
This Methode _not_ support the lazy Functional [ngrx-lite/component-store](/docs/store-strategies/functional-store).
To support lazy Functional Stores please use `getCustomActionWithDynamicStore`
:::

Get an Action for the [ngrx-lite/component-store](/docs/api/component-store) or [ngrx-lite/loading-store](/docs/api/component-loading-store)

```ts title="effect.action.ts"
const myEffectAction = getCustomAction({
  storeName: 'storeName',
  actionName: 'myAction',
});
```

## `getCustomActionWithDynamicStore`

Get an Action for the lazy Functional [ngrx-lite/component-store](/docs/store-strategies/functional-store)

```ts title="effect.action.ts"
const myEffectAction = getCustomActionWithDynamicStore<'StoreA'>({
  storeName: 'storeName',
  dynamicStoreName: 'StoreA',
  actionName: 'myAction',
});
```

## `getEffectAction`

Get an Action for the `loadingEffect` (Load,Success or Error) in the [ngrx-lite/loading-store](/docs/api/component-loading-store#loadingeffect)

```ts title="effect.action.ts"
const myEffectAction = getEffectAction({
  storeName: 'storeName',
  effectName: 'incrementEffectName',
  dynamicStoreName: 'StoreA',
  type: EffectStates.SUCCESS,
});
```

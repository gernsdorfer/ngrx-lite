---
sidebar_position: 3
---

# Actions

The Store is a wrapper on the [ngrx Component Store](https://ngrx.io/guide/component-store)

## `getEffectAction`

Get an Effect Action for the Store

```ts title="effect.action.ts"
const myEffectAction = getEffectAction({
  storeName: 'storeName',
  effectName: 'incrementEffectName',
  type: EffectStates.SUCCESS,
})
```

## `getCustomAction`

Get an Action for the Store

```ts title="effect.action.ts"
const myEffectAction = getCustomAction({
  storeName: 'storeName',
  actionName: 'myAction'
})
```

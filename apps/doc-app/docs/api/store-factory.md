---
sidebar_position: 1
---

# StoreFactory

Here you can find a list of the `StoreFactory` API and their usages:

## `createStore`

Create a new Store based on [ngrx Component Store](https://ngrx.io/guide/component-store).

```ts title="app.component.ts"
export class AppComponent {
  myStore = this.storeFactory.createStore<number, never>('myStore');

  constructor(private storeFactory: StoreFactory) {
  }
}
```



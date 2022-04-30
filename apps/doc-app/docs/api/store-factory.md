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

## createLoadingEffect

Create your custom Effect, the lib set's loader state while effect is running. Here you must define your EffectName, in this Example below it's `LOAD_NAME`
The second Argument is a Callback Function. The Callback Function returns an Observable based on the created Store Interface.


```ts title="app.component.ts"
export class AppComponent {
  private myStore = this.storeFactory.createStore<{ name: string }, { errorCode: number }>('myStore');
  private nameEffect = this.myStore.createLoadingEffect('LOAD_NAME', (name: string) => of({name: name}));

  constructor(private storeFactory: StoreFactory) {
  }

  public setName(name: string): void {
    this.nameEffect(name);
  }
}
```

:::note Every Effect set `isLoading` to `true` during the effect is running. Here it's possible to show a loading
indicator in your ui.
:::

### Example for a successfully callback Observable

```ts
  nameEffect = this.myStore.createLoadingEffect('LOAD_NAME', (name: string) => of({name: name}));
```

### Example for a Error Callback Observable

```ts

nameEffect = this.myStore.createLoadingEffect('LOAD_NAME', (name: string) => throwError(() => {
  errorCode: 'myError'
}));
```


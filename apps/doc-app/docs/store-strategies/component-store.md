---
sidebar_position: 1
---

# Component Store

[Demo](https://gernsdorfer.github.io/ngrx-lite/sample-app)

[Demo-Code](https://github.com/gernsdorfer/ngrx-lite/tree/master/apps/sample-app/src/app/component-store/basic)

Create a Store that lives in Your Component Lifecycle

```ts title="app.component.ts"
export interface MyState {
  counter: number
}

@Component()
export class CounterComponent implements OnDestroy {
  private store = this.storeFactory.createComponentStore<MyState>({
    storeName: 'BASIC_COUNTER',
    defaultState: {counter: 0},
  });  
  public myStoreState$ = this.store.state$;

  constructor(private storeFactory: StoreFactory) {
  }

  ngOnDestroy() {
    this.store.ngOnDestroy();
  }
}
```

:::note
It's necessary to destroy your store after your component destroyed, to avoid side effects.
Here you muss call the `ngOnDestroy`. 
:::

 

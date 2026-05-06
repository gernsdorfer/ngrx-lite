---
sidebar_position: 3
---

# ComponentLoadingStore

The LoadingStore is based on [ngrx-lite/component-store](/docs/api/component-store)
You have the exact same API with `createLoadingEffect`

## loadingEffect

Create your custom loadEffect.The lib set's loader state while effect is running. Here you must define your EffectName, in
this Example below it's `LOAD_NAME`, the callback Funtion is same API as [@ngrx/component-store/effect](https://ngrx.io/guide/component-store/effect).
A `tapResponse` to change your state is not necessary. The Effects change your state out of the box, when your stream is done.

```ts title="app.component.ts"
type State = LoadingStoreState<{ counter: number }, { message: string }>;

export class AppComponent {
  private store = this.storeFactory.createComponentLoadingStore<State['item'], State['error']>({
    storeName: 'LOADING_STORE',
  });

  nameEffect = this.store.loadingEffect('LOAD_NAME', (name: string) => of({ name: name }));

  constructor(private storeFactory: StoreFactory) {}
}
```

:::note Every Effect set `isLoading` to `true` during the effect is running. Here it's possible to show a loading
indicator in your ui.
:::

### Option:skipSamePendingActions

Create your custom loadEffect and run an action only once while the effect is running.

```ts title="app.component.ts"
type State = LoadingStoreState<{ counter: number }, { message: string }>;

export class AppComponent {
  private store = this.storeFactory.createComponentLoadingStore<State['item'], State['error']>({
    storeName: 'LOADING_STORE',
  });

  nameEffect = this.store.loadingEffect('LOAD_NAME', (name: string) => of({ name: name }), { skipSamePendingActions: true });

  constructor(private storeFactory: StoreFactory) {}
}
```

### Option:skipSameActions

Create your custom loadEffect and run an action only once, after the same action was running.

```ts title="app.component.ts"
type State = LoadingStoreState<{ counter: number }, { message: string }>;

export class AppComponent {
  private store = this.storeFactory.createComponentLoadingStore<State['item'], State['error']>({
    storeName: 'LOADING_STORE',
  });

  nameEffect = this.store.loadingEffect('LOAD_NAME', (name: string) => of({ name: name }), { skipSameActions: true });

  constructor(private storeFactory: StoreFactory) {}
}
```

### Option:repeatActions

Repeat your effect when action on store was triggered.

```ts title="app.component.ts"
type State = LoadingStoreState<{ counter: number }, { message: string }>;
const mySideAction = createAction<string>(`TestAction`);
export class AppComponent {
  private store = this.storeFactory.createComponentLoadingStore<State['item'], State['error']>({
    storeName: 'LOADING_STORE',
  });

  nameEffect = this.store.loadingEffect('LOAD_NAME', (name: string) => of({ name: name }), { repeatActions: [mySideAction] });

  constructor(private storeFactory: StoreFactory) {}
}
```

### Option:autoLoad

Trigger the loader exactly once on the next microtask after the store is constructed. Only available for parameter-free effects — passing `autoLoad: true` to a parameterized effect is a compile-time error (enforced via TypeScript conditional types).

This removes the need for a manual `effect()` block in your component for init loads.

```ts title="config.store.ts"
@Injectable({ providedIn: 'root' })
export class ConfigStore {
  private store = inject(StoreFactory).createComponentLoadingStore<Config, ApiError>({
    storeName: 'CONFIG',
  });

  public state = this.store.state;

  public reload = this.store.loadingEffect('LOAD_CONFIG', () => this.api.getConfig(), {
    autoLoad: true,
  });

  constructor(private api: ConfigApi) {}
}
```

`autoLoad` fires on both server and client (SSR-correct). To suppress the duplicate fetch after hydration, combine it with `skipWhen`.

### Option:skipWhen

A pre-flight callback that is evaluated before every effect run. When it returns `true`, the dispatch is suppressed — applies to `autoLoad`, manual calls, and any other trigger.

Typical use cases:

- **SSR hydration:** skip the client-side re-fetch when state is already restored from `TransferState`.
- **Cache hits:** skip when the data is already cached.
- **Feature flags:** gate the call behind a runtime condition.

```ts title="config.store.ts"
@Injectable({ providedIn: 'root' })
export class ConfigStore {
  private store = inject(StoreFactory).createComponentLoadingStore<Config, ApiError>({
    storeName: 'CONFIG',
  });

  public state = this.store.state;

  public reload = this.store.loadingEffect('LOAD_CONFIG', () => this.api.getConfig(), {
    autoLoad: true,
    skipWhen: () => this.transferState.hasRestored('CONFIG'),
  });

  constructor(
    private api: ConfigApi,
    private transferState: StoreTransferState,
  ) {}
}
```

The library itself stays SSR-agnostic. Server-side fetching, hydration, and `TransferState` integration live in your application code; `skipWhen` is the hook the library exposes for it.

## reactiveLoadingEffect

`reactiveLoadingEffect` binds a `Signal<P>` source to the loading lifecycle. The container provides the source; the store owns the loading mechanics. It is built on top of `loadingEffect`, so action stream, DevTools, and `repeatActions` behave identically.

### Mental model: Owner / Driver vs. Consumer

- **Owner / Driver:** the one container that calls the connect function (typically a route container). Decides when and how loading happens.
- **Consumer:** any number of components that `inject()` the store and read `state()` — read-only.

The library enforces the convention with a single-connect guard: a second parallel-active connect for the same store name logs `console.error` in development mode (silent in production).

### Owner store

```ts title="professional-list.store.ts"
@Injectable({ providedIn: 'root' })
export class ProfessionalListStore {
  private store = inject(StoreFactory).createComponentLoadingStore<Professional[], ApiError>({
    storeName: 'PROFESSIONAL_LIST',
  });

  public state = this.store.state;

  public connect = this.store.reactiveLoadingEffect('load', (params: SearchParams) => this.api.search(params), { skipSameActions: true });

  constructor(private api: ProfessionalApi) {}
}
```

### Owner / Driver component

```ts title="search-page.component.ts"
@Component({
  /* ... */
})
export class SearchPageComponent {
  private filter = signal<SearchParams>({
    /* ... */
  });

  constructor() {
    inject(ProfessionalListStore).connect(this.filter);
  }
}
```

### Consumer component

```ts title="result-list.component.ts"
@Component({
  template: `<div *ngFor="let p of store.state().item">{{ p.name }}</div>`,
})
export class ResultListComponent {
  protected store = inject(ProfessionalListStore);
}
```

### Behavior notes

- A new source value during a pending loader call **cancels the in-flight request automatically** (`switchMap` behavior — not configurable).
- `DestroyRef` of the calling injection context tears down the effect and frees the connect slot when the component unmounts.
- Default `skipSameActions: false` — pass `true` for signal sources where `computed()`-derived values produce new object references on every dependency update.
- For multi-source binding, merge upstream signals with `computed()` before passing one signal to `connect` — there is no API knob for it.

### Options

```ts
reactiveLoadingEffect<P>(
  name: string,
  loader: (params: P) => Observable<ITEM>,
  options?: {
    skipSameActions?: boolean;          // default false; recommend true for signal sources
    skipSamePendingActions?: boolean;   // default false
    skipWhen?: (params: P) => boolean;  // pre-flight skip with param access
    repeatActions?: ActionCreator[];    // re-fire when any of these actions dispatch
  },
): (source: Signal<P>) => void
```

### Example for a successfully callback Observable

```ts
nameEffect = this.store.loadingEffect('LOAD_NAME', (name: string) => of({ name: name }));
```

### Example for a Error Callback Observable

```ts
nameEffect = this.store.loadingEffect('LOAD_NAME', (name: string) =>
  throwError(() => {
    errorCode: 'myError';
  }),
);
```

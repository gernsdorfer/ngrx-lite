---
sidebar_position: 1
---

# Installation

## Install the packages

`@gernsdorfer/ngrx-lite` declares the NgRx packages below as peer dependencies, so install them alongside the library.

yarn

```shell
yarn add @gernsdorfer/ngrx-lite @ngrx/store @ngrx/effects @ngrx/component-store @ngrx/operators @ngrx/store-devtools
```

npm

```shell
npm install @gernsdorfer/ngrx-lite @ngrx/store @ngrx/effects @ngrx/component-store @ngrx/operators @ngrx/store-devtools
```

:::note
Version 22 requires Angular 22 and NgRx 22. For Angular 21 use `@gernsdorfer/ngrx-lite@21`.
:::

## Provide the store

Every component store registers itself in the global `@ngrx/store` tree, so the root store has to exist.
Add the providers to your `ApplicationConfig`:

```ts title="app.config.ts"
import { ApplicationConfig } from '@angular/core';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';

export const appConfig: ApplicationConfig = {
  providers: [
    provideStore({}),
    // required if you use createEffect or repeatActions
    provideEffects([]),
  ],
};
```

```ts title="main.ts"
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

bootstrapApplication(AppComponent, appConfig);
```

:::tip
To inspect your stores in the Redux DevTools, add `provideStoreDevtools` as described in
[Store Devtools](/docs/dev-tools). The `monitor` option is mandatory there.
:::

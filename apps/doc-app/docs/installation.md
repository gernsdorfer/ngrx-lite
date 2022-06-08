---
sidebar_position: 2
---

# Installation

Install the library using Yarn or NPM

yarn
```shell
yarn add @ngrx/store @ngrx/effects @gernsdorfer/ngrx-lite
```
npm
```shell
npm install @ngrx/store @ngrx/effects @gernsdorfer/ngrx-lite
```

# Import StoreModule 

Import the `StoreModule` in your root module


```ts title="app.module.ts"
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';

@NgModule({
  imports: [
    //...
    StoreModule.forRoot({}),
    // ...
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

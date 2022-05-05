---
sidebar_position: 5

---

# Testing

Import `storeTestingFactory` as a provider in your test, to mock the redux store.

```ts title="component.spec.ts"
import {TestBed} from '@angular/core/testing';
import {storeTestingFactory} from '@gernsdorfer/ngrx-lite/testing';
import {MyComponent} from "./my.component";

TestBed.configureTestingModule({
  declarations: [MyComponent],
  providers: [storeTestingFactory()],
});
```

:::note Many Test Example you can
find [here](https://stackblitz.com/github/gernsdorfer/ngrx-lite/tree/master/apps/stackblitz-unit-test)
:::

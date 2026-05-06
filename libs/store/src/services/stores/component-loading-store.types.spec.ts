import { of } from 'rxjs';
import { describe, it } from 'vitest';
import { ComponentLoadingStore } from './component-loading-store.service';

describe('loadingEffect type constraints', () => {
  it('autoLoad is allowed only on param-free effects (compile-time)', () => {
    const checkTypes = (store: ComponentLoadingStore<string, number>) => {
      store.loadingEffect('paramless', () => of('value'), { autoLoad: true });

      store.loadingEffect<{ id: string }>(
        'withParam',
        () => of('value'),
        // @ts-expect-error autoLoad is not allowed when EFFECT_PARAMS != void
        { autoLoad: true },
      );

      store.loadingEffect<{ id: string }>(
        'withParamNoAutoLoad',
        () => of('value'),
        { skipWhen: () => false },
      );
    };

    void checkTypes;
  });
});

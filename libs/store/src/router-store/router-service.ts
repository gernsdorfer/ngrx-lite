import { inject, Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { debounceTime, filter, from, map, switchMap, takeUntil } from 'rxjs';
import { StoreFactory } from '../services';

@Injectable({ providedIn: 'root' })
export class RouterStore {
  private storeFactory = inject(StoreFactory);
  private router = inject(Router);

  private store = this.storeFactory.createComponentStore<{ url?: string }>({
    storeName: 'ROUTER_STORE',
    defaultState: {
      url: this.router.url,
    },
  });

  public state$ = this.store.state$;

  init() {
    this.router.events
      .pipe(
        takeUntil(this.store.destroy$),
        filter((routerEvent) => routerEvent instanceof NavigationEnd),
        map((routerEvent) => routerEvent as NavigationEnd),
      )
      .subscribe(({ urlAfterRedirects }) => {
        if (this.store.state().url !== urlAfterRedirects) {
          this.store.setState({ url: urlAfterRedirects }, 'URL_CHANGED');
        }
      });

    this.store.state$
      .pipe(
        takeUntil(this.store.destroy$),
        filter(({ url }) => !!url),
        map(({ url }) => url),
        debounceTime(1),
        filter((url) => this.router.url !== url),
        switchMap((url) => from(this.router.navigateByUrl(url as string))),
      )
      .subscribe();
  }
}

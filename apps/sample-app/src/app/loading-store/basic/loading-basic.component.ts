import { Component, OnDestroy } from '@angular/core';
import { LoadingStoreState, StoreFactory } from '@gernsdorfer/ngrx-lite';
import { delay, of } from 'rxjs';
import {UiModule} from "../../shared/ui/ui.module";
import {MatButtonModule} from "@angular/material/button";
import {CommonModule} from "@angular/common";

export type MyState = LoadingStoreState<
  { counter: number },
  { message: string }
>;

@Component({
  selector: 'my-app-loading-store-basic',
  templateUrl: 'loading-effect.html',
  standalone: true,
  imports: [
    UiModule,
    MatButtonModule,
    CommonModule
  ]
})
export class LoadingBasicComponent implements OnDestroy {
  private store = this.storeFactory.createComponentLoadingStore<
    MyState['item'],
    MyState['error']
  >({
    storeName: 'LOADING_BASIC',
  });

  public counterState$ = this.store.state$;

  increment = this.store.loadingEffect('INCREMENT', () =>
    of({ counter: (this.store.state.item?.counter || 0) + 1 }).pipe(delay(400))
  );

  constructor(private storeFactory: StoreFactory) {}

  ngOnDestroy() {
    this.store.ngOnDestroy();
  }
}

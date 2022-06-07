import { Component, OnDestroy } from '@angular/core';
import { StoreFactory } from '@gernsdorfer/ngrx-lite';
import {UiModule} from "../../shared/ui/ui.module";
import {MatButtonModule} from "@angular/material/button";
import {CommonModule} from "@angular/common";

export interface MyState {
  counter: number;
}

@Component({
  selector: 'my-app-basic-custom-action',
  templateUrl: 'custom-action.html',
  standalone: true,
  imports: [
    UiModule,
    MatButtonModule,
    CommonModule
  ]
})
export class CustomActionComponent implements OnDestroy {
  private store = this.storeFactory.createComponentStore<MyState>({
    storeName: 'CUSTOM_ACTION_STORE',
    defaultState: { counter: 0 },
  });

  public counterState$ = this.store.state$;

  constructor(private storeFactory: StoreFactory) {}

  increment() {
    this.store.patchState(
      ({ counter }) => ({ counter: counter + 1 }),
      'INCREMENT'
    );
  }

  ngOnDestroy() {
    this.store.ngOnDestroy();
  }
}

import { Component, OnDestroy } from '@angular/core';
import { StoreFactory } from '@gernsdorfer/ngrx-lite';
import { of } from 'rxjs';

@Component({
  selector: 'my-basic-app',
  templateUrl: 'basic.html',
})
export class BasicExampleComponent implements OnDestroy {
  private counterStore = this.storeFactory.createStore<number, never>(
    'basicCounter'
  );

  public counterState$ = this.counterStore.state$;

  public increment = this.counterStore.createLoadingEffect(
    'increment',
    (counter: number = 0) => of(counter + 1)
  );

  constructor(private storeFactory: StoreFactory) {}

  ngOnDestroy() {
    this.counterStore.ngOnDestroy();
  }
}

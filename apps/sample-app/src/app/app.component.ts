import { Component } from '@angular/core';
import { of } from 'rxjs';
import { StoreFactory } from '@gernsdorfer/ngrx-lite';

@Component({
  selector: 'ngrx-lite-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  private counterStore = this.storeFactory.getStore<number, never>('counter');

  public counterState$ = this.counterStore.state$;

  public inrement = this.counterStore.createEffect(
    'increment',
    (counter: number = 0) => of(counter + 1)
  );

  constructor(private storeFactory: StoreFactory) {}
}

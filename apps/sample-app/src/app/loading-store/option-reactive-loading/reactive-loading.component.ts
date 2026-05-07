import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { UiCardComponent } from '../../shared/ui/card-component';
import { UiSpinnerComponent } from '../../shared/ui/spinner';
import { ReactiveListStore } from './reactive-list.store';

@Component({
  selector: 'my-app-reactive-loading',
  templateUrl: 'reactive-loading.component.html',
  imports: [
    UiCardComponent,
    UiSpinnerComponent,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
})
export class ReactiveLoadingComponent {
  protected listStore = inject(ReactiveListStore);
  protected query = signal('');
  private params = computed(() => ({ query: this.query() }));
  private connected = this.listStore.connect(this.params);
}

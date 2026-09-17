import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { LoadingStoreState, StoreFactory } from '@gernsdorfer/ngrx-lite';
import { environment } from '../../environments/environment';
import { TodoModel } from '../models/todo.model';
import { createAction, updateAction } from './todo-admin.service';

export type TodoListState = LoadingStoreState<TodoModel[], never>;

@Injectable({ providedIn: 'root' })
export class TodoListStore {
  private storeFactory = inject(StoreFactory);
  private http = inject(HttpClient);
  private store = this.storeFactory.createComponentLoadingStore<
    TodoListState['item'],
    TodoListState['error']
  >({
    storeName: 'TODO_LIST',
  });
  public state = this.store.state;

  load = this.store.loadingEffect(
    'LOAD',
    () => this.http.get<TodoModel[]>(`${environment.apiUrl}/todos`),
    {
      // load once on start — no manual effect() in the component needed
      autoLoad: true,
      skipSamePendingActions: true,
      repeatActions: [updateAction, createAction],
    },
  );
}

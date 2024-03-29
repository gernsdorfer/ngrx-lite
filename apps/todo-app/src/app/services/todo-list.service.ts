import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { LoadingStoreState, StoreFactory } from '@gernsdorfer/ngrx-lite';
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
    () => this.http.get<TodoModel[]>(`http://localhost:3000/todos`).pipe(),
    {
      skipSamePendingActions: true,
      repeatActions: [updateAction, createAction],
    },
  );
}

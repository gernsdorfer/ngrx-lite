import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  EffectStates,
  getEffectAction,
  LoadingStoreState,
  StoreFactory,
} from '@gernsdorfer/ngrx-lite';
import { map } from 'rxjs';
import { TodoModel } from '../models/todo.model';

export type TodoListState = LoadingStoreState<boolean, never>;
const storeName = 'TODO_ADMIN';
const effectUpdateName = 'UPDATE';
const effectCreateName = 'CREATE';

export const updateAction = getEffectAction({
  effectName: effectUpdateName,
  type: EffectStates.SUCCESS,
  storeName,
});

export const createAction = getEffectAction({
  effectName: effectCreateName,
  type: EffectStates.SUCCESS,
  storeName,
});

@Injectable({ providedIn: 'root' })
export class TodoAdminStore {
  private storeFactory = inject(StoreFactory);
  private http = inject(HttpClient);
  private store = this.storeFactory.createComponentLoadingStore<
    TodoListState['item'],
    TodoListState['error']
  >({
    storeName: storeName,
  });

  changeCompleted = this.store.loadingEffect(
    effectUpdateName,
    ({ todoId, completed }: { todoId: number; completed: boolean }) =>
      this.http
        .patch(`http://localhost:3000/todos/${todoId}`, { completed })
        .pipe(map(() => true))
  );

  create = this.store.loadingEffect(
    effectCreateName,
    ({ title }: { title: string }) =>
      this.http
        .post(`http://localhost:3000/todos/`, <TodoModel>{
          title,
          completed: false,
        })
        .pipe(map(() => true))
  );
}

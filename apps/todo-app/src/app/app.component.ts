import { Component, effect, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { CreateComponent } from './components/create/create.component';
import { ListComponent } from './components/list/list.component';
import { CompletedPipe } from './pipes/completed.pipe';
import { TodoAdminStore } from './services/todo-admin.service';
import { TodoListStore } from './services/todo-list.service';

@Component({
  selector: 'todo-app',
  styleUrls: ['./app.scss'],
  standalone: true,
  imports: [
    RouterModule,
    ListComponent,
    MatCardModule,
    CompletedPipe,
    CreateComponent,
  ],
  templateUrl: 'app.component.html',
})
export class AppComponent {
  todoListStore = inject(TodoListStore);
  todoUpdateStore = inject(TodoAdminStore);
  todosState = this.todoListStore.state;

  private load = effect(() => this.todoListStore.load(), {
    allowSignalWrites: true,
  });

  changeCompleted(payload: { completed: boolean; todoId: number }) {
    this.todoUpdateStore.changeCompleted(payload);
  }

  create(payload: { title: string }) {
    this.todoUpdateStore.create(payload);
  }
}

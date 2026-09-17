import { Component, input, output } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatListModule } from '@angular/material/list';
import { TodoModel } from '../../models/todo.model';

@Component({
  selector: 'todo-list',
  templateUrl: 'list.component.html',
  imports: [MatListModule, MatCheckboxModule],
})
export class ListComponent {
  todos = input<TodoModel[]>([]);
  updateCompleted = output<{
    completed: boolean;
    todoId: number;
  }>();
}

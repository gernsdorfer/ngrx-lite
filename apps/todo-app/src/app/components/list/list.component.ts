import { AsyncPipe, JsonPipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatListModule } from '@angular/material/list';
import { TodoModel } from '../../models/todo.model';

@Component({
  selector: 'todo-list',
  templateUrl: 'list.component.html',
  standalone: true,
  imports: [AsyncPipe, JsonPipe, MatListModule, MatCheckboxModule],
})
export class ListComponent {
  @Input() todos?: TodoModel[] = [];
  @Output() updateCompleted = new EventEmitter<{
    completed: boolean;
    todoId: number;
  }>();
}

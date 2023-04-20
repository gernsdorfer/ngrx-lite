import { Pipe, PipeTransform } from '@angular/core';
import { TodoModel } from '../models/todo.model';

@Pipe({
  name: 'completed',
  pure: false,
  standalone: true,
})
export class CompletedPipe implements PipeTransform {
  transform(todos: TodoModel[] = [], shouldCompleted: boolean): TodoModel[] {
    return todos.filter((todo) => todo.completed === shouldCompleted);
  }
}

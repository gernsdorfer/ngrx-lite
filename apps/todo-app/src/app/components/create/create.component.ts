import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
    selector: 'todo-create',
    templateUrl: 'create.component.html',
    imports: [
        MatInputModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatIconModule,
    ]
})
export class CreateComponent {
  @Output() create = new EventEmitter<{
    title: string;
  }>();
  formGroup = new FormGroup({
    title: new FormControl('', { nonNullable: true }),
  });
}

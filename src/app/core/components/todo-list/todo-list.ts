import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import { injectTodoListStore } from '../../stores';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-todo-list',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './todo-list.html',
  styleUrl: './todo-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoList {
  readonly usersStore = injectTodoListStore();

  todoListForm = new FormGroup({
    task: new FormControl<string>(''),
  });

  onSubmit() {
    if (this.todoListForm.invalid) return;

    const taskValue = this.todoListForm.controls.task.value;

    if (taskValue) {
      const isTaskAdded = this.usersStore.addTodoTask(taskValue);

      if (isTaskAdded) {
        this.todoListForm.reset({ task: '' });
      }
    }
  }

  onDelete(itemId: string) {
    this.usersStore.deleteExistingTask(itemId);
  }
}

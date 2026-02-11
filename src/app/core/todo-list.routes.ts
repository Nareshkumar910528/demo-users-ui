import { Routes } from '@angular/router';
import { TodoListStore } from './stores';
import { TodoList } from './components/todo-list/todo-list';

export const todoListRoutes: Routes = [
  {
    path: 'todo-list',
    providers: [TodoListStore],
    children: [
      { 
        path: '', 
        component: TodoList 
      }
    ],
  },
];

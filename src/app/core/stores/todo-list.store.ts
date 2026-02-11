import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

interface TodoListDetail {
  id: string;
  item: string | null;
}

interface TTodoListState {
  list: TodoListDetail[];
}

const initialState: TTodoListState = {
  list: [],
};

export const TodoListStore = signalStore(
  withState(initialState),

  withMethods((store) => ({
    addTodoTask(item: string) {
      const itemToAdd: TodoListDetail = {
        id: crypto.randomUUID(),
        item: item,
      };
      patchState(store, {
        list: [...store.list(), itemToAdd],
      });
      return true;
    },

    deleteExistingTask(itemId: string) {
      patchState(store, { list: store.list().filter((data) => data.id !== itemId) });
    },
  })),
);

export const injectTodoListStore = () => inject(TodoListStore);

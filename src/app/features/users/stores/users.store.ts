import { signalStore, withState } from '@ngrx/signals';
import { User } from '../models/index';

interface TUsersState {
  users: User[];
  selectedId: string | null;
};

const initialState: TUsersState = {
  users: [],
  selectedId: null,
};

export const UsersStore = signalStore(
    withState(initialState),
);

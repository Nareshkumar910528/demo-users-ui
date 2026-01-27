import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { ProgressState, User } from '../models/index';
import { UserDetailsService } from '../services';
import { computed, inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe } from 'rxjs';
import { exhaustMap, filter, map, tap } from 'rxjs/operators';
import { tapResponse } from '@ngrx/operators';
import { eliminateDuplicatedUserId } from '../../../shared/utils/eliminate-duplicate.util';

interface TUsersState {
  users: User[];
  selectedUserId: string | null;
  progressState: ProgressState;
}

const initialState: TUsersState = {
  users: [],
  selectedUserId: null,
  progressState: 'idle',
};

export const PROGRESS_MESSAGE = {
  idle: 'No data loaded yet',
  loading: 'Loading is in progress',
  error: 'Error in loading',
  loaded: 'Successfully loaded',
};

export const UsersStore = signalStore(
  withState(initialState),

  withMethods((store, userDetailsService = inject(UserDetailsService)) => ({
    /**
     * rxMethod is used to replace manual subscription
     */
    loadEntireUserDetails: rxMethod<void>(
      /** compose operators to run in a controlled sequence */
      pipe(
        /** for loader purpose & clear old user data */
        tap(() => patchState(store, { users: [], progressState: 'loading' })),

        /** to prevent the function being called again when the endpoint call is in the progress */
        exhaustMap(() => {
          return userDetailsService.getAllUserDetails().pipe(
            tapResponse({
              /** update the users signal with the data being returned from endpoint */
              next: (users) => {
                patchState(store, { users, progressState: 'loaded' });
              },
              error: () => {
                patchState(store, { progressState: 'error' });
              },
            }),
          );
        }),
      ),
    ),

    select(id: string | null): void {
      patchState(store, { selectedUserId: id });
    },

    /** this method accepts an object payload */
    userExistValidation: rxMethod<{ userId: string }>(
      pipe(
        /** convert the object into a string */
        map(({ userId }) => userId),

        /** continue if userId is not in the store */
        filter((userId) => !store.users().some((data) => data.id === userId)),

        tap(() => patchState(store, { progressState: 'loading' })),
        exhaustMap((userId) => {
          return userDetailsService.getUserByUniqueId(userId).pipe(
            tapResponse({
              next: (user) => {
                if (!user) return;

                patchState(store, (state) => {
                  /** Appends the retrieved user to the users array */
                  return {
                    ...state,
                    users: eliminateDuplicatedUserId([...state.users, user]),

                    /** allow 'loaded' to stay as literal type 'loaded', not as a string */
                    progressState: 'loaded' as const,
                  };
                });
              },
              error: () => {
                patchState(store, { progressState: 'error' });
              },
            }),
          );
        }),
      ),
    ),
  })),

  withComputed((store) => ({
    /** to compute the realtime number of users */
    numberOfUsers: computed(() => store.users().length),

    /** to find and return the user based on the unique id */
    selectedUserBasedOnId: computed(() => {
      const uniqueId = store.selectedUserId();
      if (!uniqueId) return null;
      return store.users().find((data) => data.id === uniqueId) ?? null;
    }),

    /** set progress message based on the progress state */
    progressMessage: computed(() => PROGRESS_MESSAGE[store.progressState()]),
  })),

  withHooks((store) => ({
    onInit() {
      /** trigger this below method when the store is instantiated */
      store.loadEntireUserDetails();
    },
  })),
);

export const injectUsersStore = () => inject(UsersStore);

import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { ProgressState, User } from '../models/index';
import { UserDetailsService } from '../services';
import { computed, inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe } from 'rxjs';
import { exhaustMap, filter, map, tap } from 'rxjs/operators';
import { tapResponse } from '@ngrx/operators';

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
  loading: 'Loading is in progress',
  error: 'Error in loading',
  loaded: 'Successfully loaded',
} as const;

export const UsersStore = signalStore(
  withState(initialState),
  withMethods((store, userDetailsService = inject(UserDetailsService)) => ({
    /**
     * rxMethod is used to replace manual subscription
     */
    loadEntireUserDetails: rxMethod<void>(
      pipe(
        /** continue if progress is not in a loading state and user data has not been loaded */
        filter(() => {
          const state = store.progressState();
          return state !== 'loading' && state !== 'loaded';
        }),

        /** for loader purpose */
        tap(() => patchState(store, { progressState: 'loading' })),

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
    /** NEED REFACTORING AND RECHECKING. CHANGES TO BE DONE */
    userExistValidation: rxMethod<{ userId: string }>(
      pipe(
        /** convert the object into a string */
        map(({ userId }) => userId),

        /** continue if the user is missing*/
        filter((userId) => !store.users().some((data) => data.id === userId)),

        tap(() => patchState(store, { progressState: 'loading' })),
        exhaustMap((userId) => {
          return userDetailsService.getUserByUniqueId(userId).pipe(
            tapResponse({
              next: (user) => {
                if (!user) return;

                patchState(store, (state) => {
                  /** Appends the new user to the users array */
                  return {
                    ...state,
                    users: [...state.users, user],

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
  })),
);

export const injectUsersStore = () => inject(UsersStore);

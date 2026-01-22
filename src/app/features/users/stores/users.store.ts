import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { ProgressState, User } from '../models/index';
import { UserDetailsService } from '../services';
import { computed, inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe } from 'rxjs';
import { exhaustMap, filter, tap } from 'rxjs/operators';
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

export const UsersStore = signalStore(
  withState(initialState),
  withMethods((store, userDetailsService = inject(UserDetailsService)) => ({
    /**
    * rxMethod is used to replace manual subscription 
    */
    loadEntireUserDetails: rxMethod<void>(
      pipe(
        /**
        * continue if progress is not in a loading state and user data has not been loaded 
        */
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
              next: (users) => patchState(store, { users, progressState: 'loaded' }),
              error: () => patchState(store, { progressState: 'error' }),
            }),
          )}
        ),
      ),
    ),
  })),
  withComputed((store) =>({
    /** to compute the realtime number of users */
    numberOfUsers: computed(() => store.users().length),
  })),
);

export const injectUsersStore = () => inject(UsersStore);

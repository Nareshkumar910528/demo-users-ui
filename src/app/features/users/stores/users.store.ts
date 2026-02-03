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
import { pipe, timer } from 'rxjs';
import { exhaustMap, filter, map, tap } from 'rxjs/operators';
import { tapResponse } from '@ngrx/operators';
import { eliminateDuplicatedUserId } from '../../../shared/utils/eliminate-duplicate.util';

interface TUsersState {
  entireUsers: User[];
  displayedUsers: User[];
  selectedUserId: string | null;
  progressState: ProgressState;
  page: number;
  dataAmountToDisplayPerPage: number;
  hasMoreUserData: boolean;
  isUserLoggedIn: boolean;
  userDataBySelectedId: User | null;
  filteredOccupation: string | null;
}

const initialState: TUsersState = {
  entireUsers: [],
  displayedUsers: [],
  selectedUserId: null,
  progressState: 'idle',
  page: 0,
  dataAmountToDisplayPerPage: 5,
  hasMoreUserData: true,
  isUserLoggedIn: false,
  userDataBySelectedId: null,
  filteredOccupation: null
};

export const PROGRESS_MESSAGE = {
  idle: '',
  loading: 'Loading is in progress',
  error: 'Error in loading',
  loaded: 'Successfully loaded',
};

export const UsersStore = signalStore(
  withState(initialState),

  /** functions that mutate state */
  withMethods((store, userDetailsService = inject(UserDetailsService)) => ({
    /**
     * rxMethod is used to replace manual subscription
     */
    loadInitialUserData: rxMethod<void>(
      /** compose operators to run in a controlled sequence */
      pipe(
        filter(() => {
          return store.entireUsers().length === 0 && store.progressState() !== 'loading';
        }),

        /** tap() is used to perform side effects and does not transform the stream */
        tap(() =>
          patchState(store, {
            displayedUsers: [],
            progressState: 'loading',
          }),
        ),

        /** to prevent the function being called again when the endpoint call is in the progress */
        exhaustMap(() => {
          return userDetailsService.getAllUserDetails().pipe(
            /** tapResponse() is used for state handling and supports structured error handling */
            tapResponse({
              /** update the users signal with the data being returned from endpoint */
              next: (allUsersData: User[]) => {
                /** userDataToDisplay refers to the first group of data fetched */
                const userDataToDisplay = allUsersData.slice(0, store.dataAmountToDisplayPerPage());
                const isMoreUserDataExist = userDataToDisplay.length < allUsersData.length;

                /** testing purpose */
                sessionStorage.setItem('displayedUsers', JSON.stringify(userDataToDisplay));

                patchState(store, {
                  entireUsers: allUsersData,
                  displayedUsers: userDataToDisplay,
                  progressState: 'loaded',
                  page: 1,
                  hasMoreUserData: isMoreUserDataExist,
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

    loadMoreUserDataAsynchronously: rxMethod<void>(
      pipe(
        filter(() => {
          return store.progressState() !== 'loading' && store.hasMoreUserData();
        }),
        tap(() => patchState(store, { progressState: 'loading' })),
        exhaustMap(() =>
          /** timer(1000) is to simulate async operation */
          timer(1000).pipe(
            tap(() => {
              const currentPage = store.page();
              const dataAmountToDisplay = (currentPage + 1) * store.dataAmountToDisplayPerPage();

              const nextUserDataGroup = store.entireUsers().slice(0, dataAmountToDisplay);
              const isMoreUserDataExist = nextUserDataGroup.length < store.entireUsers().length;

              /** testing purpose */
              sessionStorage.setItem('displayedUsers', JSON.stringify(nextUserDataGroup));

              patchState(store, {
                displayedUsers: nextUserDataGroup,
                page: currentPage + 1,
                hasMoreUserData: isMoreUserDataExist,
                progressState: 'loaded',
              });
            }),
          ),
        ),
      ),
    ),

    getUserDataById: rxMethod<{ userId: string }>(
      pipe(
        /** convert the object into a string */
        map(({ userId }) => userId),

        tap(() =>
          patchState(store, {
            userDataBySelectedId: null,
            progressState: 'loading',
          }),
        ),
        exhaustMap((userId) => {
          return userDetailsService.getUserByUniqueId(userId).pipe(
            tapResponse({
              next: (userData) => {
                if (!userData) return;

                patchState(store, {
                  userDataBySelectedId: userData,
                  progressState: 'loaded'
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

    /** NOT IN USE AT THE MOMENT */
    loadMoreUserData(): void {
      if (store.progressState() === 'loading') return;
      if (!store.hasMoreUserData()) return;

      const currentPage = store.page();
      const dataAmountToDisplay = (currentPage + 1) * store.dataAmountToDisplayPerPage();

      const nextUserDataGroup = store.entireUsers().slice(0, dataAmountToDisplay);
      const isMoreUserDataExist = nextUserDataGroup.length < store.entireUsers().length;

      patchState(store, {
        entireUsers: store.entireUsers(),
        displayedUsers: nextUserDataGroup,
        page: currentPage + 1,
        hasMoreUserData: isMoreUserDataExist,
      });
    },

    select(id: string | null): void {
      patchState(store, { selectedUserId: id });
    },

    /** NOT IN USE AT THE MOMENT */
    /** this method accepts an object payload */
    // userExistValidation: rxMethod<{ userId: string }>(
    //   pipe(
    //     /** convert the object into a string */
    //     map(({ userId }) => userId),

    //     /** continue if userId is not in the store */
    //     filter((userId) => !store.users().some((data) => data.id === userId)),

    //     tap(() => patchState(store, { progressState: 'loading' })),
    //     exhaustMap((userId) => {
    //       return userDetailsService.getUserByUniqueId(userId).pipe(
    //         tapResponse({
    //           next: (user) => {
    //             if (!user) return;

    //             patchState(store, (state) => {
    //               /** Appends the retrieved user to the users array */
    //               return {
    //                 ...state,
    //                 users: eliminateDuplicatedUserId([...state.users, user]),

    //                 /** allow 'loaded' to stay as literal type 'loaded', not as a string */
    //                 progressState: 'loaded' as const,
    //               };
    //             });
    //           },
    //           error: () => {
    //             patchState(store, { progressState: 'error' });
    //           },
    //         }),
    //       );
    //     }),
    //   ),
    // ),

    userLogin(): void {
      patchState(store, { isUserLoggedIn: true });
      this.loadInitialUserData();
    },

    userLogout(): void {
      patchState(store, initialState);

      /** testing purpose */
      sessionStorage.removeItem('displayedUsers');
    },

    setFilteredOccupation(occupation: string): void {
      patchState(store, { filteredOccupation: occupation });
    },

    clearFilteredOcupation(): void {
      patchState(store, { filteredOccupation: null });
    }
  })),

  /** derived the state */
  withComputed((store) => ({
    /** to compute the realtime number of users */
    numberOfUsers: computed(() => store.displayedUsers().length),

    /** to find and return the user data based on the unique id */
    selectedUserBasedOnId: computed(() => {
      const uniqueId = store.selectedUserId();
      if (!uniqueId) return null;

      /** find from the entire user data instead of data being displayed */
      return store.entireUsers().find((data) => data.id === uniqueId) ?? null;
    }),

    /** set progress message based on the progress state */
    progressMessage: computed(() => PROGRESS_MESSAGE[store.progressState()]),

    /** filtered by user id */
    filteredDisplayedUsersByOccupation: computed(() => {
      if (!store.filteredOccupation()) return store.displayedUsers();
      return store.displayedUsers().filter(data => data.occupation?.toLowerCase().includes(store.filteredOccupation()!));
    })
  })),

  withHooks((store) => ({
    onInit() {
      /** trigger this below method when the store is instantiated */
      // store.loadInitialUserData();
    },
  })),
);

export const injectUsersStore = () => inject(UsersStore);

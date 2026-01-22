import { Routes } from '@angular/router';
import { UsersStore } from './stores';
import { UsersListings } from './components/containers/users-listings/users-listings';

export const usersRoutes: Routes = [
  {
    path: '',
    providers: [UsersStore],
    children: [
      { path: '', component: UsersListings },
    ],
  },
];

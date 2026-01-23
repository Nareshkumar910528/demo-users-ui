import { Routes } from '@angular/router';
import { UsersStore } from './stores';
import { UsersListings } from './components/containers/users-listings/users-listings';
import { UserDetails } from './components/containers/user-details/user-details';

export const usersRoutes: Routes = [
  {
    path: '',
    providers: [UsersStore],
    children: [
      { 
        path: '', 
        component: UsersListings 
      },
      { 
        path: ':userId', 
        component: UserDetails 
      },
    ],
  },
];

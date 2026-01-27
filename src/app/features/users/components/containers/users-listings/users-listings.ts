import { ChangeDetectionStrategy, Component } from '@angular/core';
import { injectUsersStore } from '../../../stores';
import { UsersDataTable } from '../../ui/users-data-table/users-data-table';

@Component({
  selector: 'app-users-listings',
  imports: [UsersDataTable],
  templateUrl: './users-listings.html',
  styleUrl: './users-listings.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersListings {
  readonly usersStore = injectUsersStore();
}

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { injectUsersStore } from '../../../stores';
import { UsersDataTable } from '../../ui/users-data-table/users-data-table';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-users-listings',
  imports: [UsersDataTable, RouterLink],
  templateUrl: './users-listings.html',
  styleUrl: './users-listings.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersListings {
  readonly usersStore = injectUsersStore();
}

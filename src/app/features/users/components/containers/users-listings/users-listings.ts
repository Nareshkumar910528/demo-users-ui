import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { injectUsersStore, PROGRESS_MESSAGE } from '../../../stores';
import { UsersDataTable } from '../../ui/users-data-table/users-data-table';

@Component({
  selector: 'app-users-listings',
  imports: [UsersDataTable],
  templateUrl: './users-listings.html',
  styleUrl: './users-listings.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersListings implements OnInit {
  readonly usersStore = injectUsersStore();

  progressMessage = PROGRESS_MESSAGE;

  progressData = {
    loading: 'Loading is in progress',
    error: 'Error in loading',
    loaded: 'Successfully loaded'
  };

  ngOnInit() {
    this.usersStore.loadEntireUserDetails();
  }
}

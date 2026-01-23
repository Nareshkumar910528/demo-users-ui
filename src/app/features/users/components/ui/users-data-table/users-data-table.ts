import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { User } from '../../../models';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-users-data-table',
  imports: [RouterLink],
  templateUrl: './users-data-table.html',
  styleUrl: './users-data-table.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersDataTable {
  @Input({ required: true }) usersData!: User[];

  emptyData: string = 'No data at the moment';
}

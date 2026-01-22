import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { User } from '../../../models';

@Component({
  selector: 'app-users-data-table',
  imports: [],
  templateUrl: './users-data-table.html',
  styleUrl: './users-data-table.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersDataTable {
  @Input({ required: true }) usersData!: User[];

  emptyData: string = 'No data at the moment';
}

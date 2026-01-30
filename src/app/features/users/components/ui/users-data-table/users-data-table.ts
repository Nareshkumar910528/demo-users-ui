import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { User } from '../../../models';
import { RouterLink } from '@angular/router';
import { injectUsersStore } from '../../../stores';

@Component({
  selector: 'app-users-data-table',
  imports: [RouterLink],
  templateUrl: './users-data-table.html',
  styleUrl: './users-data-table.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersDataTable {
  @Input({ required: true }) usersData!: User[];

  readonly usersStore = injectUsersStore();

  readonly emptyData: string = 'No data at the moment';

  onScrollTable($event: Event): void {
    /** scroll event */
    /** HTMLElement is a typeScript type assertion */
    const target = $event.target as HTMLElement;

    /** scrollTop: indicates how far user has scrolled */
    /** clientHeight: display height that is interactable by user */
    /** scrollHeight: total height of the page that can be scrolled */
    const isAtBottom = target.scrollTop + target.clientHeight >= target.scrollHeight - 10;

    if (isAtBottom) {
      this.usersStore.loadMoreUserDataAsynchronously();
    }
  }
}

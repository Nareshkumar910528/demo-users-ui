import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { injectUsersStore, PROGRESS_MESSAGE } from '../../../stores';
import { UserSummaryPanel } from "../../ui/user-summary-panel/user-summary-panel";

@Component({
  selector: 'app-user-details',
  imports: [UserSummaryPanel, RouterLink],
  templateUrl: './user-details.html',
  styleUrl: './user-details.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDetails implements OnInit, OnDestroy {
  readonly usersStore = injectUsersStore();
  readonly #route = inject(ActivatedRoute);

  progressMessage = PROGRESS_MESSAGE;

  ngOnInit() {
    const uniqueUserId = this.#route.snapshot.paramMap.get('userId');
    if (!uniqueUserId) return;

    /** selecting a user to view his/her details */
    this.usersStore.select(uniqueUserId);

    /** check whether the user exists in store if navigates directly here */
    this.usersStore.userExistValidation({ userId: uniqueUserId });
  }

  ngOnDestroy(): void {
    // clear the selection
    this.usersStore.select(null);
  }
}

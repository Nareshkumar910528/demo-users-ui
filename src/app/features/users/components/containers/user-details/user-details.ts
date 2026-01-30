import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { injectUsersStore } from '../../../stores';
import { UserSummaryPanel } from '../../ui/user-summary-panel/user-summary-panel';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

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

  //** converts an observable into signal, with no subscription code  */
  uniqueUserId = toSignal(this.#route.paramMap.pipe(map((params) => params.get('userId'))));

  ngOnInit() {
    if (!this.uniqueUserId()) return;

    this.usersStore.getUserDataById({ userId: this.uniqueUserId()! });

    /** selecting a user to view his/her details */
    // this.usersStore.select(this.uniqueUserId()!);

    /** check whether the user exists in store if navigates directly here */
    // this.usersStore.userExistValidation({ userId: uniqueUserId });
  }

  ngOnDestroy(): void {
    // clear the selection
    this.usersStore.select(null);
  }
}

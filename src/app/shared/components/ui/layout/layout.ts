import { ChangeDetectionStrategy, Component } from '@angular/core';
import { injectUsersStore, UsersStore } from '../../../../features/users/stores';

@Component({
  selector: 'app-layout',
  imports: [],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
  providers: [UsersStore],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Layout {
  readonly usersStore = injectUsersStore();
}

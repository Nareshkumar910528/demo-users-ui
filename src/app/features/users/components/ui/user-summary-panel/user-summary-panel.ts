import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { User } from '../../../models';

@Component({
  selector: 'app-user-summary-panel',
  imports: [],
  templateUrl: './user-summary-panel.html',
  styleUrl: './user-summary-panel.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserSummaryPanel {
  @Input() selectedUser: User | null = null;
}

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSummaryPanel } from './user-summary-panel';

describe('UserSummaryPanel', () => {
  let component: UserSummaryPanel;
  let fixture: ComponentFixture<UserSummaryPanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserSummaryPanel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserSummaryPanel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display emptyData message if no data found', () => {
    expect(component.emptyData).toBe('No user data found at the moment');
  });

  it('should have selectedUser as null by default', () => {
    expect(component.selectedUser).toBeNull();
  });
});

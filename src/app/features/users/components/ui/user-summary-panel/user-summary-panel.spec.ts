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
});

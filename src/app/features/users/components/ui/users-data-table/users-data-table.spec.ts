import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersDataTable } from './users-data-table';
import { injectUsersStore } from '../../../stores';

describe('UsersDataTable', () => {
  let component: UsersDataTable;
  let fixture: ComponentFixture<UsersDataTable>;

  const mockUsersStore = {
    loadMoreUserDataAsynchronously: () => {
      /* empty */
    },
  } as ReturnType<typeof injectUsersStore>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersDataTable],
      providers: [{ provide: 'UsersStore', useValue: mockUsersStore }],
    }).compileComponents();

    fixture = TestBed.createComponent(UsersDataTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display emptyData message if no data found', () => {
    expect(component.emptyData).toBe('No user data found at the moment');
  });

  it('onScrollTable should call loadMoreUserDataAsynchronously when scrolled to bottom', () => {
    const target = {
      scrollTop: 450,
      clientHeight: 50,
      scrollHeight: 500,
    } as unknown as HTMLElement;
    /** bypasses strict type checking, and do double casting */
    /** target is dummy scroll positioning */
    const event = { target } as unknown as Event;
    component.onScrollTable(event);
    expect(mockUsersStore.loadMoreUserDataAsynchronously).toHaveBeenCalled();
  });

  it('onScrollTable should not call loadMoreUserDataAsynchronously when not at the bottom', () => {
    const target = {
      scrollTop: 50,
      clientHeight: 50,
      scrollHeight: 500,
    } as unknown as HTMLElement;

    const event = { target } as unknown as Event;
    component.onScrollTable(event);
    expect(mockUsersStore.loadMoreUserDataAsynchronously).not.toHaveBeenCalled();
  });
});

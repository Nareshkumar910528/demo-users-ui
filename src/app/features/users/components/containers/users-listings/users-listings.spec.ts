import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersListings } from './users-listings';
import { injectUsersStore } from '../../../stores/users.store';

describe('UsersListings', () => {
  let component: UsersListings;
  let fixture: ComponentFixture<UsersListings>;

  let mockUsersStore: ReturnType<typeof injectUsersStore>;

  beforeEach(async () => {
    mockUsersStore = {} as unknown as ReturnType<typeof injectUsersStore>

    await TestBed.configureTestingModule({
      imports: [UsersListings],
      providers: [{ provide: 'UsersStore', useValue: mockUsersStore }],
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsersListings);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should inject usersStore', () => {
    expect(component.usersStore).toBe(mockUsersStore);
  });
});

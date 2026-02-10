import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDetails } from './user-details';
import { injectUsersStore } from '../../../stores';

describe('UserDetails', () => {
  let component: UserDetails;
  let fixture: ComponentFixture<UserDetails>;

  const mockUsersStore = {
    select: () => { /* empty */ },
  } as unknown as ReturnType<typeof injectUsersStore>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserDetails],
      providers: [{ provide: 'UsersStore', useValue: mockUsersStore }],
    }).compileComponents();

    fixture = TestBed.createComponent(UserDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set selected user id to null', () => {
    fixture.detectChanges();
    component.ngOnDestroy();
    expect(mockUsersStore.select).toHaveBeenCalledWith(null);
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersListings } from './users-listings';

describe('UsersListings', () => {
  let component: UsersListings;
  let fixture: ComponentFixture<UsersListings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersListings]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsersListings);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

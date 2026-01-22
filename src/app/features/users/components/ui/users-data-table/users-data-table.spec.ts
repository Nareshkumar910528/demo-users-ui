import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersDataTable } from './users-data-table';

describe('UsersDataTable', () => {
  let component: UsersDataTable;
  let fixture: ComponentFixture<UsersDataTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersDataTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsersDataTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

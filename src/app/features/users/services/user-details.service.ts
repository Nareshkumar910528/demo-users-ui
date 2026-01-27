import { Injectable } from "@angular/core";
import { User } from "../models/users";
import { delay, Observable, of } from "rxjs";

const USER_DETAILS: User[] = [
  { 
    id: '1001', 
    name: 'User 1', 
    contact: '123', 
    occupation: 'Engineer', 
    country: 'UAE' 
  },
  { 
    id: '1002', 
    name: 'User 2', 
    contact: '456',
    occupation: 'Doctor', 
    country: 'Cyprus' 
  },
  { 
    id: '1003', 
    name: 'User 3', 
    contact: '789',
    country: 'Jordan' 
  },
  { 
    id: '1004', 
    name: 'User 4', 
    contact: '012',
    occupation: 'Pilot', 
    country: 'Mauritius' 
  },
  { 
    id: '1005', 
    name: 'User 5', 
    contact: '1111',
    occupation: 'Developer', 
    country: 'England' 
  },
  { 
    id: '1006', 
    name: 'User 6', 
    contact: '0123',
    occupation: 'Specialist', 
    country: 'Canada' 
  }, 
  { 
    id: '1007', 
    name: 'User 7', 
    contact: '0987',
    country: 'Belgium' 
  },
    { 
    id: '1008', 
    name: 'User 8', 
    contact: '9999',
    occupation: 'Director', 
    country: 'Singapore' 
  }, 
  { 
    id: '1009', 
    name: 'User 9', 
    contact: '2345',
    occupation: 'Dean', 
    country: 'Japan' 
  },
  { 
    id: '1010', 
    name: 'User 10', 
    contact: '1000',
    occupation: 'Actor', 
    country: 'India' 
  },
];

@Injectable({ providedIn: 'root' })
export class UserDetailsService {
  getAllUserDetails(): Observable<User[]> {
    /** delay of 1000 milliseconds to indicate async operation */
    return of(USER_DETAILS).pipe(delay(1000));
  }

  getUserByUniqueId(id: string): Observable<User | null> {
    const foundUserId = USER_DETAILS.find(data => data.id === id);
    
    /** delay of 1000 milliseconds to indicate async operation */
    return of(foundUserId ? foundUserId : null).pipe(delay(1000));
  }
}

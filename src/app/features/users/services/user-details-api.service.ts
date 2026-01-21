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
];

@Injectable({ providedIn: 'root' })
export class UserDetailsApiService {
  getAllUserDetails(): Observable<User[]> {
    /** delay of 500 milliseconds to indicate async operation */
    return of(USER_DETAILS).pipe(delay(500));
  }

  getUserByUniqueId(id: string): Observable<User | null> {
    const foundUserId = USER_DETAILS.find(data => data.id === id);
    
    /** delay of 500 milliseconds to indicate async operation */
    return of(foundUserId ? foundUserId : null).pipe(delay(300));
  }
}

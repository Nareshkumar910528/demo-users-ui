import { User } from '../../features/users/models';

export function eliminateDuplicatedUserId(users: User[]): User[] {
  /**
   * creates a Map. key will be 'user.id' and value will be the 'User' object.
   * 'Map' helps to eliminate duplicates key
   */
  const map = new Map<string, User>();
  for (const user of users) {
    /** if the id exist, the new id will overwritten the old one */
    map.set(user.id, user);
  }
  return Array.from(map.values());
}

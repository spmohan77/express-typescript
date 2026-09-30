import { createServiceLogger } from '../utils/logger';

export class UsersRepository {
  // logger object, ready to use - no log calls added yet
  private logger = createServiceLogger('UsersRepository');

  private users: any[] = [
    { id: 1, name: 'Ada Lovelace', email: 'ada@example.com', role: 'ADMIN' },
    { id: 2, name: 'Alan Turing', email: 'alan@example.com', role: 'MEMBER' },
    { id: 3, name: 'Grace Hopper', email: 'grace@example.com', role: 'MEMBER' },
  ];

  private counter = 3;

  getAll() {
    return this.users;
  }

  findById(id) {
    for (var i = 0; i < this.users.length; i++) {
      if (this.users[i].id == id) {
        return this.users[i];
      }
    }
    return null;
  }

  create(data) {
    this.counter = this.counter + 1;
    var user = {
      id: this.counter,
      name: data.name,
      email: data.email,
      role: data.role ? data.role : 'MEMBER',
    };
    this.users.push(user);
    return user;
  }
}

import { createServiceLogger } from '../utils/logger';
import type { CreateUserInput, User } from '../models/user';

export class UsersRepository {
  private readonly logger = createServiceLogger('UsersRepository');

  private users: User[] = [
    { id: 1, name: 'Ada Lovelace', email: 'ada@example.com', role: 'ADMIN' },
    { id: 2, name: 'Alan Turing', email: 'alan@example.com', role: 'MEMBER' },
    { id: 3, name: 'Grace Hopper', email: 'grace@example.com', role: 'MEMBER' },
  ];

  private counter = 3;

  getAll(): User[] {
    // Return copies so callers cannot mutate repository state accidentally.
    return this.users.map((user) => ({ ...user }));
  }

  findById(id: number): User | null {
    const user = this.users.find((candidate) => candidate.id === id);
    return user ? { ...user } : null;
  }

  findByEmail(email: string): User | null {
    const normalizedEmail = email.trim().toLowerCase();
    const user = this.users.find((candidate) => candidate.email === normalizedEmail);
    return user ? { ...user } : null;
  }

  create(data: CreateUserInput): User {
    const normalizedEmail = data.email.trim().toLowerCase();

    if (this.findByEmail(normalizedEmail)) {
      throw new Error('USER_EMAIL_EXISTS');
    }

    const user: User = {
      id: ++this.counter,
      name: data.name.trim(),
      email: normalizedEmail,
      role: data.role,
    };

    this.users.push(user);
    this.logger.info({ userId: user.id }, 'user created');

    return { ...user };
  }
}

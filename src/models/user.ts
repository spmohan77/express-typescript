export type UserRole = 'ADMIN' | 'MEMBER';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

export interface CreateUserInput {
  name: string;
  email: string;
  role: UserRole;
}

import { User } from 'src/users/entities/user.entity';

export const getUserWithoutPassword = (user: User) => {
  const userWithoutPassword = { ...user };
  delete userWithoutPassword.password;
  return userWithoutPassword;
};

import { UserPrisma } from '@prisma/client';

export const getUserWithoutPassword = (user: UserPrisma) => {
  const userWithoutPassword = { ...user };
  delete userWithoutPassword.password;
  return userWithoutPassword;
};

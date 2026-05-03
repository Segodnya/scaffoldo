import { auth, currentUser } from '@clerk/nextjs/server';
import { db } from '@__PROJECT_SLUG__/db';
import { AppError } from '@__PROJECT_SLUG__/core';
import type { User } from '@__PROJECT_SLUG__/db';

export const requireUserId = async (): Promise<string> => {
  const { userId } = await auth();
  if (!userId) throw new AppError('unauthorized', 'Sign-in required.');
  return userId;
};

export const getCurrentDbUser = async (): Promise<User | null> => {
  const { userId } = await auth();
  if (!userId) return null;
  return db.user.findUnique({ where: { id: userId } });
};

export const requireDbUser = async (): Promise<User> => {
  const user = await getCurrentDbUser();
  if (!user) throw new AppError('unauthorized', 'Sign-in required.');
  return user;
};

export { auth, currentUser };

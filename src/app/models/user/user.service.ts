// get user by Id

import { redis } from '../../../redis';

const getUserById = async (id: string) => {
  const userJson = await redis.get(id);
  if (userJson) {
    const result = JSON.parse(userJson);
    return result;
  }
  return 'User not Found';
};

export const userService = {
  getUserById,
};

import { redis } from '../../../redis';
import userModel from './user.model';

// * get user by Id
const getUserById = async (id: string) => {
  const userJson = await redis.get(id);
  if (userJson) {
    const result = JSON.parse(userJson);
    return result;
  }
  return 'User not Found';
};
const getAllUser = async () => {
  const result = await userModel.find().sort({ createdAt: -1 });
  return result;
};

export const userService = {
  getUserById,
  getAllUser,
};

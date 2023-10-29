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

// * get all user
const getAllUser = async () => {
  const result = await userModel.find().sort({ createdAt: -1 });
  return result;
};

// * update user role
const updateUserRole = async (id: string, role: string) => {
  const result = await userModel.findByIdAndUpdate(id, { role }, { new: true });
  console.log(result);
  return result;
};

// * delete user
const deleteUser = async (id: string) => {
  const user = await userModel.findById(id);
  if (!user) {
    return 'user Not Found';
  }
  const result = await userModel.findByIdAndDelete(id);
  await redis.del(id);
  return result;
};

export const userService = {
  getUserById,
  getAllUser,
  updateUserRole,
  deleteUser,
};

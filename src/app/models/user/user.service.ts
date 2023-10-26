// get user by Id

import userModel from './user.model';

const getUserById = async (id: string) => {
  const result = await userModel.findById(id);
  return result;
};

export const userService = {
  getUserById,
};

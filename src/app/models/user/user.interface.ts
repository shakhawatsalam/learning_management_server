/* eslint-disable @typescript-eslint/consistent-type-definitions */

import { Document } from 'mongoose';

// * user interface
export interface IUser extends Document {
  _id?: string;
  isModified(field: string): boolean;
  name: string;
  email: string;
  password: string;
  avatar: {
    public_id: string;
    url: string;
  };
  role: string;
  isVerified: boolean;
  courses: Array<{ courseId: string }>;
  comparePassword: (password: string) => Promise<boolean>;
  SignAccessToken: () => string;
  SignRefreshToken: () => string;
}

// * registration user
export interface IRegistrationBody {
  name: string;
  email: string;
  password: string;
  avater?: string;
}

// * activate user
export interface IActivationRequest {
  activation_token: string;
  activation_code: string;
}

// *Login User
export interface ILoginRequest {
  email: string;
  password: string;
}

// * Social Auth Body
export interface ISocialAuthBody {
  email: string;
  name: string;
  avater: string;
}

// * update user info
export interface IUpdateUserInfo {
  name?: string;
  email?: string;
}

// * update user password
export interface IUpdateUserPassword {
  oldPassword: string;
  newPassword: string;
}

// * update profie picture
export interface IUpdateProfilePicture {
  avatar: string;
}

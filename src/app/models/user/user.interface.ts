/* eslint-disable @typescript-eslint/consistent-type-definitions */

export interface IUser {
  _id?: string;
  isModified(arg0: string): unknown;
  name: string;
  email: string;
  password: string;
  avater: {
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

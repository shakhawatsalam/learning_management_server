/* eslint-disable @typescript-eslint/consistent-type-definitions */

export interface IUser {
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
}

// * registration user
export interface IRegistrationBody {
  name: string;
  email: string;
  password: string;
  avater?: string;
}

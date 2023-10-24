/* eslint-disable @typescript-eslint/no-explicit-any */
import jwt from 'jsonwebtoken';
import config from '../config';
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
interface IActivationToken {
  token: string;
  activationCode: string;
}

const createActivationToken = (user: any): IActivationToken => {
  const activationCode = Math.floor(1000 + Math.random() * 9000).toString();

  const token = jwt.sign(
    {
      user,
      activationCode,
    },
    config.jwt_secret as string,
    {
      expiresIn: '5m',
    },
  );
  return { token, activationCode };
};

export const jwtHeapers = {
  createActivationToken,
};

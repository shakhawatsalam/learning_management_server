import { IUser } from '../app/models/user/user.interface';
import config from '../config';
import { Response } from 'express';
import { redis } from '../redis';

type ITokenOptions = {
  expires: Date;
  maxAge: number;
  httpOnly: boolean;
  sameSite: 'lax' | 'strict' | 'none' | undefined;
  secure?: boolean;
};

export const sendToke = (user: IUser, statusCode: number, res: Response) => {
  const accessToken = user.SignAccessToken();
  const refreshToke = user.SignRefreshToken();

  // * upload session to Redis
  redis.set(user._id!, JSON.stringify(user));

  // * parse environment variables to intergrates with fallback values
  const accessTokenExpire = parseInt(config.access_token_expire || '300', 10);
  const refreshTokenExpire = parseInt(config.refresh_token_expire || '300', 10);

  // * 🍪🍪 Options for Cookies 🍪🍪
  const accessTokenOptions: ITokenOptions = {
    expires: new Date(Date.now() + accessTokenExpire * 1000),
    maxAge: accessTokenExpire * 1000,
    httpOnly: true,
    sameSite: 'lax',
  };
  const refreshTokenOptions: ITokenOptions = {
    expires: new Date(Date.now() + refreshTokenExpire * 1000),
    maxAge: refreshTokenExpire * 1000,
    httpOnly: true,
    sameSite: 'lax',
  };

  // * only set secure to true in production
  if (config.node_env === 'production') {
    accessTokenOptions.secure = true;
  }

  res.cookie('access_token', accessToken, accessTokenOptions);
  res.cookie('refresh_token', refreshToke, refreshTokenOptions);
  res.status(statusCode).json({
    success: true,
    user,
    accessToken,
  });
};

import * as jwt from 'jsonwebtoken';



const ACCESS_TOKEN_SECRET = process.env.JWT_SECRET;
const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET;

if (!ACCESS_TOKEN_SECRET) {
  throw new Error('JWT_SECRET environment variable is not defined');
}

if (!REFRESH_TOKEN_SECRET) {
  throw new Error('JWT_REFRESH_SECRET environment variable is not defined');
}


export function signAccessToken(payload: object, expiresIn: string = '15m'): string {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET!, { expiresIn });
}

export function signRefreshToken(payload: object, expiresIn: string = '7d'): string {
  return jwt.sign(payload, REFRESH_TOKEN_SECRET!, { expiresIn });
}

export function verifyAccessToken(token: string): any {
  try {
    return jwt.verify(token, ACCESS_TOKEN_SECRET!);
  } catch (err) {
    return null;
  }
}

export function verifyRefreshToken(token: string): any {
  try {
    return jwt.verify(token, REFRESH_TOKEN_SECRET!);
  } catch (err) {
    return null;
  }
}

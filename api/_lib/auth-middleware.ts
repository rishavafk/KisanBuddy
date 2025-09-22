import { VercelRequest } from '@vercel/node';
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.SESSION_SECRET || 'default-secret-key';

export interface AuthUser {
  userId: string;
  username: string;
}

export function authenticateToken(req: VercelRequest): AuthUser | null {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return null;
  }

  try {
    const user = jwt.verify(token, JWT_SECRET) as AuthUser;
    return user;
  } catch (err) {
    return null;
  }
}

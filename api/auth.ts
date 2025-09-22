import type { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { storage } from '../server/storage';
import { insertUserSchema, loginSchema } from '../shared/schema';

const JWT_SECRET = process.env.SESSION_SECRET || 'fallback-secret-key';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { action } = req.query;

  try {
    switch (action) {
      case 'signup':
        return handleSignup(req, res);
      case 'login':
        return handleLogin(req, res);
      case 'me':
        return handleMe(req, res);
      default:
        return res.status(404).json({ message: 'Auth action not found' });
    }
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function handleSignup(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const validatedData = insertUserSchema.parse(req.body);
  const hashedPassword = await bcrypt.hash(validatedData.password, 10);

  const newUser = await storage.createUser({
    ...validatedData,
    password: hashedPassword,
    role: 'farmer'
  });

  const token = jwt.sign(
    { userId: newUser.id, username: newUser.username },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  const { password, ...userWithoutPassword } = newUser;
  return res.status(201).json({
    message: 'User created successfully',
    user: userWithoutPassword,
    token
  });
}

async function handleLogin(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { username, password } = loginSchema.parse(req.body);
  const user = await storage.getUserByUsername(username);

  if (!user || !await bcrypt.compare(password, user.password)) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { userId: user.id, username: user.username },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  const { password: _, ...userWithoutPassword } = user;
  return res.status(200).json({
    message: 'Login successful',
    user: userWithoutPassword,
    token
  });
}

async function handleMe(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const user = await storage.getUser(decoded.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { password, ...userWithoutPassword } = user;
    return res.status(200).json({ user: userWithoutPassword });
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}


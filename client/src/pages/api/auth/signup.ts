import { NextApiRequest, NextApiResponse } from 'next';
import { insertUserSchema } from "../../../../../shared/schema";
import { storage } from "../../../lib/storage";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.SESSION_SECRET || 'default-secret-key';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const userData = insertUserSchema.parse(req.body);
    
    // Check if user already exists
    const existingUser = await storage.getUserByUsername(userData.username) || 
                        await storage.getUserByEmail(userData.email);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = await storage.createUser({ ...userData, password: hashedPassword });

    // Generate JWT token
    const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ 
      user: { id: user.id, username: user.username, email: user.email, fullName: user.fullName, role: user.role },
      token 
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}

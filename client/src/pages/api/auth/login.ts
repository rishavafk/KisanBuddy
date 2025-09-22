import { NextApiRequest, NextApiResponse } from 'next';
import { loginSchema } from "../../../../../shared/schema";
import { storage } from "../../../lib/storage";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.SESSION_SECRET || 'default-secret-key';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const credentials = loginSchema.parse(req.body);
    const user = await storage.getUserByUsername(credentials.username);
    
    if (!user || !await bcrypt.compare(credentials.password, user.password)) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, { expiresIn: '7d' });

    res.json({ 
      user: { id: user.id, username: user.username, email: user.email, fullName: user.fullName, role: user.role },
      token 
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}

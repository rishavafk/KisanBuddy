import { NextApiRequest, NextApiResponse } from 'next';
import { storage } from "../../../lib/storage";
import { authenticateToken } from "../../../lib/auth-middleware";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const user = authenticateToken(req);
  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const userData = await storage.getUser(user.userId);
    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ 
      user: { id: userData.id, username: userData.username, email: userData.email, fullName: userData.fullName, role: userData.role }
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

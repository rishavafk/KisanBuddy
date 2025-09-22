import { VercelRequest, VercelResponse } from '@vercel/node';
import { insertFieldSchema } from "../../shared/schema";
import { storage } from "../../server/storage";
import { authenticateToken } from "../_lib/auth-middleware";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const user = authenticateToken(req);
  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    try {
      const fields = await storage.getFieldsByUserId(user.userId);
      res.json(fields);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  } else if (req.method === 'POST') {
    try {
      const fieldData = insertFieldSchema.parse({ ...req.body, userId: user.userId });
      const field = await storage.createField(fieldData);
      res.status(201).json(field);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}

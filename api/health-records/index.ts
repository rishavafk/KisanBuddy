import { VercelRequest, VercelResponse } from '@vercel/node';
import { insertPlantHealthRecordSchema } from "../../shared/schema";
import { storage } from "../../server/storage";
import { authenticateToken } from "../_lib/auth-middleware";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const user = authenticateToken(req);
  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    try {
      const records = await storage.getHealthRecordsByUserId(user.userId);
      res.json(records);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  } else if (req.method === 'POST') {
    try {
      const dataWithUser = { ...req.body, userId: user.userId };
      const recordData = insertPlantHealthRecordSchema.parse(dataWithUser);
      const record = await storage.createHealthRecord(recordData);
      res.status(201).json(record);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}

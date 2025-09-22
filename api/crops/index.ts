import { VercelRequest, VercelResponse } from '@vercel/node';
import { insertCropSchema } from "../../shared/schema";
import { storage } from "../../server/storage";
import { authenticateToken } from "../_lib/auth-middleware";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const user = authenticateToken(req);
  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    try {
      const crops = await storage.getCropsByUserId(user.userId);
      res.json(crops);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  } else if (req.method === 'POST') {
    try {
      const cropData = insertCropSchema.parse({ ...req.body, userId: user.userId });
      const crop = await storage.createCrop(cropData);
      res.status(201).json(crop);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}

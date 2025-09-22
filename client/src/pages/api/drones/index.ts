import { NextApiRequest, NextApiResponse } from 'next';
import { insertDroneConnectionSchema } from "../../../../../shared/schema";
import { storage } from "../../../lib/storage";
import { authenticateToken } from "../../../lib/auth-middleware";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = authenticateToken(req);
  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    try {
      const drones = await storage.getDronesByUserId(user.userId);
      res.json(drones);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  } else if (req.method === 'POST') {
    try {
      const droneData = insertDroneConnectionSchema.parse({ ...req.body, userId: user.userId });
      const drone = await storage.createDroneConnection(droneData);
      res.status(201).json(drone);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}

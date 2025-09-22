import { NextApiRequest, NextApiResponse } from 'next';
import { insertPesticideApplicationSchema } from "../../../../../shared/schema";
import { storage } from "../../../lib/storage";
import { authenticateToken } from "../../../lib/auth-middleware";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = authenticateToken(req);
  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    try {
      const applications = await storage.getPesticideApplicationsByUserId(user.userId);
      res.json(applications);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  } else if (req.method === 'POST') {
    try {
      const dataWithUser = { ...req.body, userId: user.userId };
      const applicationData = insertPesticideApplicationSchema.parse(dataWithUser);
      const application = await storage.createPesticideApplication(applicationData);
      res.status(201).json(application);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}

import { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from "../../server/storage";
import { authenticateToken } from "../_lib/auth-middleware";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const user = authenticateToken(req);
  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { id } = req.query;
  if (typeof id !== 'string') {
    return res.status(400).json({ message: 'Invalid application ID' });
  }

  if (req.method === 'PUT') {
    try {
      const application = await storage.updatePesticideApplication(id, req.body);
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }
      res.json(application);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}

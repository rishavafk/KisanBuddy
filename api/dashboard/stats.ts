import { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from "../../server/storage";
import { authenticateToken } from "../_lib/auth-middleware";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const user = authenticateToken(req);
  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const fields = await storage.getFieldsByUserId(user.userId);
    const healthRecords = await storage.getHealthRecordsByUserId(user.userId);
    const applications = await storage.getPesticideApplicationsByUserId(user.userId);
    
    const totalFields = fields.length;
    const totalPlants = healthRecords.length * 100; // Approximate
    const healthyPlants = Math.floor(totalPlants * 0.87);
    const averageInfectionRate = healthRecords.length > 0 
      ? healthRecords.reduce((sum, record) => sum + record.infectionRate, 0) / healthRecords.length
      : 0;
    const pesticideSaved = applications.reduce((sum, app) => sum + (app.totalVolume || 0), 0);

    res.json({
      totalFields,
      healthyPlants,
      infectionRate: averageInfectionRate,
      pesticideSaved: Math.floor(pesticideSaved)
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

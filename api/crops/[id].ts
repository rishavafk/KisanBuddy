import { VercelRequest, VercelResponse } from '@vercel/node';
import { insertCropSchema } from "../../shared/schema";
import { storage } from "../../server/storage";
import { authenticateToken } from "../_lib/auth-middleware";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const user = authenticateToken(req);
  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { id } = req.query;
  if (typeof id !== 'string') {
    return res.status(400).json({ message: 'Invalid crop ID' });
  }

  if (req.method === 'PUT') {
    try {
      // First check if crop exists and belongs to the authenticated user
      const existingCrop = await storage.getCrop(id);
      if (!existingCrop) {
        return res.status(404).json({ message: "Crop not found" });
      }
      
      if (existingCrop.userId !== user.userId) {
        return res.status(403).json({ message: "You can only update your own crops" });
      }

      // Validate the update data using a strict partial schema (exclude userId since it shouldn't be updated)
      const updateSchema = insertCropSchema.omit({ userId: true }).partial().strict();
      const validatedData = updateSchema.parse(req.body);
      
      const crop = await storage.updateCrop(id, validatedData);
      if (!crop) {
        return res.status(404).json({ message: "Crop not found" });
      }
      res.json(crop);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  } else if (req.method === 'DELETE') {
    try {
      // First check if crop exists and belongs to the authenticated user
      const existingCrop = await storage.getCrop(id);
      if (!existingCrop) {
        return res.status(404).json({ message: "Crop not found" });
      }
      
      if (existingCrop.userId !== user.userId) {
        return res.status(403).json({ message: "You can only delete your own crops" });
      }

      const deleted = await storage.deleteCrop(id);
      if (!deleted) {
        return res.status(500).json({ message: "Failed to delete crop" });
      }
      
      res.status(200).json({ message: "Crop deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}

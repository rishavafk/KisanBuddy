import { VercelRequest, VercelResponse } from '@vercel/node';
import { insertContactMessageSchema } from "../../shared/schema";
import { storage } from "../../server/storage";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const messageData = insertContactMessageSchema.parse(req.body);
    const message = await storage.createContactMessage(messageData);
    res.status(201).json({ message: "Message sent successfully" });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}

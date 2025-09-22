import 'dotenv/config';
import express from "express";
import { registerRoutes } from "./routes";
import cors from "cors";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Enable CORS for production
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve static files from the built client
app.use(express.static(path.join(__dirname, '../client/dist')));

// API routes
const startServer = async () => {
  await registerRoutes(app);
  
  // Catch-all handler: send back React's index.html file for client-side routing
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
  
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`🚀 Production server running on port ${port}`);
  });
};

startServer().catch(console.error);

import 'dotenv/config';
import express from "express";
import { registerRoutes } from "./routes";
import cors from "cors";

const app = express();

// Enable CORS for local development
app.use(cors({
  origin: 'http://localhost:5173', // Vite dev server
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Simple logging middleware for development
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

const startServer = async () => {
  await registerRoutes(app);
  
  const port = 3001;
  app.listen(port, () => {
    console.log(`🚀 Development API server running on http://localhost:${port}`);
    console.log(`📱 Frontend should run on http://localhost:5173`);
  });
};

startServer().catch(console.error);

import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateFloorPlan } from "./ai-generator";

export async function registerRoutes(app: Express): Promise<Server> {
  // AI Floor Plan Generation
  app.post("/api/generate-floor-plan", async (req, res) => {
    try {
      const { prompt } = req.body;
      
      if (!prompt || typeof prompt !== "string") {
        return res.status(400).json({ error: "Prompt is required" });
      }

      const floorPlan = await generateFloorPlan(prompt);
      res.json(floorPlan);
    } catch (error: any) {
      console.error("Generation error:", error);
      res.status(500).json({ error: error.message || "Failed to generate floor plan" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}

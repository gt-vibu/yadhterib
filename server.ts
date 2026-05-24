import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // We increase body limits so the high-quality base64 image strings can be uploaded and saved perfectly!
  app.use(express.json({ limit: "15mb" }));
  app.use(express.urlencoded({ limit: "15mb", extended: true }));

  // Directory to store saved configurations
  const configsDir = path.join(process.cwd(), "app_configs");
  if (!fs.existsSync(configsDir)) {
    try {
      fs.mkdirSync(configsDir, { recursive: true });
    } catch (err) {
      console.error("Failed to create configs directory:", err);
    }
  }

  // Local memory cache
  const memoryCache = new Map<string, any>();

  // API Route: Save configuration
  app.post("/api/config/save", (req, res) => {
    try {
      const configState = req.body;
      if (!configState || typeof configState !== "object") {
        return res.status(400).json({ error: "Invalid configuration state payload" });
      }

      // Generate a clean, extremely short random ID (5 alphanumeric characters)
      const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      let shortId = "";
      for (let i = 0; i < 6; i++) {
        shortId += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
      }

      // Store in memory
      memoryCache.set(shortId, configState);

      // Store in file system (app_configs/<id>.json) for durability
      const filePath = path.join(configsDir, `${shortId}.json`);
      fs.writeFileSync(filePath, JSON.stringify(configState, null, 2), "utf8");

      console.log(`Saved configuration with short ID: ${shortId}`);
      return res.json({ id: shortId, success: true });
    } catch (err: any) {
      console.error("Save config error:", err);
      return res.status(500).json({ error: "Could not save configuration. " + err.message });
    }
  });

  // API Route: Get configuration values
  app.get("/api/config/:id", (req, res) => {
    try {
      const id = req.params.id;
      if (!id || typeof id !== "string") {
        return res.status(400).json({ error: "Missing or invalid configuration ID" });
      }

      // 1. Try memory cache first (ultra-fast)
      if (memoryCache.has(id)) {
        return res.json(memoryCache.get(id));
      }

      // 2. Try file system
      const filePath = path.join(configsDir, `${id}.json`);
      if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, "utf8");
        const parsed = JSON.parse(fileContent);
        // Cache it for subsequent requests
        memoryCache.set(id, parsed);
        return res.json(parsed);
      }

      return res.status(404).json({ error: "Configuration not found" });
    } catch (err: any) {
      console.error("Get config error:", err);
      return res.status(500).json({ error: "Failed to read configuration: " + err.message });
    }
  });

  // Health check API
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Vite development middleware vs Static Production files serving
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[FULLSTACK SERVER] Operating live on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Server boot crashed:", err);
});

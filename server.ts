import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", mode: "hybrid-saas", timestamp: new Date().toISOString() });
  });

  // Mock Receipt Verification API Endpoint
  app.get("/api/verify-receipt/:receiptId", (req, res) => {
    const { receiptId } = req.params;
    res.json({
      receipt_id: receiptId,
      status: "VALID",
      verified_at: new Date().toISOString(),
      school_name: "Complexe Scolaire Espoir",
      school_id: "sch_espoir_01",
      amount_paid: "150,000 FC",
      payment_method: "ESPECES (Caisse Principal)",
      student_name: "KABAMBA Marc",
      student_code: "STU-2026-089",
      hash: "a8f391b4c902781d4e02"
    });
  });

  // Vite middleware for development
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
    console.log(`[APP ECOLE] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

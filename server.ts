import "dotenv/config";
import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("analytics.db");

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    ip TEXT,
    city TEXT,
    country TEXT,
    start_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_heartbeat DATETIME DEFAULT CURRENT_TIMESTAMP,
    duration_seconds INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS shared_palaces (
    code TEXT PRIMARY KEY,
    title TEXT,
    author TEXT,
    notes_json TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    visits INTEGER DEFAULT 0
  );
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Analytics API
  app.post("/api/analytics/heartbeat", async (req, res) => {
    const { sessionId } = req.body;
    const rawIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "127.0.0.1";
    const clientIp = Array.isArray(rawIp) ? rawIp[0] : String(rawIp).split(",")[0].trim();
    
    try {
      // Use INSERT OR IGNORE to handle race conditions
      const insertStmt = db.prepare("INSERT OR IGNORE INTO sessions (id, ip, city, country) VALUES (?, ?, 'Pending', 'Pending')");
      const result = insertStmt.run(sessionId, clientIp);

      if (result.changes > 0) {
        // New session, perform GeoIP lookup in background
        if (clientIp && clientIp !== "127.0.0.1" && clientIp !== "::1") {
          fetch(`https://ipapi.co/${clientIp}/json/`)
            .then(res => res.json())
            .then(geoData => {
              if (geoData && geoData.city) {
                db.prepare("UPDATE sessions SET city = ?, country = ? WHERE id = ?")
                  .run(geoData.city || "Unknown", geoData.country_name || "Unknown", sessionId);
              }
            })
            .catch(e => console.error("GeoIP lookup failed", e));
        }
      }

      // Always update heartbeat and duration
      const existing = db.prepare("SELECT start_time FROM sessions WHERE id = ?").get(sessionId) as any;
      if (existing) {
        const now = new Date();
        const startTime = new Date(existing.start_time + "Z"); // Ensure UTC
        const duration = Math.floor((now.getTime() - startTime.getTime()) / 1000);
        
        db.prepare("UPDATE sessions SET last_heartbeat = CURRENT_TIMESTAMP, duration_seconds = ? WHERE id = ?")
          .run(duration, sessionId);
      }
      
      res.json({ success: true });
    } catch (e) {
      console.error("Analytics error", e);
      res.status(500).json({ error: "Failed to track" });
    }
  });

  // Admin API to get stats
  app.get("/api/analytics/stats", (req, res) => {
    const totalVisits = db.prepare("SELECT COUNT(*) as count FROM sessions").get() as any;
    const uniqueIps = db.prepare("SELECT COUNT(DISTINCT ip) as count FROM sessions").get() as any;
    const cities = db.prepare("SELECT city, COUNT(*) as count FROM sessions GROUP BY city ORDER BY count DESC LIMIT 10").all();
    const avgDuration = db.prepare("SELECT AVG(duration_seconds) as avg FROM sessions WHERE duration_seconds > 0").get() as any;
    const recentSessions = db.prepare("SELECT * FROM sessions ORDER BY last_heartbeat DESC LIMIT 5").all();

    res.json({
      totalVisits: totalVisits.count,
      uniqueIps: uniqueIps.count,
      cities,
      avgDuration: Math.round(avgDuration.avg || 0),
      recentSessions
    });
  });

  // Share a Mind Palace
  app.post("/api/palace/share", (req, res) => {
    try {
      const { title, author, notes } = req.body;
      if (!Array.isArray(notes) || notes.length === 0) {
        return res.status(400).json({ error: "No notes provided to share" });
      }

      // Generate a 6-character friendly code e.g. PAL-7K9A
      const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
      const code = `PAL-${randomSuffix}`;
      const palaceTitle = (title || "我的记忆宫殿").trim();
      const palaceAuthor = (author || "书友").trim();

      const stmt = db.prepare(`
        INSERT INTO shared_palaces (code, title, author, notes_json)
        VALUES (?, ?, ?, ?)
      `);
      stmt.run(code, palaceTitle, palaceAuthor, JSON.stringify(notes));

      res.json({
        success: true,
        code,
        title: palaceTitle,
        author: palaceAuthor,
        notesCount: notes.length
      });
    } catch (e) {
      console.error("Palace share error", e);
      res.status(500).json({ error: "Failed to share palace" });
    }
  });

  // Get a shared Mind Palace by Code
  app.get("/api/palace/:code", (req, res) => {
    try {
      const code = req.params.code.trim().toUpperCase();
      const stmt = db.prepare("SELECT * FROM shared_palaces WHERE UPPER(code) = ?");
      const row = stmt.get(code) as any;

      if (!row) {
        return res.status(404).json({ error: "Palace not found with this code" });
      }

      // Increment visits counter
      db.prepare("UPDATE shared_palaces SET visits = visits + 1 WHERE code = ?").run(row.code);

      const notes = JSON.parse(row.notes_json);
      res.json({
        success: true,
        code: row.code,
        title: row.title,
        author: row.author,
        createdAt: row.created_at,
        visits: row.visits + 1,
        notes
      });
    } catch (e) {
      console.error("Palace fetch error", e);
      res.status(500).json({ error: "Failed to fetch palace" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

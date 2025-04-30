import express from "express";
import sqlite3 from "sqlite3";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

interface PurchaseRecord {
  count: number;
}

const db = new sqlite3.Database("corn.db");

db.run(`
  CREATE TABLE IF NOT EXISTS purchases (
    client_id TEXT,
    purchase_time INTEGER,
    PRIMARY KEY (client_id, purchase_time)
  )
`);

app.post("/buy-corn", (req, res) => {
  const clientId = req.body.clientId;
  const currentTime = Date.now();
  const oneMinuteAgo = currentTime - 60000;

  db.get<PurchaseRecord>(
    "SELECT COUNT(*) as count FROM purchases WHERE client_id = ? AND purchase_time > ?",
    [clientId, oneMinuteAgo],
    (err: Error | null, row: PurchaseRecord) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Database error" });
      }

      if (row.count > 0) {
        return res.status(429).json({ error: "Too many requests" });
      }

      db.run(
        "INSERT INTO purchases (client_id, purchase_time) VALUES (?, ?)",
        [clientId, currentTime],
        (err: Error | null) => {
          if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Database error" });
          }
          db.get<PurchaseRecord>(
            "SELECT COUNT(*) as count FROM purchases WHERE client_id = ?",
            [clientId],
            (err: Error | null, row: PurchaseRecord) => {
              if (err) {
                console.error("Database error:", err);
                return res.status(500).json({ error: "Database error" });
              }
              res.status(200).json({
                message: "Corn purchased successfully! 🌽",
                purchases: row.count,
              });
            }
          );
        }
      );
    }
  );
});

app.get("/purchases/:clientId", (req, res) => {
  const { clientId } = req.params;
  db.get<PurchaseRecord>(
    "SELECT COUNT(*) as count FROM purchases WHERE client_id = ?",
    [clientId],
    (err: Error | null, row: PurchaseRecord) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Database error" });
      }
      res.json({ purchases: row.count });
    }
  );
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

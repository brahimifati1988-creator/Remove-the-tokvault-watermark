import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.API_KEY;

/* ===============================
   Security & Middleware
================================ */

app.use(cors({
  origin: "*",
  methods: ["POST"],
}));

app.use(express.json({ limit: "1mb" }));

// Rate Limit: 60 requests / 15 min áßá IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/download", limiter);

/* ===============================
   Health Check
================================ */

app.get("/", (req, res) => {
  res.json({ status: "TokVault API is running ?" });
});

/* ===============================
   Download Endpoint
================================ */

app.post("/download", async (req, res) => {
  try {
    const { url, quality } = req.body;

    if (!url || !quality) {
      return res.status(400).json({ error: "Missing parameters" });
    }

    if (!["hd", "4k", "mp3"].includes(quality)) {
      return res.status(400).json({ error: "Invalid quality" });
    }

    // ?? ÍãÇíÉ API Key (ãä ÇáÓíÑÝÑ ÝÞØ)
    const clientKey = req.headers["x-api-key"];
    if (clientKey !== API_KEY) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    // ?? ãËÇá: ÇÓÊÎÏÇã API ÎÇÑÌí (ÖÚ ãÒæÏß ÇáÍÞíÞí åäÇ)
    // åÐÇ ãÌÑÏ ãËÇá Âãä
    const externalApi = "https://api.tikwm.com/video/info?url=" + encodeURIComponent(url);

    const response = await fetch(externalApi);
    const data = await response.json();

    if (!data || !data.data) {
      throw new Error("Failed to fetch video");
    }

    if (quality === "mp3") {
      return res.json({
        audio: data.data.music
      });
    }

    const videoUrl =
      quality === "4k"
        ? data.data.play
        : data.data.play;

    return res.json({
      video: videoUrl
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

/* ===============================
   Start Server
================================ */

app.listen(PORT, () => {
  console.log(`? TokVault API running on port ${PORT}`);
});
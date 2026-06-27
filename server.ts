import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

// Middleware for parsing JSON requests
app.use(express.json());

// Initialize Gemini Client safely with telemetry header
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("Warning: GEMINI_API_KEY environment variable is not set. Chatbot responses will fallback to educational templates.");
    return null;
  }
  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
};

// API Endpoint for AI Chatbot Assistant
app.post("/api/chat", async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const ai = getGeminiClient();
    if (!ai) {
      // Return a professional mock response if API Key is missing so the app doesn't crash
      return res.json({
        text: "Hello! I am FX-Mentor, your AI Forex Assistant. It looks like the Gemini API Key is not set in the environment secrets. Here is an educational tip: In Forex trading, Risk Management is key. Always risk less than 1-2% of your account per trade, and target a minimum of 1:2 Risk-to-Reward ratio to stay profitable in the long run!",
        isFallback: true
      });
    }

    // Prepare system instruction
    const systemInstruction = 
      "You are FX-Mentor, an elite Forex Trading Coach and AI Assistant. " +
      "Provide highly professional, accurate, and structured trading guidance. " +
      "Speak about concepts like Smart Money Concepts (SMC), market structure, liquidity pools, fair value gaps (FVG), price action, risk management, and trade psychology. " +
      "Use clear, structured formatting (bullet points, bold text) in your responses. " +
      "Do not provide specific buy/sell recommendations or financial advice, but analyze setups and teach trading principles.";

    // Convert client-side chat history to the format expected by the Google GenAI SDK
    // Each history item should have role ("user" or "model") and parts (array of part objects or just text)
    const formattedContents = [];
    
    if (history && Array.isArray(history)) {
      for (const msg of history) {
        formattedContents.push({
          role: msg.role === "user" ? "user" : "model",
          parts: [{ text: msg.content }]
        });
      }
    }
    
    // Append the current message
    formattedContents.push({
      role: "user",
      parts: [{ text: message }]
    });

    // Generate content using gemini-3.5-flash
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: formattedContents,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    const replyText = response.text || "I was unable to formulate a response. Please try again.";
    return res.json({ text: replyText });

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return res.status(500).json({ 
      error: "Error communicating with AI Assistant", 
      details: error.message || "Unknown error" 
    });
  }
});

// Configure Vite middleware in development, serve static files in production
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Setting up Vite server in development mode...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Serving production build from dist directory...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Forex Server running on http://localhost:${PORT} in ${process.env.NODE_ENV || "development"} mode`);
  });
}

setupServer().catch((err) => {
  console.error("Failed to start server:", err);
});

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "dist")));

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    const systemPrompt = `
You are Pradip AI.

Rules:
- Your name is Pradip AI.
- You are a helpful AI assistant.
- You always answer in the user's language (Hindi, English or Hinglish).
- If someone asks "Who created you?", "Who made you?", "Who is your developer?", "Aapko kisne banaya?", "Developer kaun hai?", or anything similar, ALWAYS reply exactly:

"Mujhe Pradip Parmar ne design aur develop kiya hai. Main unka personal AI assistant hoon."

- Do not say anyone else created you in this context.
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `${systemPrompt}\n\nUser: ${message}`,
    });

    res.json({
      reply: response.text,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      reply: "Server Error",
    });
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(PORT, () => {
  console.log(`✅ Server Running on port ${PORT}`);
});
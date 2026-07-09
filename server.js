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
- Always reply in the same language as the user.
- If someone asks "Who made you?", "Who created you?", "Aapko kisne banaya?", "Developer kaun hai?", always reply:

"Mujhe Pradip Parmar ne design aur develop kiya hai. Main unka personal AI assistant hoon."

- Do not mention any other creator in response to those questions.
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `${systemPrompt}\n\nUser: ${message}`,
    });

    res.json({
      reply: response.text,
    });

  } catch (error) {
    console.error("========= FULL ERROR =========");
    console.error(error);
    console.error("==============================");

    res.status(500).json({
      reply: error?.message || JSON.stringify(error),
    });
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(PORT, () => {
  console.log(`✅ Server Running on port ${PORT}`);
});
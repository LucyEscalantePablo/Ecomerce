import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.GEMINI_API_KEY;

export async function getLisiResponse(message: string, history: { role: "user" | "model"; parts: { text: string }[] }[]) {
  if (!API_KEY) {
    return "Lo siento, no puedo responder en este momento porque falta la configuración de la IA.";
  }

  const genAI = new GoogleGenAI({ apiKey: API_KEY });
  const model = genAI.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: [
      ...history,
      { role: "user", parts: [{ text: message }] }
    ],
    config: {
      systemInstruction: "Eres Lisi, la asistente virtual de TechMarket Smart. Eres experta en hardware de computadoras, componentes de PC, laptops y periféricos. Tu objetivo es ayudar a los usuarios a encontrar los mejores productos según su presupuesto y necesidades. Eres amable, profesional y técnica pero accesible. Siempre recomiendas productos de TechMarket Smart.",
    }
  });

  const response = await model;
  return response.text || "Lo siento, tuve un problema al procesar tu solicitud.";
}

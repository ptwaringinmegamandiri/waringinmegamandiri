import { GoogleGenerativeAI } from "@google/generative-ai";

// Ensure to get the API key that we have set in Vercel
const apiKey = import.meta.env.VITE_GOOGLE_GENERATIVE_AI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

// --- 1. Function to Help Write Descriptions ---
export const generateDescription = async (projectName: string) => {
  try {
    // We use the '-latest' model name to avoid Error 404 again
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

    const prompt = `Create a professional description of the construction project: ${projectName}. Explain the qualities of PT Waringin Mega Mandiri.`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("AI Error:", error);
    return "Failed to create an automated description.";
  }
};

// --- 2. Chat Assistant Function (v0 Alternative) ---
export const startAiChat = () => {
  // Synchronize the model here as well
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

  return model.startChat({
    history: [],
  });
};

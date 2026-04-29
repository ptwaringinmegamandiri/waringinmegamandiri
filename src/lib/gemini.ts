import { GoogleGenerativeAI } from "@google/generative-ai";

// Mengambil kunci API dari Vercel
const apiKey = import.meta.env.VITE_GOOGLE_GENERATIVE_AI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

// --- 1. Fungsi Bantu Tulis Deskripsi ---
export const generateDescription = async (projectName: string) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(`Buatkan deskripsi profesional proyek: ${projectName}`);
    return result.response.text();
  } catch (error) {
    console.error("AI Error:", error);
    return "Gagal membuat deskripsi otomatis.";
  }
};

// --- 2. Fungsi Chat Assistant (v0 Alternative) ---
export const startAiChat = () => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  return model.startChat({
    history: [],
  });
};

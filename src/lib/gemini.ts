import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GOOGLE_GENERATIVE_AI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

// --- 1. Fungsi Bantu Tulis Deskripsi ---
export const generateDescription = async (projectName: string) => {
  try {
    // Kita pakai nama standar 'gemini-1.5-flash'
    // SDK ini otomatis akan mencari jalur v1 jika v1beta gagal
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(`Buatkan deskripsi profesional proyek: ${projectName}`);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("AI Error:", error);
    return "Gagal membuat deskripsi otomatis.";
  }
};

// --- 2. Fungsi Chat Assistant (v0 Alternative) ---
export const startAiChat = () => {
  // Kita pakai model yang sama di sini
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  return model.startChat({
    history: [],
  });
};

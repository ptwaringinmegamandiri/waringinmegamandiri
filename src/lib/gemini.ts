import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GOOGLE_GENERATIVE_AI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

// --- 1. Fungsi Bantu Tulis Deskripsi ---
export const generateDescription = async (projectName: string) => {
  try {
    // Ganti ke model 2.0 yang lebih baru agar tidak 404
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(`Buatkan deskripsi profesional proyek konstruksi: ${projectName}`);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("AI Error:", error);
    return "Gagal membuat deskripsi otomatis.";
  }
};

// --- 2. Fungsi Chat Assistant (v0 Alternative) ---
export const startAiChat = () => {
  // Samakan modelnya di sini juga
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  return model.startChat({
    history: [],
  });
};

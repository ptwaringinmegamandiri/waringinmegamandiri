import { GoogleGenerativeAI } from "@google/generative-ai";

// Mengambil kunci API dari Vercel
const apiKey = import.meta.env.VITE_GOOGLE_GENERATIVE_AI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

// --- 1. Fungsi Bantu Tulis Deskripsi ---
export const generateDescription = async (projectName: string) => {
  try {
    // Kita tambahkan '-latest' agar URL otomatis mengarah ke alamat yang benar
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
    const result = await model.generateContent(`Buatkan deskripsi profesional untuk proyek: ${projectName}`);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("AI Error:", error);
    return "Gagal membuat deskripsi otomatis.";
  }
};

// --- 2. Fungsi Chat Assistant ---
export const startAiChat = () => {
  // Samakan modelnya di sini juga agar tidak 404
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
  return model.startChat({
    history: [],
  });
};

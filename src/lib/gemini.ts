import { GoogleGenerativeAI } from "@google/generative-ai";

// Pastikan kuncinya terbaca
const apiKey = import.meta.env.VITE_GOOGLE_GENERATIVE_AI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

// --- 1. Fungsi Bantu Tulis ---
export const generateDescription = async (projectName: string) => {
  try {
    // Kita pakai '-latest' sesuai saran console kamu agar tidak 404
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
    const result = await model.generateContent(`Buat deskripsi proyek konstruksi: ${projectName}`);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("AI Error:", error);
    return "Koneksi AI gagal, cek API Key.";
  }
};

// --- 2. Fungsi Chat Assistant ---
export const startAiChat = () => {
  // Samakan modelnya pakai '-latest' juga di sini
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
  return model.startChat({
    history: [],
  });
};

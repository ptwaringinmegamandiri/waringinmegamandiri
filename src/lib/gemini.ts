import { GoogleGenerativeAI } from "@google/generative-ai";

// Ini untuk mengambil kunci AI yang sudah kamu pasang di Vercel tadi
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_GENERATIVE_AI_API_KEY || "");

export const generateDescription = async (projectName: string) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `Buatkan deskripsi profesional dan elegan dalam Bahasa Indonesia untuk proyek konstruksi bernama: ${projectName}. Jelaskan tentang kualitas, ketepatan waktu, dan profesionalisme PT Waringin Mega Mandiri. Buat dalam 2 paragraf singkat.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gagal generate deskripsi:", error);
    return "Gagal membuat deskripsi secara otomatis.";
  }
};

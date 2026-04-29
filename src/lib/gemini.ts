import { GoogleGenerativeAI } from "@google/generative-ai";

// Pastikan kuncinya bersih tanpa karakter aneh
const apiKey = import.meta.env.VITE_GOOGLE_GENERATIVE_AI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

// --- FUNCTION 1: Tombol Bantu Tulis Deskripsi ---
export const generateDescription = async (projectName: string) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Buatkan deskripsi profesional dan elegan dalam Bahasa Indonesia untuk proyek konstruksi bernama: ${projectName}. Jelaskan tentang kualitas dan profesionalisme PT Waringin Mega Mandiri. Buat dalam 2 paragraf.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error AI Description:", error);
    return "Gagal membuat deskripsi secara otomatis.";
  }
};

// --- FUNCTION 2: Chat Assistant (v0 Alternative) ---
export const startAiChat = () => {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
  });

  return model.startChat({
    history: [
      {
        role: "user",
        parts: [{ text: "Kamu adalah Senior Web Developer PT Waringin Mega Mandiri. Bantu saya mengedit tampilan dan fitur website ini menggunakan React dan Tailwind CSS." }],
      },
      {
        role: "model",
        parts: [{ text: "Siap Bos! Saya asisten developer pribadi kamu. Silakan beri tahu bagian mana yang mau diubah desainnya atau fitur apa yang mau ditambahkan." }],
      }
    ],
  });
};

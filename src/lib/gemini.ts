import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GOOGLE_GENERATIVE_AI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

export const generateDescription = async (projectName: string) => {
  try {
    // Pakai nama model murni tanpa embel-embel
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(`Buatkan deskripsi profesional proyek: ${projectName}`);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("AI Error:", error);
    return "Gagal membuat deskripsi otomatis.";
  }
};

export const startAiChat = () => {
  // Pastikan inisialisasi model di sini juga bersih
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  return model.startChat({
    history: [],
  });
};

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_GENERATIVE_AI_API_KEY || "");

export const startAiChat = () => {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash", // Kita pakai versi flash biar kencang seperti v0
  });

  return model.startChat({
    history: [
      {
        role: "user",
        parts: [{ text: "Kamu adalah Senior Web Developer PT Waringin Mega Mandiri. Kamu ahli dalam React, Tailwind CSS, dan Lucide React. Tugasmu adalah membantu saya mengedit tampilan dan fitur website ini. Jika saya minta ubah desain, berikan potongan kode yang lengkap dan siap pakai." }],
      },
      {
        role: "model",
        parts: [{ text: "Siap Bos! Saya asisten developer pribadi kamu. Saya sudah paham struktur website Waringin Mega Mandiri. Silakan kasih tau bagian mana yang mau diubah desainnya atau fitur apa yang mau ditambahin. Saya akan buatkan kodingannya!" }],
      }
    ],
  });
};

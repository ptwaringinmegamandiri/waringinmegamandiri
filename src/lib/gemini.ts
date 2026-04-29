import { GoogleGenerativeAI } from "@google/generative-ai";

// Ensure the API Key is retrieved
const apiKey = import.meta.env.VITE_GOOGLE_GENERATIVE_AI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

export const generateDescription = async (projectName: string) => {
  try {
    // Use the 'gemini-1.5-flash' model without additional prefixes
    // The Google SDK will automatically find the most stable version
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `Buatkan deskripsi profesional proyek: ${projectName}. Jelaskan kualitas PT Waringin Mega Mandiri.`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("AI Error:", error);
    return "Gagal membuat deskripsi otomatis.";
  }
};

export const startAiChat = () => {
  // Chat sessions must use the same model
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  
  return model.startChat({
    history: [],
  });
};

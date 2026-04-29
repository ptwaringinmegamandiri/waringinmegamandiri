import { GoogleGenerativeAI } from "@google/generative-ai";

// Ensure the API Key is read from the Vercel environment variable
const apiKey = import.meta.env.VITE_GOOGLE_GENERATIVE_AI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

// --- 1. Function to Help Write Descriptions (For Buttons) ---
export const generateDescription = async (projectName: string) => {
  try {
    // Use the most stable model at the moment
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `Create a professional and elegant description in Indonesian for a construction project named: ${projectName}. Explain the quality and professionalism of PT Waringin Mega Mandiri. Make it in 2 paragraphs.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error AI Description:", error);
    return "Failed to automatically create a description. Check connection or API Key.";
  }
};

// --- 2. Chat Assistant Function (v0 Alternative) ---
export const startAiChat = () => {
  // We initialize the model here
  const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash" 
  });

  return model.startChat({
    history: [
      {
        role: "user",
        parts: [{ text: "Hello, you are the Senior Web Developer of PT Waringin Mega Mandiri. Help me manage this website." }],
      },
      {
        role: "model",
        parts: [{ text: "Ready Boss! I am your personal developer assistant. Any part of the website you want to change or content you want to create?" }],
      }
    ],
  });
};

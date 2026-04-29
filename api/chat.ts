import { GoogleGenerativeAI } from "@google/generative-ai";

export const config = { runtime: 'edge' };

export default async function handler(req: Request) {
  const { prompt } = await req.json();
  const genAI = new GoogleGenerativeAI(process.env.VITE_GOOGLE_GENERATIVE_AI_API_KEY || "");
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return new Response(JSON.stringify({ text: response.text() }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Gagal koneksi AI" }), { status: 500 });
  }
}

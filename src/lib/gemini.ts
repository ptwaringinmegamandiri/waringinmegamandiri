const API_KEY = import.meta.env.VITE_GOOGLE_GENERATIVE_AI_API_KEY;

export const generateDescription = async (prompt: string) => {
  // Kita pakai v1beta dan gemini-1.5-flash-latest (Sesuai saran Console kamu)
  const url = `https://googleapis.com{API_KEY}`;
  
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ 
      contents: [{ 
        parts: [{ text: `Buatkan deskripsi singkat untuk proyek: ${prompt}` }] 
      }] 
    })
  });

  const res = await response.json();
  
  // Jika masih 404, kita akan tahu alasannya di sini
  if (res.error) {
    console.error("Detail Error:", res.error);
    throw new Error(res.error.message);
  }
  
  return res.candidates[0].content.parts[0].text;
};

export const startAiChat = () => {
  return {
    sendMessage: async (msg: string) => {
      const text = await generateDescription(msg);
      return { response: { text: () => text } };
    }
  };
};

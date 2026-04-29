const API_KEY = import.meta.env.VITE_GOOGLE_GENERATIVE_AI_API_KEY;

export const generateDescription = async (prompt: string) => {
  const url = `https://googleapis.com{API_KEY}`;
  
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: `Buatkan deskripsi profesional: ${prompt}` }] }]
    })
  });

  const res = await response.json();
  if (res.error) throw new Error(res.error.message);
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

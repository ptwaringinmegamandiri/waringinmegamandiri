const apiKey = import.meta.env.VITE_GOOGLE_GENERATIVE_AI_API_KEY || "";

export const generateDescription = async (projectName: string) => {
  try {
    // Gunakan alamat model paling dasar yang PASTI ada
    const url = `https://googleapis.com{apiKey}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `Buat deskripsi singkat proyek: ${projectName}` }] }]
      })
    });

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    return "Gagal koneksi.";
  }
};

export const startAiChat = () => {
  return {
    sendMessage: async (msg: string) => {
      const url = `https://googleapis.com{apiKey}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: msg }] }] })
      });
      const data = await response.json();
      return { response: { text: () => data.candidates[0].content.parts[0].text } };
    }
  };
};

const apiKey = import.meta.env.VITE_GOOGLE_GENERATIVE_AI_API_KEY || "";

// Fungsi untuk bantu tulis deskripsi
export const generateDescription = async (projectName: string) => {
  try {
    // Kita pakai versi v1 (Stabil) dan model -latest sesuai saran AI Console
    const url = `https://googleapis.com{apiKey}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `Buat deskripsi proyek konstruksi profesional: ${projectName}` }] }]
      })
    });

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("AI Error:", error);
    return "Gagal membuat deskripsi otomatis.";
  }
};

// Fungsi untuk Chat Assistant
export const startAiChat = () => {
  return {
    sendMessage: async (msg: string) => {
      // Kita pakai endpoint yang sama karena ini yang paling stabil
      const url = `https://googleapis.com{apiKey}`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: msg }] }]
        })
      });
      
      const data = await response.json();
      const aiText = data.candidates[0].content.parts[0].text;
      
      return { response: { text: () => aiText } };
    }
  };
};

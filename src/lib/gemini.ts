export const generateDescription = async (projectName: string) => {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ prompt: `Buatkan deskripsi proyek: ${projectName}` }),
    });
    const data = await response.json();
    return data.text;
  } catch (error) {
    return "Gagal membuat deskripsi.";
  }
};

export const startAiChat = () => {
  return {
    sendMessage: async (msg: string) => {
      const response = await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ prompt: msg }),
      });
      const data = await response.json();
      return { response: { text: () => data.text } };
    }
  };
};

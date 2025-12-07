import { GoogleGenAI } from "@google/genai";

const getSystemInstruction = () => `
Você é o assistente virtual do "SetLand", um parque temático em Caldas Novas, Goiás.
O parque possui 3 áreas temáticas principais:
1. Era Glacial: Focada em climas frios, pinguins animatrônicos e toboáguas de "gelo".
2. Era Medieval: Castelos, dragões, duelos de cavaleiros e comidas rústicas.
3. Era Futurística: Neons, realidade virtual e montanhas-russas de alta velocidade.

Informações gerais:
- Horário: Terça a Domingo, das 09h às 18h.
- Localização: Caldas Novas, GO.
- Preço: R$ 89,90 (Adulto), R$ 44,90 (Meia/Infantil).
- O parque possui praça de alimentação completa.
- Estacionamento gratuito.

Responda de forma curta, animada e convidativa (máximo 2 parágrafos). Sempre tente convencer o usuário a comprar o ingresso.
Use emojis relacionados ao tema da pergunta.
`;

export const getGeminiResponse = async (userMessage: string): Promise<string> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      return "Desculpe, meu sistema de comunicação está offline no momento (Chave de API ausente).";
    }

    const ai = new GoogleGenAI({ apiKey });
    
    // Using gemini-2.5-flash for speed and efficiency in a chat context
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userMessage,
      config: {
        systemInstruction: getSystemInstruction(),
        temperature: 0.7,
        maxOutputTokens: 200,
      }
    });

    return response.text || "Desculpe, não consegui processar sua pergunta agora.";
  } catch (error) {
    console.error("Error communicating with Gemini:", error);
    return "Tive um problema técnico. Por favor, tente novamente ou fale com nosso suporte no WhatsApp.";
  }
};

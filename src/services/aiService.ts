interface GeminiResponse {
  candidates: {
    content: {
      parts: { text: string }[];
    };
  }[];
}

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY?.trim();
const MODEL_NAME = 'gemini-flash-latest';
const GEMINI_API_URL = import.meta.env.DEV
  ? '/api/gemini'
  : `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`;

const fetchWithRetry = async (url: string, options: RequestInit, retries = 3): Promise<Response> => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.ok) return response;
      if (response.status === 503 || response.status === 429 || response.status >= 500) {
        console.warn(`Tentativa ${i + 1} falhou com status ${response.status}. Retentando...`);
        await new Promise((res) => setTimeout(res, 1500 * (i + 1)));
        continue;
      }
      return response;
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise((res) => setTimeout(res, 1500 * (i + 1)));
    }
  }
  return fetch(url, options);
};

const callGeminiAPI = async (prompt: string) => {
  if (!import.meta.env.DEV && !API_KEY) {
    throw new Error(
      'Chave da API Gemini não configurada. Defina VITE_GEMINI_API_KEY no arquivo .env.local.',
    );
  }

  const response = await fetchWithRetry(GEMINI_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
    }),
  });

  if (!response.ok) {
    throw new Error(`Erro na requisição: ${response.status}`);
  }

  return (await response.json()) as GeminiResponse;
};

export interface InsightData {
  feasibility: {
    status: 'viable' | 'needs_adjustment' | 'unfeasible';
    content: string;
  };
  diagnosis: { content: string };
  suggestions: { items: string[] };
  extraIncome: { items: string[] };
  investment: { items: string[] };
  motivation: { content: string };
}

export const getInsight = async (prompt: string) => {
  const response = await callGeminiAPI(prompt);
  const json = response.candidates[0].content.parts[0].text;
  return JSON.parse(json) as InsightData;
};

export const askQuestion = async (
  question: string,
  history: { role: 'user' | 'model'; text: string }[],
  simulationContext: string
) => {
  if (!import.meta.env.DEV && !API_KEY) {
    throw new Error(
      'Chave da API Gemini não configurada. Defina VITE_GEMINI_API_KEY no arquivo .env.local.',
    );
  }

  const contents = [
    {
      role: 'user',
      parts: [
        {
          text: `Você é um educador financeiro. Aqui estão os detalhes da simulação financeira do usuário:\n${simulationContext}\n\nResponda as perguntas do usuário de forma clara e amigável. Não use formatação markdown excessiva.`,
        },
      ],
    },
    {
      role: 'model',
      parts: [{ text: 'Entendido. Estou pronto para ajudar com dúvidas sobre esta simulação.' }],
    },
    ...history.map((msg) => ({
      role: msg.role,
      parts: [{ text: msg.text }],
    })),
    {
      role: 'user',
      parts: [{ text: question }],
    },
  ];

  const response = await fetchWithRetry(GEMINI_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents }),
  });

  if (!response.ok) {
    throw new Error(`Erro na requisição: ${response.status}`);
  }

  const data = (await response.json()) as GeminiResponse;
  return data.candidates[0].content.parts[0].text;
};

import { OpenAI } from 'openai';

const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

if (!API_KEY) {
  throw new Error('Missing OpenAI API key. Please add OPENAI_API_KEY to your .env file');
}

const openai = new OpenAI({ apiKey: API_KEY, dangerouslyAllowBrowser: true });

const DEFAULT_CONFIG = {
  model: 'gpt-4',
  temperature: 0.7,
  max_tokens: 1000,
  top_p: 0.8,
};

export async function getChatResponse(message: string): Promise<string> {
  if (!message.trim()) {
    throw new Error('Message cannot be empty');
  }

  try {
    const response = await openai.chat.completions.create({
      messages: [{ role: 'user', content: message }],
      ...DEFAULT_CONFIG,
    });

    return response.choices[0].message.content || '';
  } catch (error) {
    console.error('Error getting chat response:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to get response: ${error.message}`);
    }
    throw new Error('Failed to get response from ChatGPT');
  }
}

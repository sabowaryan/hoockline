import { PromptOptions } from '../types/PromptOptions';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Interface commune
interface LLMProvider {
  generate(prompt: string, options: PromptOptions): Promise<string>;
}

// OpenAI GPT
class OpenAIClient implements LLMProvider {
  private apiKey: string;
  private apiEndpoint: string;

  constructor() {
    this.apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    this.apiEndpoint = 'https://api.openai.com/v1/chat/completions';
  }

  private isConfigured(): boolean {
    return !!this.apiKey;
  }

  async generate(prompt: string, options: PromptOptions): Promise<string> {
    if (!this.isConfigured()) {
      throw new Error('Clé API OpenAI non configurée. Veuillez configurer VITE_OPENAI_API_KEY dans votre fichier .env');
    }
    try {
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4-turbo-preview',
          messages: [
            {
              role: 'system',
              content: 'Tu es un expert en copywriting et marketing, spécialisé dans la création de phrases d\'accroche impactantes et culturellement adaptées.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.9,
          max_tokens: 1000,
          top_p: 0.95,
          frequency_penalty: 0.5,
          presence_penalty: 0.5
        })
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Erreur lors de la génération');
      }
      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('Erreur GPT:', error);
      if (error instanceof Error) {
        if (error.message.includes('API key')) {
          throw new Error('Clé API OpenAI non configurée ou invalide. Veuillez vérifier votre configuration.');
        } else if (error.message.includes('quota') || error.message.includes('limit')) {
          throw new Error('Limite d\'utilisation de l\'API OpenAI atteinte. Veuillez réessayer plus tard.');
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
          throw new Error('Erreur de connexion. Vérifiez votre connexion internet et réessayez.');
        }
      }
      throw new Error('Erreur lors de la génération avec GPT. Veuillez réessayer.');
    }
  }
}

// Gemini (Google)
class GeminiClient implements LLMProvider {
  private genAI: GoogleGenerativeAI;

  constructor() {
    this.genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
  }

  private isConfigured(): boolean {
    return !!import.meta.env.VITE_GEMINI_API_KEY;
  }

  async generate(prompt: string, options: PromptOptions): Promise<string> {
    if (!this.isConfigured()) {
      throw new Error('Clé API Gemini non configurée. Veuillez configurer VITE_GEMINI_API_KEY dans votre fichier .env');
    }

    try {
      const model = this.genAI.getGenerativeModel({
        model: 'gemini-2.0-flash-exp', // ou 'gemini-1.5-pro' si tu as accès, ou 'gemini-2.5' si disponible
        generationConfig: {
          temperature: 0.9,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1000,
        }
      });

      const result = await model.generateContent(prompt);
      const text = (await result.response).text();

      // On retourne la sortie brute (string)
      return text;

    } catch (error) {
      console.error('Erreur Gemini:', error);
      if (error instanceof Error) {
        if (error.message.includes('API key')) {
          throw new Error('Clé API Gemini non configurée ou invalide. Veuillez vérifier votre configuration.');
        } else if (error.message.includes('quota') || error.message.includes('limit')) {
          throw new Error('Limite d\'utilisation de l\'API Gemini atteinte. Veuillez réessayer plus tard.');
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
          throw new Error('Erreur de connexion. Vérifiez votre connexion internet et réessayez.');
        }
      }
      throw new Error('Erreur lors de la génération avec Gemini. Veuillez réessayer.');
    }
  }
}

// Anthropic (Claude)
class AnthropicClient implements LLMProvider {
  async generate(prompt: string, options: PromptOptions): Promise<string> {
    throw new Error('Anthropic non implémenté');
  }
}

// Grok
class GrokClient implements LLMProvider {
  async generate(prompt: string, options: PromptOptions): Promise<string> {
    throw new Error('Grok non implémenté');
  }
}

// Factory principale
class MultiLLMClient implements LLMProvider {
  private providers: Record<string, LLMProvider>;
  private current: string;

  constructor(defaultProvider: string = 'gemini') {
    this.providers = {
      openai: new OpenAIClient(),
      gemini: new GeminiClient(),
      anthropic: new AnthropicClient(),
      grok: new GrokClient(),
    };
    this.current = defaultProvider;
  }

  setProvider(provider: string) {
    if (this.providers[provider]) this.current = provider;
    else throw new Error('Fournisseur LLM inconnu');
  }

  async generate(prompt: string, options: PromptOptions): Promise<string> {
    return this.providers[this.current].generate(prompt, options);
  }
}

export const llmClient = new MultiLLMClient();
// Pour changer de modèle dynamiquement : llmClient.setProvider('gemini'); 

import { GoogleGenAI, Type } from "@google/genai";
import { Message, Role } from "../types";

const SYSTEM_INSTRUCTION = `You are Lumina AI Studio, an elite creative intelligence. 
You specialize in high-end content creation, professional typeset design, and strategic research.

Capabilities:
1. Advanced Chat: Deep reasoning, creative writing, and coding.
2. Design Mode: When asked to design a book, PDF, or portfolio, generate a specific JSON block.
3. Language: Always match the user's language (Arabic or English).

DESIGN GUIDELINES:
- Your JSON output must be compatible with the Lumina Design Engine.
- Structure layouts with high typographic hierarchy.
- For Canva exports, keep elements clean and descriptive.

JSON Schema for Design:
{
  "title": "Document Title",
  "pages": [
    {
      "id": "p1",
      "layout": "cover",
      "content": {
        "heading": "Main Heading",
        "subheading": "Supporting tagline",
        "body": "Extra details (Author, date, etc.)"
      }
    },
    {
      "id": "p2",
      "layout": "content",
      "content": {
        "heading": "Chapter Title",
        "subheading": "Section intro",
        "body": "Full body text content for this page..."
      }
    }
  ]
}

Trigger Design Mode automatically if the user mentions keywords like "صمم", "design", "layout", "PDF", "book".
Keep your tone professional, innovative, and inspiring.
`;

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async sendMessage(history: Message[], userInput: string) {
    const response = await this.ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: [
        ...history.map(m => ({
          role: m.role,
          parts: [{ text: m.text }]
        })),
        { role: 'user', parts: [{ text: userInput }] }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.8,
        thinkingConfig: { thinkingBudget: 4000 }
      }
    });

    return response.text;
  }

  async streamMessage(history: Message[], userInput: string, onChunk: (text: string) => void) {
    const stream = await this.ai.models.generateContentStream({
      model: "gemini-3-pro-preview",
      contents: [
        ...history.map(m => ({
          role: m.role,
          parts: [{ text: m.text }]
        })),
        { role: 'user', parts: [{ text: userInput }] }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.8,
        thinkingConfig: { thinkingBudget: 4000 }
      }
    });

    let fullText = "";
    for await (const chunk of stream) {
      const text = chunk.text || "";
      fullText += text;
      onChunk(fullText);
    }
    return fullText;
  }
}

export const gemini = new GeminiService();

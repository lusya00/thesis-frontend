import { config } from './config';
import { knowledgeService } from './services/knowledgeService';
import { pageScannerService } from './services/pageScannerService';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

// Topics that indicate general knowledge questions rather than tourism-specific ones
const generalTopics = [
  'weather', 'climate', 'temperature', 'forecast',
  'news', 'current events', 'history', 'geography',
  'science', 'technology', 'sports', 'entertainment',
  'education', 'health', 'medicine', 'politics',
  'economy', 'business', 'finance', 'culture', 'art',
  'music', 'movies', 'books', 'celebrities', 'recipe',
  'cooking', 'food', 'drink'
];

export const aiService = {
  async getResponse(messages: ChatMessage[]): Promise<string> {
    try {
      // Check for API key and provide a clear message if it's missing
      if (!config.gemini.apiKey) {
        console.warn('Gemini API key is not configured. Using fallback responses.');
        return `I need to be configured before I can provide helpful responses. 

Please check the CHATBOT_SETUP.md file for instructions on setting up the Gemini API key.

Once you've added your API key to the .env file and restarted the server, I'll be able to answer your questions about Untung Jawa!`;
      }

      // Get the last user message
      const lastUserMessage = messages[messages.length - 1].content;
      
      // Determine if the query is about a general topic or tourism-specific
      const isGeneralQuery = generalTopics.some(topic => 
        lastUserMessage.toLowerCase().includes(topic)
      );

      // Get knowledge context - more detailed for tourism questions
      let contextData = {};
      try {
        contextData = await knowledgeService.generateAIContext();
      } catch (error) {
        console.error('Error getting knowledge context:', error);
      }
      
      // Get current page context
      let pageContext = '';
      try {
        if (typeof window !== 'undefined') {
          pageContext = pageScannerService.getCurrentPageContext();
        }
      } catch (error) {
        console.error('Error getting page context:', error);
      }
      
      // Build enhanced system prompt with context
      const enhancedSystemPrompt = `
${config.systemPrompt}

${isGeneralQuery ? '--- GENERAL QUERY DETECTED ---' : '--- TOURISM QUERY DETECTED ---'}

KNOWLEDGE BASE:
${JSON.stringify(contextData, null, 2)}

CURRENT PAGE:
${pageContext}

${isGeneralQuery ? 
  `This appears to be a general knowledge question. While tourism is my specialty, I'll do my best to provide a helpful response.` : 
  `This appears to be a tourism-related question. I'll provide detailed information from my knowledge base.`
}

Please use the above information to provide accurate and helpful responses.
Format your responses using Markdown where appropriate (e.g., for lists, bolding, italics, and links) to enhance readability.
If you include code snippets, use Markdown code blocks.
`.trim();

      // Format previous conversation
      const conversationHistory = messages
        .slice(0, -1)
        .map(msg => `${msg.role}: ${msg.content}`)
        .join('\n');

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${config.gemini.model}:generateContent?key=${config.gemini.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `${enhancedSystemPrompt}\n\nConversation History:\n${conversationHistory}\n\nUser: ${lastUserMessage}`
              }]
            }],
            generationConfig: {
              temperature: config.gemini.temperature,
              maxOutputTokens: config.gemini.maxOutputTokens,
              topP: 0.9,
              topK: 40
            },
            safetySettings: [
              {
                category: "HARM_CATEGORY_HARASSMENT",
                threshold: "BLOCK_MEDIUM_AND_ABOVE"
              },
              {
                category: "HARM_CATEGORY_HATE_SPEECH",
                threshold: "BLOCK_MEDIUM_AND_ABOVE"
              },
              {
                category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                threshold: "BLOCK_MEDIUM_AND_ABOVE"
              },
              {
                category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                threshold: "BLOCK_MEDIUM_AND_ABOVE"
              }
            ]
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('Gemini API Error:', errorData);
        
        if (response.status === 404) {
          throw new Error('Invalid API endpoint. Please check the configuration.');
        }
        if (response.status === 400) {
          // For 400 errors, try with a simplified request that might be more compatible
          return await this.getSimplifiedResponse(lastUserMessage);
        }
        if (response.status === 403) {
          throw new Error('API key is invalid or has insufficient permissions.');
        }
        
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Gemini API Response:', data); // Debug log

      if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
        return data.candidates[0].content.parts[0].text;
      }

      throw new Error('Invalid response format from Gemini API');
    } catch (error) {
      console.error('Error in AI service:', error);
      
      // Return a fallback response
      const fallbackIndex = Math.floor(Math.random() * config.fallbackResponses.length);
      return config.fallbackResponses[fallbackIndex];
    }
  },

  // Simplified response method for when the main method fails with a 400 error
  // This attempts a more basic request format that might be more compatible
  async getSimplifiedResponse(userMessage: string): Promise<string> {
    try {
      console.log("Attempting simplified API call...");
      
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${config.gemini.model}:generateContent?key=${config.gemini.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `${config.systemPrompt}\n\nUser: ${userMessage}`
              }]
            }]
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Simplified API call failed: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
        return data.candidates[0].content.parts[0].text;
      }
      
      throw new Error('Invalid response format from simplified API call');
    } catch (error) {
      console.error('Error in simplified AI response:', error);
      const fallbackIndex = Math.floor(Math.random() * config.fallbackResponses.length);
      return config.fallbackResponses[fallbackIndex];
    }
  }
}; 
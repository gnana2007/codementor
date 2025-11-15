/**
 * API Integration Module for CodeMentor.AI
 * 
 * This module handles all API calls to the backend server.
 */

// Backend API base URL
// In development, use relative path to leverage Vite proxy
// In production, use full URL or environment variable
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

/**
 * Analyze code and return errors with explanations
 * 
 * @param code - The code to analyze
 * @param language - Programming language (python, javascript, java, cpp, c)
 * @param fileName - Optional file name
 * @returns Analysis result with errors and fixed code
 */
export async function analyzeCode(code: string, language: string, fileName?: string): Promise<any> {
  try {
    const response = await fetch(`${API_BASE_URL}/code/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code,
        language,
        fileName: fileName || '',
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Analysis failed');
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Code analysis error:', error);
    throw error;
  }
}

/**
 * Send a chat message and get AI response
 * 
 * @param message - User's message
 * @param conversationId - Optional conversation ID for context
 * @returns AI response string
 */
export async function sendChatMessage(message: string, conversationId?: string): Promise<string> {
  try {
    const response = await fetch(`${API_BASE_URL}/chat/message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        conversationId: conversationId || '',
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Chat request failed');
    }

    const result = await response.json();
    return result.data.response;
  } catch (error) {
    console.error('Chat error:', error);
    throw error;
  }
}

/**
 * Get code analysis history
 * 
 * @param limit - Number of records to fetch
 * @returns Array of analysis records
 */
export async function getCodeHistory(limit: number = 10): Promise<any[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/code/history?limit=${limit}`);

    if (!response.ok) {
      throw new Error('Failed to fetch history');
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Get history error:', error);
    throw error;
  }
}

/**
 * Get chat message history
 * 
 * @param conversationId - Optional conversation ID to filter by
 * @param limit - Number of records to fetch
 * @returns Array of chat messages
 */
export async function getChatHistory(conversationId?: string, limit: number = 50): Promise<any[]> {
  try {
    const url = conversationId
      ? `${API_BASE_URL}/chat/history?conversationId=${conversationId}&limit=${limit}`
      : `${API_BASE_URL}/chat/history?limit=${limit}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Failed to fetch chat history');
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Get chat history error:', error);
    throw error;
  }
}

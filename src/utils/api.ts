/**
 * API Integration Module for CodeMentor.AI
 * 
 * This module handles all API calls to the backend server.
 */

// Backend API base URL
// In development, use relative path to leverage Vite proxy
// In production, use full URL or environment variable
const getApiBaseUrl = () => {
  // If VITE_API_URL is explicitly set, use it
  if (import.meta.env.VITE_API_URL) {
    const url = import.meta.env.VITE_API_URL.trim();
    
    // If it's a full URL (starts with http/https), ensure it ends with /api
    if (url.startsWith('http://') || url.startsWith('https://')) {
      // Remove trailing slash if present
      const cleanUrl = url.replace(/\/+$/, '');
      // Check if /api is already in the URL
      if (!cleanUrl.endsWith('/api')) {
        return `${cleanUrl}/api`;
      }
      return cleanUrl;
    }
    
    // If it's a relative path, return as-is (should already include /api)
    return url;
  }
  
  // In development (localhost), use proxy
  if (import.meta.env.DEV) {
    return '/api';
  }
  
  // In production, default to relative path (same domain)
  return '/api';
};

const API_BASE_URL = getApiBaseUrl();

// Log API base URL in development for debugging
if (import.meta.env.DEV) {
  console.log('🔗 API Base URL:', API_BASE_URL);
  console.log('🔗 VITE_API_URL env:', import.meta.env.VITE_API_URL || 'not set (using proxy)');
}

/**
 * Analyze code and return errors with explanations
 * 
 * @param code - The code to analyze
 * @param language - Programming language (python, javascript, java, cpp, c)
 * @param fileName - Optional file name
 * @param signal - Optional AbortSignal for request cancellation
 * @returns Analysis result with errors and fixed code
 */
export async function analyzeCode(
  code: string, 
  language: string, 
  fileName?: string,
  signal?: AbortSignal
): Promise<any> {
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
      signal, // Add abort signal for request cancellation
    });

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      const contentType = response.headers.get('content-type');
      
      // Only try to parse JSON if content-type is JSON
      if (contentType && contentType.includes('application/json')) {
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch (parseError) {
          // JSON parsing failed, use default message
          console.warn('Failed to parse error response as JSON:', parseError);
        }
      }
      throw new Error(errorMessage);
    }

    const result = await response.json();
    
    // Validate response structure
    if (!result || (!result.success && !result.data)) {
      throw new Error('Invalid response format from server');
    }
    
    return result.data || result;
  } catch (error) {
    // Handle abort errors gracefully
    if (error instanceof Error && error.name === 'AbortError') {
      throw error;
    }
    
    // Handle network errors specifically
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('Network error: Could not connect to server. Please check if the backend is running.');
    }
    
    if (error instanceof Error) {
      console.error('Code analysis error:', error.message);
      throw error;
    }
    
    console.error('Code analysis error:', error);
    throw new Error('An unexpected error occurred during code analysis');
  }
}

/**
 * Send a chat message and get AI response
 * 
 * @param message - User's message
 * @param conversationId - Optional conversation ID for context
 * @returns AI response string
 */
export async function sendChatMessage(message: string, conversationId?: string, signal?: AbortSignal): Promise<string> {
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
      signal, // Add abort signal for request cancellation
    });

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch {
          // JSON parsing failed, use default message
        }
      }
      throw new Error(errorMessage);
    }

    const result = await response.json();
    
    // Validate response structure
    if (!result || !result.data || !result.data.response) {
      throw new Error('Invalid response format from server');
    }
    
    return result.data.response;
  } catch (error) {
    // Handle abort errors gracefully
    if (error instanceof Error && error.name === 'AbortError') {
      throw error;
    }
    
    // Handle network errors specifically
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('Network error: Could not connect to server. Please check if the backend is running.');
    }
    
    if (error instanceof Error) {
      console.error('Chat error:', error.message);
      throw error;
    }
    
    console.error('Chat error:', error);
    throw new Error('An unexpected error occurred during chat request');
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
    const response = await fetch(`${API_BASE_URL}/code/history?limit=${limit}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch {
          // JSON parsing failed, use default message
        }
      }
      throw new Error(errorMessage);
    }

    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error('Get history error:', error);
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('Network error: Could not connect to server. Please check if the backend is running.');
    }
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

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch {
          // JSON parsing failed, use default message
        }
      }
      throw new Error(errorMessage);
    }

    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error('Get chat history error:', error);
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('Network error: Could not connect to server. Please check if the backend is running.');
    }
    throw error;
  }
}

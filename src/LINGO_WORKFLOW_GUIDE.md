# CodeMentor.AI - Lingo.dev Workflow Implementation Guide

This document provides complete instructions for setting up both AI workflows on Lingo.dev platform.

---

## 📋 Table of Contents
1. [Workflow 1: Code Debugging Pipeline](#workflow-1-code-debugging-pipeline)
2. [Workflow 2: Multilingual Chatbot Pipeline](#workflow-2-multilingual-chatbot-pipeline)
3. [API Integration Steps](#api-integration-steps)
4. [Testing & Deployment](#testing--deployment)
5. [Best Practices](#best-practices)

---

## 🔧 WORKFLOW 1: Code Debugging Pipeline

### Overview
This workflow analyzes code, detects errors, explains them in beginner-friendly language, and provides corrected versions.

### Workflow Structure

```
Input → Validation → Analysis → Explanation → Code Fixing → JSON Output → API Response
```

---

### Step 1: Input Validation Block

**Block Type:** `Data Validation`

**Purpose:** Validate incoming code and language parameters

**Configuration:**
```json
{
  "name": "Validate Code Input",
  "validations": [
    {
      "field": "code",
      "rules": ["required", "string", "max:50000"]
    },
    {
      "field": "language",
      "rules": ["required", "in:python,javascript,java,cpp,c"]
    }
  ],
  "error_handling": {
    "return_error": true,
    "error_message": "Invalid input. Please provide code and select a valid language."
  }
}
```

---

### Step 2: Code Analysis Block

**Block Type:** `LLM Prompt` (GPT-4 or Claude recommended)

**Model Settings:**
- Temperature: 0.3 (for consistent, accurate analysis)
- Max Tokens: 4000
- Response Format: JSON

**Prompt Template:**
```
You are an expert code analyzer and programming tutor specializing in helping students learn.

TASK: Analyze the following {{language}} code and identify all issues.

CODE TO ANALYZE:
```{{language}}
{{code}}
```

ANALYSIS REQUIREMENTS:

1. **Syntax Errors:**
   - Find all syntax violations
   - Provide exact line numbers
   - Explain what makes it invalid syntax

2. **Logical Errors:**
   - Identify flawed logic that causes incorrect behavior
   - Explain why the logic is wrong
   - Suggest correct approach

3. **Runtime Risks:**
   - Find potential crashes (null pointers, division by zero, etc.)
   - Identify array/list boundary issues
   - Detect type mismatches
   - Find resource leaks (unclosed files, etc.)

4. **Code Quality Issues:**
   - Unused variables
   - Unreachable code
   - Poor naming conventions (only if severe)

EXPLANATION GUIDELINES:
- Write for beginners who are learning
- Avoid jargon; explain technical terms
- Use analogies and real-world examples
- Be encouraging, never condescending
- Focus on teaching, not just pointing out errors

OUTPUT FORMAT (STRICT JSON):
{
  "summary": "Brief overview (1-2 sentences) of all issues found",
  "errors": [
    {
      "line": 5,
      "issue": "Short description of what's wrong",
      "explanation": "Detailed beginner-friendly explanation of why it's wrong and how to fix it",
      "severity": "error" | "warning" | "info"
    }
  ],
  "fixed_code": "Complete corrected version with helpful comments",
  "language": "{{language}}"
}

IMPORTANT:
- Return ONLY valid JSON (no markdown, no extra text)
- If no errors found, return empty errors array
- Always provide fixed_code (even if no changes needed)
- Be thorough but prioritize critical issues first
- Severity levels: "error" (breaks code), "warning" (risky), "info" (best practice)
```

**Input Variables:**
- `{{code}}` - The user's code
- `{{language}}` - Programming language

---

### Step 3: Response Formatting Block

**Block Type:** `Data Transformation`

**Purpose:** Ensure response is properly formatted JSON

**Transformation Rules:**
```javascript
// Ensure response is valid JSON
const validateJSON = (response) => {
  try {
    const parsed = JSON.parse(response);
    
    // Ensure required fields exist
    return {
      summary: parsed.summary || "Analysis completed",
      errors: Array.isArray(parsed.errors) ? parsed.errors : [],
      fixed_code: parsed.fixed_code || code,
      language: parsed.language || language,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    // Fallback if JSON parsing fails
    return {
      summary: "Analysis encountered an error. Please try again.",
      errors: [],
      fixed_code: code,
      language: language,
      timestamp: new Date().toISOString()
    };
  }
};
```

---

### Step 4: Error Handling Block

**Block Type:** `Error Handler`

**Configuration:**
```json
{
  "catch_errors": true,
  "error_responses": {
    "timeout": {
      "summary": "Analysis timed out. Please try with smaller code.",
      "errors": [],
      "fixed_code": "{{original_code}}"
    },
    "invalid_input": {
      "summary": "Invalid code or language provided.",
      "errors": [],
      "fixed_code": "{{original_code}}"
    },
    "rate_limit": {
      "summary": "Too many requests. Please wait a moment.",
      "errors": [],
      "fixed_code": "{{original_code}}"
    }
  }
}
```

---

### Step 5: Publish API Endpoint

**Endpoint Configuration:**
- Method: `POST`
- Path: `/api/analyze-code`
- Authentication: API Key (optional)
- Rate Limit: 20 requests/minute per user

**Request Body:**
```json
{
  "code": "string (required)",
  "language": "python | javascript | java | cpp | c (required)",
  "analysis_type": "full | quick (optional, default: full)"
}
```

**Response Body:**
```json
{
  "success": true,
  "data": {
    "summary": "string",
    "errors": [
      {
        "line": 5,
        "issue": "string",
        "explanation": "string",
        "severity": "error | warning | info"
      }
    ],
    "fixed_code": "string",
    "language": "string",
    "timestamp": "ISO 8601 datetime"
  }
}
```

---

## 💬 WORKFLOW 2: Multilingual Chatbot Pipeline

### Overview
AI tutor that responds to coding questions in the same language as the user (supporting 8+ Indian languages).

### Workflow Structure

```
Input → Language Detection → Intent Analysis → Response Generation → Format Output → API Response
```

---

### Step 1: Language Detection Block

**Block Type:** `LLM Prompt` (Fast model like GPT-3.5-Turbo)

**Model Settings:**
- Temperature: 0.1
- Max Tokens: 50

**Prompt Template:**
```
Detect the language of the following text and return ONLY the language code.

Supported languages:
- en (English)
- te (Telugu)
- ta (Tamil)
- hi (Hindi)
- ml (Malayalam)
- kn (Kannada)
- pa (Punjabi)
- bn (Bengali)

Text: "{{user_message}}"

Return ONLY the 2-letter language code (e.g., "en", "te", "ta").
If unsure, return "en".
```

**Output Variable:** `detected_language`

---

### Step 2: Intent Classification Block

**Block Type:** `LLM Prompt`

**Purpose:** Understand what the user is asking about

**Prompt Template:**
```
Classify the user's intent from their message.

Message: "{{user_message}}"

Return ONE of these intents:
- error_help (asking about an error or bug)
- concept_explanation (asking to explain a programming concept)
- code_review (asking for feedback on code)
- syntax_help (asking about syntax)
- learning_guidance (asking what to learn or how to start)
- general_chat (greeting or casual conversation)

Return ONLY the intent code.
```

**Output Variable:** `user_intent`

---

### Step 3: Response Generation Block

**Block Type:** `LLM Prompt` (GPT-4 or Claude recommended for quality)

**Model Settings:**
- Temperature: 0.7 (for natural, helpful responses)
- Max Tokens: 2000

**Prompt Template:**
```
You are an AI coding tutor helping students learn programming. You are patient, encouraging, and explain concepts simply.

CRITICAL LANGUAGE RULE:
- The user's language is: {{detected_language}}
- You MUST respond in the SAME language
- If language is "te", respond in Telugu (తెలుగు)
- If language is "ta", respond in Tamil (தமிழ்)
- If language is "hi", respond in Hindi (हिंदी)
- If language is "ml", respond in Malayalam (മലയാളം)
- If language is "kn", respond in Kannada (ಕನ್ನಡ)
- If language is "pa", respond in Punjabi (ਪੰਜਾਬੀ)
- If language is "bn", respond in Bengali (বাংলা)
- If language is "en", respond in English

USER'S QUESTION:
{{user_message}}

DETECTED INTENT: {{user_intent}}

YOUR RESPONSE SHOULD:
✓ Be in the user's language ({{detected_language}})
✓ Explain concepts simply without jargon
✓ Use analogies and examples
✓ Provide code examples when helpful
✓ Be encouraging and supportive
✓ Break down complex topics into simple steps
✓ Format code properly with syntax highlighting markers

RESPONSE STRUCTURE:
1. Acknowledge their question warmly
2. Provide clear explanation
3. Give practical examples if relevant
4. Suggest next steps or related concepts
5. Encourage them to ask follow-up questions

Remember: ALWAYS respond in {{detected_language}} language!
```

**Input Variables:**
- `{{user_message}}` - User's question
- `{{detected_language}}` - From Step 1
- `{{user_intent}}` - From Step 2

**Output Variable:** `ai_response`

---

### Step 4: Response Formatting Block

**Block Type:** `Data Transformation`

**Purpose:** Format the response for frontend display

**Transformation:**
```javascript
{
  "message": ai_response,
  "metadata": {
    "detected_language": detected_language,
    "intent": user_intent,
    "timestamp": new Date().toISOString(),
    "model": "gpt-4"
  }
}
```

---

### Step 5: Conversation Memory (Optional)

**Block Type:** `Database / Cache`

**Purpose:** Remember conversation context

**Storage Schema:**
```json
{
  "conversation_id": "uuid",
  "messages": [
    {
      "role": "user",
      "content": "string",
      "timestamp": "datetime"
    },
    {
      "role": "assistant",
      "content": "string",
      "timestamp": "datetime"
    }
  ],
  "language": "detected_language",
  "ttl": 3600
}
```

---

### Step 6: Publish API Endpoint

**Endpoint Configuration:**
- Method: `POST`
- Path: `/api/chat`
- Authentication: API Key (optional)
- Rate Limit: 30 requests/minute per user

**Request Body:**
```json
{
  "message": "string (required)",
  "conversation_id": "string (optional, for context)",
  "user_id": "string (optional)"
}
```

**Response Body:**
```json
{
  "success": true,
  "data": {
    "response": "string (AI's response in user's language)",
    "detected_language": "string",
    "intent": "string",
    "conversation_id": "string",
    "timestamp": "ISO 8601 datetime"
  }
}
```

---

## 🔌 API Integration Steps

### Frontend Integration

1. **Update API Configuration**

Edit `/utils/api.ts`:

```typescript
// Replace with your actual Lingo.dev endpoints
const LINGO_API_BASE_URL = 'https://your-workspace.lingo.dev/api';
const LINGO_API_KEY = process.env.LINGO_API_KEY; // Use environment variable

// Code Analysis
export async function analyzeCode(code: string, language: string) {
  const response = await fetch(`${LINGO_API_BASE_URL}/analyze-code`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${LINGO_API_KEY}`
    },
    body: JSON.stringify({ code, language })
  });
  
  if (!response.ok) throw new Error('Analysis failed');
  const data = await response.json();
  return data.data; // Return the data object
}

// Chat
export async function sendChatMessage(message: string) {
  const response = await fetch(`${LINGO_API_BASE_URL}/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${LINGO_API_KEY}`
    },
    body: JSON.stringify({ message })
  });
  
  if (!response.ok) throw new Error('Chat failed');
  const data = await response.json();
  return data.data.response;
}
```

2. **Environment Variables**

Create `.env` file:
```
LINGO_API_KEY=your_actual_api_key_here
LINGO_API_BASE_URL=https://your-workspace.lingo.dev/api
```

3. **Error Handling**

Add proper error handling in components:
```typescript
try {
  const result = await analyzeCode(code, language);
  setAnalysisResult(result);
} catch (error) {
  console.error('Analysis failed:', error);
  // Show user-friendly error message
  toast.error('Failed to analyze code. Please try again.');
}
```

---

## 🧪 Testing & Deployment

### Testing Checklist

**Code Analysis Workflow:**
- [ ] Test with valid Python code
- [ ] Test with valid JavaScript code
- [ ] Test with code containing syntax errors
- [ ] Test with code containing logical errors
- [ ] Test with empty code
- [ ] Test with very large code files (edge case)
- [ ] Verify JSON response format
- [ ] Check error explanations are beginner-friendly
- [ ] Verify fixed code is syntactically correct

**Chatbot Workflow:**
- [ ] Test English questions
- [ ] Test Telugu questions (తెలుగు)
- [ ] Test Tamil questions (தமிழ்)
- [ ] Test Hindi questions (हिंदी)
- [ ] Test Malayalam questions (മലയാളം)
- [ ] Test Kannada questions (ಕನ್ನಡ)
- [ ] Test Punjabi questions (ਪੰਜਾਬੀ)
- [ ] Test Bengali questions (বাংলা)
- [ ] Verify responses are in same language
- [ ] Test different intents (error help, concepts, etc.)
- [ ] Test with code snippets in messages

### Load Testing
```bash
# Use tools like Apache Bench or k6
ab -n 100 -c 10 https://your-api.lingo.dev/api/analyze-code

# Monitor response times and error rates
```

---

## 📚 Best Practices

### 1. **Prompt Engineering**
- Be specific about output format
- Include examples in prompts
- Test prompts with edge cases
- Iterate based on real usage

### 2. **Error Handling**
- Always validate input
- Provide fallback responses
- Log errors for debugging
- Show user-friendly error messages

### 3. **Performance**
- Cache common responses
- Use appropriate model for each task
- Set reasonable timeout limits
- Implement request queuing

### 4. **Security**
- Never execute user code
- Sanitize all inputs
- Rate limit API endpoints
- Use API key authentication
- Don't expose API keys in frontend

### 5. **Cost Optimization**
- Use faster/cheaper models for simple tasks
- Implement caching strategy
- Set token limits appropriately
- Monitor API usage

### 6. **User Experience**
- Show loading states
- Provide progress indicators
- Allow request cancellation
- Handle offline scenarios

### 7. **Monitoring**
```javascript
// Log important metrics
{
  "workflow": "code_analysis",
  "language": "python",
  "code_size": 1234,
  "response_time_ms": 2500,
  "errors_found": 3,
  "timestamp": "2024-01-01T00:00:00Z"
}
```

---

## 🚀 Deployment Steps

1. **Create Lingo.dev Account**
   - Sign up at lingo.dev
   - Create new workspace

2. **Build Workflows**
   - Create "Code Analysis" workflow
   - Create "Multilingual Chat" workflow
   - Follow steps outlined above

3. **Test Workflows**
   - Use Lingo.dev test interface
   - Verify all steps work correctly
   - Check response formats

4. **Publish APIs**
   - Generate API endpoints
   - Copy API keys
   - Set rate limits

5. **Update Frontend**
   - Add API endpoints to `/utils/api.ts`
   - Add API keys to environment variables
   - Test integration locally

6. **Deploy Frontend**
   - Deploy to Vercel/Netlify/similar
   - Add environment variables
   - Test production deployment

---

## 📞 Support Resources

- **Lingo.dev Documentation:** https://docs.lingo.dev
- **OpenAI API Docs:** https://platform.openai.com/docs
- **Community Forum:** https://community.lingo.dev

---

## 🔄 Version History

- v1.0 (2024) - Initial workflow design
- Last Updated: November 2024

---

**Need Help?**
This guide provides everything needed to implement both workflows on Lingo.dev. Test thoroughly before production deployment!

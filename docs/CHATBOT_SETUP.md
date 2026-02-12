# Chatbot Setup Instructions

## Fixing "Gemini API key is not configured" Error

The chatbot in this project uses Google's Gemini API for generating responses. You need to set up an API key to make it work.

### Step 1: Get a Gemini API Key
1. Go to the [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click on "Create API key" button
4. Copy the API key - it should look like a simple alphanumeric string (NOT starting with "sk-proj-")

> **IMPORTANT**: Make sure you're using a Google Gemini API key, not an OpenAI key. Google API keys typically don't start with "sk-proj-".

### Step 2: Set up the environment variable
1. Create a file named `.env` in the root of your project (same level as package.json)
2. Add the following line to the file:
   ```
   VITE_GEMINI_API_KEY=your_api_key_here
   ```
   (Replace "your_api_key_here" with the actual API key you copied)

### Step 3: Restart the development server
1. Stop your current development server (if running)
2. Run `npm run dev` to start it again
3. The chatbot should now work without the API key error

## Note on Security
- Never commit your .env file to version control
- Make sure .env is in your .gitignore file
- The API key should be kept private and not shared in public repositories

## Alternative: Using OpenAI Instead
If you want to use OpenAI instead of Gemini, you would need to:

1. Change the AI service implementation in `src/lib/ai-service.ts`
2. Use an OpenAI API key instead of a Gemini one
3. Update the API endpoint and request format to match OpenAI's requirements 
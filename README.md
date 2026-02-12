# Untung Jawa Tourism Website

A modern tourism website for Untung Jawa Island, featuring homestay bookings, island information, and an AI-powered chatbot.
Maria
## Environment Setup
Ryan and Maria
1. Create a `.env` file in the root directory with the following variables:
Maria
```
# API Configuration
VITE_API_BASE_URL=https://untung-jawa-api.onrender.com/api

# Development API URL (uncomment to use local development server)
# VITE_API_BASE_URL=http://localhost:5000/api

# Debug mode for API calls
VITE_DEBUG_API=true

# Gemini API Key for Chatbot
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```
#testing

2. For local development, you can use the local API URL by uncommenting the development URL line.

3. Make sure to add your Gemini API key for the chatbot functionality.

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## Deployment

The frontend is configured to work with the backend API hosted on Render. The API base URL is set through environment variables, making it easy to switch between development and production environments.

## Features

- Homestay booking system
- Island information and guides
- AI-powered chatbot assistant
- User authentication
- Payment processing
- Responsive design

hi

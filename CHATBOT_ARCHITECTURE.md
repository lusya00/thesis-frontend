# Untung Jawa Chatbot Architecture

## System Overview

```mermaid
graph TB
    subgraph Frontend
        UI[ChatBot UI Component]
        State[React State Management]
        Animations[Framer Motion Animations]
    end

    subgraph Core Services
        AI[AI Service]
        Knowledge[Knowledge Service]
        PageScanner[Page Scanner Service]
        Homestay[Homestay Service]
    end

    subgraph External APIs
        Gemini[Google Gemini API]
        Backend[Untung Jawa Backend]
    end

    subgraph Data Flow
        User[User Input] --> UI
        UI --> State
        State --> AI
        AI --> Gemini
        Gemini --> AI
        AI --> State
        State --> UI
        
        Knowledge --> AI
        PageScanner --> AI
        Homestay --> AI
    end

    subgraph Features
        QuickReplies[Quick Reply System]
        SuggestedReplies[Suggested Replies]
        SpecialHandlers[Special Command Handlers]
        FallbackSystem[Fallback Response System]
    end

    UI --> QuickReplies
    UI --> SuggestedReplies
    AI --> SpecialHandlers
    AI --> FallbackSystem
```

## Component Details

### Frontend Components
- **ChatBot UI**: Main interface component with island-themed design
- **State Management**: React hooks for managing chat state
- **Animations**: Framer Motion for smooth transitions and effects

### Core Services
- **AI Service**: Handles communication with Gemini API
- **Knowledge Service**: Manages tourism knowledge base
- **Page Scanner**: Provides context-aware responses
- **Homestay Service**: Manages accommodation data

### Features
- **Quick Reply System**: Pre-defined common queries
- **Suggested Replies**: Dynamic response suggestions
- **Special Handlers**: Custom logic for specific queries
- **Fallback System**: Backup responses when API fails

## Data Flow

```mermaid
sequenceDiagram
    participant User
    participant UI
    participant AI
    participant Gemini
    participant Knowledge
    participant Homestay

    User->>UI: Sends Message
    UI->>AI: Process Message
    AI->>Knowledge: Get Context
    AI->>Homestay: Check Accommodations
    AI->>Gemini: Generate Response
    Gemini-->>AI: Return Response
    AI-->>UI: Display Response
    UI-->>User: Show Message
```

## Error Handling

```mermaid
graph TD
    A[API Request] --> B{Success?}
    B -->|Yes| C[Process Response]
    B -->|No| D[Check Error Type]
    D -->|API Key Missing| E[Show Setup Instructions]
    D -->|Network Error| F[Use Fallback Response]
    D -->|Invalid Response| G[Simplified Request]
    E --> H[Display Error Message]
    F --> H
    G --> H
```

## Configuration System

```mermaid
graph LR
    A[Environment Variables] --> B[Config Object]
    B --> C[API Settings]
    B --> D[System Prompt]
    B --> E[Fallback Responses]
    B --> F[UI Settings]
```

## Security Measures

```mermaid
graph TD
    A[API Key] --> B[Environment Variables]
    B --> C[Client Validation]
    C --> D[Secure API Calls]
    D --> E[Content Filtering]
    E --> F[Safe Responses]
``` 
# Pulau Pal - Untung Jawa AI Chatbot Architecture

## System Overview

```mermaid
graph TB
    subgraph "User Interface Layer"
        UI[ChatBot UI]
        style UI fill:#f9f,stroke:#333,stroke-width:2px
        QuickReplies[Quick Reply Buttons]
        SuggestedReplies[Suggested Replies]
        Animations[Framer Motion Effects]
    end

    subgraph "Core Processing Layer"
        QueryClassifier[Query Classification]
        style QueryClassifier fill:#bbf,stroke:#333,stroke-width:2px
        ContextBuilder[Context Builder]
        PromptEngineer[Prompt Engineering]
        ResponseHandler[Response Handler]
    end

    subgraph "Knowledge Layer"
        StaticKB[Static Knowledge Base]
        DynamicKB[Dynamic Knowledge]
        PageContext[Page Scanner]
        HomestayData[Homestay Service]
    end

    subgraph "AI Integration Layer"
        GeminiAPI[Google Gemini API]
        style GeminiAPI fill:#bfb,stroke:#333,stroke-width:2px
        SafetySettings[Safety Filters]
        FallbackSystem[Fallback System]
    end

    subgraph "Language Layer"
        EN[English Handler]
        ID[Bahasa Indonesia Handler]
        Translation[Translation Service]
    end

    %% Main Flow
    UI --> QueryClassifier
    QueryClassifier --> ContextBuilder
    ContextBuilder --> PromptEngineer
    PromptEngineer --> GeminiAPI
    GeminiAPI --> ResponseHandler
    ResponseHandler --> UI

    %% Knowledge Connections
    StaticKB --> ContextBuilder
    DynamicKB --> ContextBuilder
    PageContext --> ContextBuilder
    HomestayData --> DynamicKB

    %% Language Connections
    EN --> ResponseHandler
    ID --> ResponseHandler
    Translation --> ResponseHandler

    %% Safety and Fallback
    SafetySettings --> GeminiAPI
    FallbackSystem --> ResponseHandler

    %% UI Enhancements
    QuickReplies --> UI
    SuggestedReplies --> UI
    Animations --> UI
```

## Detailed Flow Diagram

```mermaid
sequenceDiagram
    participant User
    participant UI as ChatBot UI
    participant Classifier as Query Classifier
    participant Context as Context Builder
    participant Gemini as Gemini API
    participant Knowledge as Knowledge Base
    participant Response as Response Handler

    User->>UI: Sends Message
    UI->>Classifier: Process Query
    Classifier->>Context: Build Context
    
    par Context Gathering
        Context->>Knowledge: Get Static Data
        Context->>Knowledge: Get Dynamic Data
        Context->>Knowledge: Get Page Context
    end
    
    Context->>Gemini: Send Enhanced Prompt
    Gemini->>Response: Generate Response
    
    par Response Processing
        Response->>Response: Format Markdown
        Response->>Response: Add Suggestions
        Response->>Response: Apply Animations
    end
    
    Response->>UI: Display Response
    UI->>User: Show Message
```

## Key Components

### 1. User Interface Layer
- **ChatBot UI**: Beautiful island-themed interface with floating orb design
- **Quick Reply System**: Pre-defined common queries with island-themed icons
- **Suggested Replies**: Dynamic response suggestions based on context
- **Animations**: Smooth transitions and typing effects

### 2. Core Processing Layer
- **Query Classification**: Distinguishes between tourism and general queries
- **Context Builder**: Gathers relevant information from multiple sources
- **Prompt Engineering**: Creates optimized prompts for Gemini API
- **Response Handler**: Processes and formats AI responses

### 3. Knowledge Layer
- **Static Knowledge Base**: Island information, attractions, activities
- **Dynamic Knowledge**: Real-time homestay availability and pricing
- **Page Scanner**: Context-aware responses based on current page
- **Homestay Service**: Manages accommodation data and bookings

### 4. AI Integration Layer
- **Gemini API**: Google's advanced language model integration
- **Safety Settings**: Content filtering and moderation
- **Fallback System**: Backup responses for API failures

### 5. Language Layer
- **English Handler**: Primary language support
- **Bahasa Indonesia Handler**: Local language support
- **Translation Service**: Seamless language switching

## Innovation Highlights

1. **Context-Aware Intelligence**
   - Real-time page context integration
   - Dynamic knowledge base updates
   - Personalized response generation

2. **Island-Themed Experience**
   - Beautiful UI with mystical animations
   - Themed quick replies and suggestions
   - Engaging user interaction design

3. **Robust Error Handling**
   - Graceful fallback system
   - API failure recovery
   - User-friendly error messages

4. **Multi-Language Support**
   - Seamless language switching
   - Cultural context awareness
   - Local language optimization

## Technical Implementation

```mermaid
graph TD
    subgraph "Frontend Implementation"
        React[React Components]
        Hooks[React Hooks]
        State[State Management]
        Styling[Tailwind CSS]
    end

    subgraph "Backend Integration"
        API[API Service]
        Config[Configuration]
        Security[Security Layer]
    end

    subgraph "AI Processing"
        Model[Gemini Model]
        Prompt[Prompt Engineering]
        Safety[Safety Settings]
    end

    React --> Hooks
    Hooks --> State
    State --> API
    API --> Model
    Model --> Prompt
    Prompt --> Safety
```

## Security and Performance

```mermaid
graph TD
    subgraph "Security Measures"
        APIKey[API Key Protection]
        Validation[Input Validation]
        Filtering[Content Filtering]
    end

    subgraph "Performance Optimization"
        Caching[Response Caching]
        Debouncing[Input Debouncing]
        LazyLoad[Lazy Loading]
    end

    APIKey --> Validation
    Validation --> Filtering
    Caching --> Performance
    Debouncing --> Performance
    LazyLoad --> Performance
``` 
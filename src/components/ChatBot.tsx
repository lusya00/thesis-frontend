import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Loader2, Search, Bot, MapPin, Image, Sun, Moon, AlignLeft, Languages, Camera, PalmtreeIcon, Waves, Compass, Flag, Heart, Coffee, Sparkles, Star, Maximize2, Minimize2, Square, ExternalLink, Eye, Calendar, Filter, StopCircle } from 'lucide-react';
import { aiService } from '@/lib/ai-service';
import { pageScannerService } from '@/lib/services/pageScannerService';
import { knowledgeService } from '@/lib/services/knowledgeService';
import { ChatMessage, QuickReply, ChatBotConfig, Homestay, ActionButton } from './accommodation/types';
import { homestayService, adaptHomestayForDisplay } from '@/lib/services/homestayService';
import { useTranslation } from '@/hooks/useTranslation';

// Enhanced island-themed assistant constants
const DEFAULT_CONFIG: ChatBotConfig = {
  botName: "Pulau Pal",
  greeting: "🌺 Hi! I'm Pulau Pal, your Untung Jawa guide. How can I help you today?",
  language: 'en',
  theme: 'ocean',
};

type ExtendedTheme = 'ocean' | 'sunset' | 'forest' | 'light' | 'dark';

interface ExtendedChatBotConfig extends Omit<ChatBotConfig, 'theme'> {
  theme: ExtendedTheme;
}

const QUICK_REPLIES: QuickReply[] = [
  { label: "🏝️ Island Magic", action: "Tell me about Untung Jawa's hidden gems", icon: PalmtreeIcon },
  { label: "🏠 Mystical Stays", action: "Show me the most magical homestays", icon: Heart },
  { label: "🌊 Ocean Adventures", action: "What ocean activities await me?", icon: Compass },
  { label: "🌸 Local Secrets", action: "Share some local secrets and traditions", icon: Coffee },
  { label: "☀️ Island Weather", action: "What's the weather like in paradise?", icon: Sun },
  { label: "🛥️ Journey There", action: "How do I reach this magical island?", icon: Waves },
];

const LANGUAGE_OPTIONS = [
  { value: 'en', label: 'English' },
  { value: 'id', label: 'Bahasa Indonesia' },
];

export const ChatBot = () => {
  const { language } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [config, setConfig] = useState<ExtendedChatBotConfig>(DEFAULT_CONFIG);
  const [isGenerating, setIsGenerating] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: DEFAULT_CONFIG.greeting,
      timestamp: new Date(),
      suggestedReplies: ["Show me homestays", "What activities are available?", "Tell me about pricing"],
      isAnimating: true,
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const { toast } = useToast();
  
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const orbRef = useRef<HTMLButtonElement>(null);

  // Enhanced animation interval for the magical orb - OPTIMIZED
  useEffect(() => {
    if (!isOpen && orbRef.current) {
      // Simple CSS animation instead of complex JS calculations
      orbRef.current.style.background = 'linear-gradient(45deg, #0EA5E9, #1E3A8A)';
      orbRef.current.style.boxShadow = '0 4px 12px rgba(14, 165, 233, 0.3)';
    }
  }, [isOpen]);

  // Enhanced smooth scrolling with proper timing
  useEffect(() => {
    const scrollToBottom = () => {
      if (scrollAreaRef.current) {
        requestAnimationFrame(() => {
          if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTo({
              top: scrollAreaRef.current.scrollHeight,
              behavior: 'smooth'
            });
          }
        });
      }
    };

    scrollToBottom();
    // Additional scroll after animation completes
    setTimeout(scrollToBottom, 200);
  }, [messages, isTyping]);

  // Update current page tracking
  useEffect(() => {
    const updateCurrentPage = () => {
      setCurrentPage(window.location.pathname);
    };

    updateCurrentPage();
    window.addEventListener('popstate', updateCurrentPage);
    return () => window.removeEventListener('popstate', updateCurrentPage);
  }, []);

  // Handle action button clicks
  const handleActionButton = (button: ActionButton) => {
    switch (button.action) {
      case 'book':
        window.location.href = `/book-now?homestay=${button.data.id}`;
        break;
      case 'view':
        window.location.href = `/homestay/${button.data.id}`;
        break;
      case 'filter':
        window.location.href = `/accommodation?${button.data.params}`;
        break;
      case 'navigate':
        window.location.href = button.data.path;
        break;
      case 'external':
        window.open(button.data.url, '_blank');
        break;
    }
    
    // Add user message showing what they clicked
    setMessages(prev => [...prev, {
      role: 'user',
      content: `✓ ${button.label}`,
      timestamp: new Date(),
    }]);
  };

  // Stop generating response
  const stopGenerating = () => {
    setIsGenerating(false);
    setIsTyping(false);
    setIsLoading(false);
    // Mark the last message as complete
    setMessages(prev => {
      const newMessages = [...prev];
      if (newMessages.length > 0) {
        newMessages[newMessages.length - 1] = {
          ...newMessages[newMessages.length - 1],
          canStop: false,
          isAnimating: false,
        };
      }
      return newMessages;
    });
  };

  // Enhanced typing animation with natural feel and stop capability
  const addAssistantMessage = (content: string, suggestedReplies?: string[], additionalData = {}) => {
    setIsTyping(true);
    setIsGenerating(true);
    
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: "",
      timestamp: new Date(),
      isAnimating: true,
      canStop: true,
      ...additionalData
    }]);
    
    let visibleText = '';
    const fullText = content;
    const baseTypingSpeed = 12;
    let i = 0;

    const typeNextChar = () => {
      if (i < fullText.length) {
        visibleText += fullText[i];
        i++;
        
        const char = fullText[i-1];
        const delay = char === '.' ? baseTypingSpeed * 3 : 
                     char === ',' ? baseTypingSpeed * 2 : 
                     char === '!' || char === '?' ? baseTypingSpeed * 4 : 
                     baseTypingSpeed;
        
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = {
            ...newMessages[newMessages.length - 1],
            content: visibleText,
          };
          return newMessages;
        });
        
        setTimeout(typeNextChar, delay);
      } else {
        setIsTyping(false);
        setIsGenerating(false);
        if (suggestedReplies) {
          setMessages(prev => {
            const newMessages = [...prev];
            newMessages[newMessages.length - 1] = {
              ...newMessages[newMessages.length - 1],
              suggestedReplies,
              isAnimating: false,
              canStop: false,
            };
            return newMessages;
          });
        }
      }
    };
    
    setTimeout(typeNextChar, 500);
  };

  // Enhanced message handling with better AI integration
  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);

    setMessages(prev => [...prev, {
      role: 'user',
      content: userMessage,
      timestamp: new Date(),
    }]);

    try {
      let response = '';
      let suggestedReplies: string[] = [];

      if (userMessage.toLowerCase().includes('homestay') || userMessage.toLowerCase().includes('accommodation')) {
        const homestayResult = await handleHomestayRequest(userMessage);
        if (typeof homestayResult === 'string') {
          response = homestayResult;
        } else {
          response = homestayResult.response;
          addAssistantMessage(response, suggestedReplies, { actionButtons: homestayResult.actionButtons });
          return;
        }
      } else if (userMessage.toLowerCase().includes('weather')) {
        response = await handleWeatherRequest();
      } else {
        // Use the available AI service method
        response = await aiService.getSimplifiedResponse(userMessage);
        suggestedReplies = generateSuggestedReplies(userMessage, response);
      }

      addAssistantMessage(response, suggestedReplies);
    } catch (error) {
      console.error('Error sending message:', error);
      addAssistantMessage("🌺 I apologize, but I'm having trouble connecting to my island wisdom right now. Please try again in a moment!");
      
      toast({
        title: "Connection Issue",
        description: "Having trouble reaching the island servers. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Enhanced homestay request handling
  const handleHomestayRequest = async (query: string) => {
    try {
      const homestays = await homestayService.getAllHomestays(language);
      const adaptedHomestays = homestays.map(adaptHomestayForDisplay);
      
      if (adaptedHomestays.length === 0) {
        return "🏝️ I don't see any mystical homestays available right now, but our island always has hidden gems! Let me help you discover other magical experiences on Untung Jawa.";
      }

      // Create a beautiful homestay response
      let response = "🏠✨ **Mystical Island Homestays Await You!**\n\n";
      response += "Here are our most enchanting accommodations where island magic meets comfort:\n\n";
      
      adaptedHomestays.slice(0, 3).forEach((homestay, index) => {
        response += `**${index + 1}. ${homestay.name}** 🌺\n`;
        response += `💰 From Rp ${homestay.price}/night | 👥 Up to ${homestay.capacity} guests\n`;
        response += `${homestay.description?.substring(0, 100) || 'Island paradise awaits'}...\n\n`;
      });
      
      response += "🌊 Each homestay offers authentic island hospitality with modern comforts.";

      // Create action buttons for direct booking/viewing
      const actionButtons: ActionButton[] = [];
      adaptedHomestays.slice(0, 3).forEach(homestay => {
        actionButtons.push(
          {
            label: `View ${homestay.name}`,
            action: 'view',
            data: { id: homestay.id },
            icon: Eye,
            variant: 'outline'
          },
          {
            label: `Book ${homestay.name}`,
            action: 'book',
            data: { id: homestay.id },
            icon: Calendar,
            variant: 'primary'
          }
        );
      });

      // Also add a filter button
      actionButtons.push({
        label: 'Filter Homestays',
        action: 'navigate',
        data: { path: '/accommodation' },
        icon: Filter,
        variant: 'secondary'
      });

      return { response, actionButtons: actionButtons.slice(0, 6) };
    } catch (error) {
      console.error('Error fetching homestays:', error);
      return "🌺 Let me help you discover the perfect island sanctuary! While I gather the latest information about our mystical homestays, would you like to know about the island's magical attractions or activities?";
    }
  };

  // Enhanced weather request
  const handleWeatherRequest = async () => {
    try {
      const response = await aiService.getSimplifiedResponse("Tell me about the weather and best time to visit Untung Jawa Island");
      return response;
    } catch (error) {
      console.error('Error getting weather:', error);
      return "🌞 Untung Jawa enjoys a tropical paradise climate year-round! The island is blessed with warm temperatures (26-32°C) and gentle ocean breezes. The dry season (May-September) offers the most magical weather for your island adventure! 🏝️";
    }
  };

  // Smart suggested replies generation
  const generateSuggestedReplies = (query: string, response: string): string[] => {
    const baseReplies = ["Tell me more", "What else should I know?", "Book a homestay"];
    return baseReplies.concat(
      query.includes('homestay') ? ["Show me rooms", "Check availability"] :
      query.includes('activity') ? ["What's the cost?", "How to book?"] :
      ["Plan my trip", "Island attractions"]
    ).slice(0, 3);
  };

  const handleSuggestedReply = (reply: string) => {
    setInput(reply);
    handleSend();
  };

  const handleQuickAction = (action: string) => {
    setInput(action);
    handleSend();
  };

  const handleScanPage = async () => {
    if (!currentPage) return;
    
    setIsLoading(true);
    try {
      const pageData = await pageScannerService.scanCurrentPage();
      const context = `Current page: ${currentPage}, Page content: ${pageData.content}`;
      
      const response = await aiService.getSimplifiedResponse(
        `Analyze this page and help the user: ${context}`
      );
      
      addAssistantMessage(response, ["Tell me more about this", "What can I do here?", "Continue exploring"]);
    } catch (error) {
      console.error('Error scanning page:', error);
      addAssistantMessage("🔍 I can see you're exploring our magical island website! How can I help guide you through this part of your journey?");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleLanguage = () => {
    const newLang = config.language === 'en' ? 'id' : 'en';
    setConfig(prev => ({ ...prev, language: newLang }));
    
    const greeting = newLang === 'en' 
      ? "🌺 Welcome back! I'm Pulau Pal, your mystical Untung Jawa Island guide. How can I help you discover our island paradise?"
      : "🌺 Selamat datang kembali! Saya Pulau Pal, pemandu mistis Pulau Untung Jawa. Bagaimana saya bisa membantu Anda menemukan surga pulau kami?";
    
    setMessages([{
      role: 'assistant',
      content: greeting,
      timestamp: new Date(),
      suggestedReplies: newLang === 'en' 
        ? ["Tell me about Untung Jawa", "I'm looking for homestays", "What activities are available?"]
        : ["Ceritakan tentang Untung Jawa", "Saya mencari homestay", "Aktivitas apa yang tersedia?"],
    }]);
  };

  const toggleTheme = () => {
    const themes: ExtendedTheme[] = ['ocean', 'sunset', 'forest', 'light', 'dark'];
    const currentIndex = themes.indexOf(config.theme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    setConfig(prev => ({ ...prev, theme: nextTheme }));
  };

  const resetChat = () => {
    setMessages([{
      role: 'assistant',
      content: config.language === 'en' 
        ? "🌺 Fresh start! I'm Pulau Pal, ready to guide you through the magical wonders of Untung Jawa Island. What adventure shall we begin?"
        : "🌺 Mulai yang baru! Saya Pulau Pal, siap memandu Anda melalui keajaiban magis Pulau Untung Jawa. Petualangan apa yang akan kita mulai?",
      timestamp: new Date(),
      suggestedReplies: config.language === 'en'
        ? ["Island activities", "Find homestays", "Travel tips"]
        : ["Aktivitas pulau", "Cari homestay", "Tips perjalanan"],
    }]);
    setActiveTab('chat');
  };

  const getThemeClasses = () => {
    switch (config.theme) {
      case 'sunset':
        return 'bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600';
      case 'forest':
        return 'bg-gradient-to-br from-green-400 via-teal-500 to-blue-600';
      case 'light':
        return 'bg-gradient-to-br from-gray-100 via-white to-gray-200';
      case 'dark':
        return 'bg-gradient-to-br from-gray-800 via-gray-900 to-black';
      default:
        return 'bg-gradient-to-br from-cyan-400 via-blue-500 to-blue-600';
    }
  };

  return (
    <div className="fixed bottom-4 left-4 md:bottom-6 md:left-6 z-50">
      <AnimatePresence mode="wait">
        {!isOpen ? (
          // Enhanced Floating Orb with Sophisticated Animation + Radar Signals
          <motion.div
            key="orb"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="relative group cursor-pointer"
            onClick={() => setIsOpen(true)}
          >
            {/* Enhanced Radar Rings - Multiple layers for better effect */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={`radar-${i}`}
                  className="absolute inset-0 border-2 border-cyan-400/30 rounded-full"
                  style={{
                    width: `${120 + i * 40}%`,
                    height: `${120 + i * 40}%`,
                    left: `${-10 - i * 20}%`,
                    top: `${-10 - i * 20}%`,
                  }}
                  animate={{
                    scale: [0.5, 1.5, 2],
                    opacity: [0.8, 0.3, 0],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    delay: i * 0.6,
                    ease: "easeOut"
                  }}
                />
              ))}
            </div>

            {/* Enhanced magical aura particles */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1.5 h-1.5 md:w-2 md:h-2 bg-gradient-to-r from-cyan-300 to-blue-400 rounded-full"
                  style={{
                    left: `${Math.sin(i * Math.PI / 4) * 35 + 50}%`,
                    top: `${Math.cos(i * Math.PI / 4) * 35 + 50}%`,
                  }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0, 1.5, 0],
                    rotate: [0, 180, 360]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: i * 0.4,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </div>

            {/* Pulsing base glow */}
            <motion.div
              className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400/20 to-blue-500/20"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              style={{
                width: '100%',
                height: '100%',
              }}
            />
            
            {/* Enhanced orb with sophisticated styling - mobile responsive */}
            <motion.button 
              ref={orbRef}
              className="relative w-14 h-14 md:w-16 md:h-16 rounded-full shadow-2xl transition-all duration-300 flex items-center justify-center border-2 border-white/30 group-hover:scale-110 group-hover:border-white/50 z-10"
              style={{
                background: 'linear-gradient(135deg, rgba(34,211,238,1) 0%, rgba(59,130,246,1) 50%, rgba(147,51,234,1) 100%)',
                boxShadow: '0 0 30px rgba(34,211,238,0.6), inset 0 0 20px rgba(255,255,255,0.2)'
              }}
              whileHover={{ 
                scale: 1.15,
                boxShadow: '0 0 40px rgba(34,211,238,0.8), inset 0 0 30px rgba(255,255,255,0.3)'
              }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div 
                className="relative z-10 text-white"
                animate={{ 
                  rotate: [0, 8, -8, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <PalmtreeIcon className="h-6 w-6 md:h-7 md:w-7 drop-shadow-lg filter brightness-110" />
              </motion.div>
            </motion.button>

            {/* Enhanced Tooltip - Mobile responsive */}
            <motion.div 
              className="absolute bottom-full right-0 md:left-0 mb-3 px-3 py-2 md:px-4 md:py-3 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white text-xs md:text-sm rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap shadow-xl border border-white/20 backdrop-blur-sm pointer-events-none"
              initial={{ y: 10, opacity: 0 }}
              whileHover={{ y: 0, opacity: 1 }}
            >
              <span className="flex items-center gap-2">
                <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-yellow-300" />
                <span className="bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent font-medium">
                  Chat with Pulau Pal
                </span>
                <span className="text-yellow-300 animate-pulse">✨</span>
              </span>
              <div className="absolute top-full right-4 md:left-6 w-2 h-2 bg-gray-900 rotate-45 -mt-1" />
            </motion.div>
          </motion.div>
        ) : (
          // Enhanced Chat Window with Sophisticated Design - Mobile responsive
          <motion.div
            key="chat"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`${isExpanded ? 'w-80 md:w-96 h-[650px] md:h-[700px]' : 'w-72 md:w-80 h-[550px] md:h-[600px]'} 
              bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-cyan-200/50 
              overflow-hidden transition-all duration-500 relative flex flex-col`}
            style={{
              backdropFilter: 'blur(20px)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)'
            }}
          >
            {/* Enhanced Header - Mobile responsive */}
            <div className={`${getThemeClasses()} px-3 md:px-4 py-2 md:py-3 relative overflow-hidden flex-shrink-0`}>
              <div className="relative flex items-center justify-between">
                <div className="flex items-center space-x-2 md:space-x-3">
                  <div className="relative">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                      <PalmtreeIcon className="h-4 w-4 md:h-5 md:w-5 text-white drop-shadow-lg" />
                    </div>
                    <div className="absolute -top-0.5 -right-0.5 md:-top-1 md:-right-1 w-2.5 h-2.5 md:w-3 md:h-3 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base md:text-lg drop-shadow-lg">{config.botName}</h3>
                    <p className="text-white/90 text-xs drop-shadow">Your Mystical Island Guide ✨</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-0.5 md:space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleLanguage}
                    className="text-white hover:bg-white/20 p-1.5 md:p-2 rounded-full transition-colors"
                    title="Change Language"
                  >
                    <Languages className="h-3.5 w-3.5 md:h-4 md:w-4" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-white hover:bg-white/20 p-1.5 md:p-2 rounded-full transition-colors"
                    title={isExpanded ? "Minimize" : "Expand"}
                  >
                    {isExpanded ? <Minimize2 className="h-3.5 w-3.5 md:h-4 md:w-4" /> : <Maximize2 className="h-3.5 w-3.5 md:h-4 md:w-4" />}
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    className="text-white hover:bg-white/20 p-1.5 md:p-2 rounded-full transition-colors"
                    title="Close Chat"
                  >
                    <X className="h-3.5 w-3.5 md:h-4 md:w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Enhanced Tabs with Better Layout - Mobile responsive */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
              <TabsList className="grid w-full grid-cols-3 bg-gradient-to-r from-cyan-50/90 via-blue-50/90 to-tropical-light/20 border-b border-cyan-100/60 backdrop-blur-sm flex-shrink-0 mx-1.5 md:mx-2 mt-1.5 md:mt-2 rounded-xl">
                <TabsTrigger value="chat" className="text-xs md:text-sm data-[state=active]:bg-white/90 data-[state=active]:text-cyan-600 data-[state=active]:shadow-lg rounded-lg transition-all duration-300">
                  <MessageCircle className="h-3 w-3 md:h-4 md:w-4 mr-0.5 md:mr-1" />
                  Chat
                </TabsTrigger>
                <TabsTrigger value="discover" className="text-xs md:text-sm data-[state=active]:bg-white/90 data-[state=active]:text-cyan-600 data-[state=active]:shadow-lg rounded-lg transition-all duration-300">
                  <Compass className="h-3 w-3 md:h-4 md:w-4 mr-0.5 md:mr-1" />
                  Discover
                </TabsTrigger>
                <TabsTrigger value="plan" className="text-xs md:text-sm data-[state=active]:bg-white/90 data-[state=active]:text-cyan-600 data-[state=active]:shadow-lg rounded-lg transition-all duration-300">
                  <Flag className="h-3 w-3 md:h-4 md:w-4 mr-0.5 md:mr-1" />
                  Plan Trip
                </TabsTrigger>
              </TabsList>

              {/* Chat Tab with Fixed Layout - Mobile responsive */}
              <TabsContent value="chat" className="flex-1 flex flex-col min-h-0 m-0">
                {/* Messages Container with Proper Scrolling */}
                <div className="flex-1 flex flex-col min-h-0">
                  <div 
                    ref={scrollAreaRef}
                    className="flex-1 overflow-y-auto px-3 md:px-4 py-2 md:py-3 space-y-2 md:space-y-3 min-h-0"
                    style={{ 
                      maxHeight: isExpanded ? '420px md:460px' : '320px md:360px',
                      scrollBehavior: 'smooth'
                    }}
                  >
                    <AnimatePresence>
                      {messages.map((message, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.95 }}
                          transition={{ duration: 0.4, ease: "easeOut" }}
                          className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-[85%] p-2.5 md:p-3 rounded-2xl backdrop-blur-sm border transition-all duration-300 ${
                            message.role === 'user'
                              ? 'bg-gradient-to-br from-cyan-500 via-blue-500 to-blue-600 text-white ml-2 md:ml-4 shadow-lg border-blue-200/30'
                              : 'bg-gradient-to-br from-white/90 via-gray-50/90 to-white/80 text-gray-800 mr-2 md:mr-4 border-gray-200/60 shadow-md'
                          }`}>
                            {message.role === 'assistant' && (
                              <div className="flex items-center mb-1.5 md:mb-2">
                                <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center mr-1.5 md:mr-2">
                                  <PalmtreeIcon className="h-2 w-2 md:h-2.5 md:w-2.5 text-white" />
                                </div>
                                <span className="text-xs font-medium text-cyan-600 bg-cyan-50 px-1.5 md:px-2 py-0.5 rounded-full">
                                  {config.botName}
                                </span>
                              </div>
                            )}
                            
                            <div className={`text-xs md:text-sm leading-relaxed ${
                              message.role === 'user' ? 'text-white' : 'text-gray-800'
                            }`}>
                              <ReactMarkdown 
                                components={{
                                  p: ({children}) => <p className="mb-1.5 md:mb-2 last:mb-0">{children}</p>,
                                  strong: ({children}) => <strong className="font-semibold">{children}</strong>,
                                  em: ({children}) => <em className="italic">{children}</em>
                                }}
                              >
                                {message.content}
                              </ReactMarkdown>
                            </div>
                            
                            {message.suggestedReplies && (
                              <div className="mt-2 md:mt-3 space-y-1">
                                {message.suggestedReplies.map((reply, replyIndex) => (
                                  <button
                                    key={replyIndex}
                                    onClick={() => handleSuggestedReply(reply)}
                                    className="block w-full text-left px-2 md:px-3 py-1 md:py-1.5 text-xs bg-white/90 hover:bg-white text-cyan-600 rounded-lg border border-cyan-200 hover:border-cyan-300 transition-colors"
                                  >
                                    {reply}
                                  </button>
                                ))}
                              </div>
                            )}

                            {message.actionButtons && (
                              <div className="mt-2 md:mt-3 space-y-1">
                                <p className="text-xs text-gray-500 mb-1">Quick Actions:</p>
                                <div className="grid grid-cols-1 gap-1">
                                  {message.actionButtons.map((button, buttonIndex) => (
                                    <motion.button
                                      key={buttonIndex}
                                      whileHover={{ scale: 1.02 }}
                                      whileTap={{ scale: 0.98 }}
                                      onClick={() => handleActionButton(button)}
                                      className={`flex items-center justify-center px-2 md:px-3 py-1.5 md:py-2 text-xs rounded-lg border transition-all duration-200 ${
                                        button.variant === 'primary' 
                                          ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white border-blue-300 hover:from-cyan-600 hover:to-blue-600' 
                                          : button.variant === 'secondary'
                                          ? 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
                                          : 'bg-white/90 text-cyan-600 border-cyan-200 hover:bg-cyan-50'
                                      }`}
                                    >
                                      {button.icon && <button.icon className="h-3 w-3 mr-1" />}
                                      {button.label}
                                    </motion.button>
                                  ))}
                                </div>
                              </div>
                            )}

                            {message.canStop && isGenerating && (
                              <div className="mt-2 md:mt-3">
                                <button
                                  onClick={stopGenerating}
                                  className="flex items-center px-2 md:px-3 py-1 text-xs bg-red-50 text-red-600 rounded-lg border border-red-200 hover:bg-red-100 transition-colors"
                                >
                                  <Square className="h-3 w-3 mr-1" />
                                  Stop generating
                                </button>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    
                    {/* Enhanced Typing Indicator - Mobile responsive */}
                    {(isTyping || isLoading) && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex justify-start"
                      >
                        <div className="bg-gradient-to-r from-gray-100 to-gray-50 border border-gray-200 p-2.5 md:p-3 rounded-2xl mr-2 md:mr-4">
                          <div className="flex items-center space-x-2">
                            <PalmtreeIcon className="h-3 w-3 md:h-4 md:w-4 text-cyan-600" />
                            <div className="flex space-x-1">
                              <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                              <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-cyan-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                              <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-cyan-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Quick Actions - Only when conversation is new - Mobile responsive */}
                  {messages.length <= 1 && (
                    <div className="px-3 md:px-4 py-1.5 md:py-2 border-t border-gray-100/60 bg-gradient-to-r from-cyan-50/70 via-blue-50/70 to-tropical-light/30 backdrop-blur-sm flex-shrink-0">
                      <p className="text-xs text-gray-600 mb-1.5 md:mb-2 font-medium flex items-center">
                        <Sparkles className="h-2.5 w-2.5 md:h-3 md:w-3 mr-1 text-cyan-500" />
                        ✨ Quick Island Magic:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {QUICK_REPLIES.slice(0, 3).map((reply, index) => (
                          <motion.button
                            key={index}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleQuickAction(reply.action)}
                            className="inline-flex items-center px-1.5 md:px-2 py-0.5 md:py-1 text-xs bg-white/90 hover:bg-cyan-50 text-cyan-600 rounded-lg border border-cyan-200/60 hover:border-cyan-300 transition-all duration-300 shadow-sm backdrop-blur-sm"
                          >
                            <reply.icon className="h-2.5 w-2.5 md:h-3 md:w-3 mr-0.5 md:mr-1" />
                            <span className="hidden sm:inline">{reply.label}</span>
                            <span className="sm:hidden">{reply.label.split(' ')[0]}</span>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Enhanced Input Area - Fixed at Bottom - Mobile responsive */}
                  <div className="flex-shrink-0 p-2.5 md:p-3 border-t border-gray-100/60 bg-gradient-to-r from-white/95 via-cyan-50/30 to-blue-50/30 backdrop-blur-sm">
                    <div className="flex items-center space-x-1.5 md:space-x-2">
                      <div className="flex-1 relative">
                        <Input
                          ref={inputRef}
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleSend();
                            }
                          }}
                          placeholder={config.language === 'en' ? "Ask about island magic..." : "Tanya tentang keajaiban pulau..."}
                          disabled={isLoading}
                          className="pr-8 md:pr-10 rounded-xl border-cyan-200/60 focus:border-cyan-400 focus:ring-cyan-400/30 h-8 md:h-10 bg-white/90 backdrop-blur-sm shadow-sm transition-all duration-300 placeholder:text-gray-400 text-xs md:text-sm"
                        />
                        {isLoading && (
                          <div className="absolute right-8 md:right-10 top-1/2 transform -translate-y-1/2">
                            <Loader2 className="h-3 w-3 md:h-4 md:w-4 animate-spin text-cyan-500" />
                          </div>
                        )}
                      </div>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          onClick={handleSend}
                          disabled={!input.trim() || isLoading}
                          size="sm"
                          className="rounded-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white p-1.5 md:p-2 h-8 w-8 md:h-10 md:w-10 flex-shrink-0 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                        >
                          <Send className="h-3 w-3 md:h-4 md:w-4" />
                        </Button>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Enhanced Discover Tab - Mobile responsive */}
              <TabsContent value="discover" className="flex-1 p-3 md:p-4 space-y-2 md:space-y-3 overflow-y-auto">
                <div className="text-center">
                  <Compass className="h-10 w-10 md:h-12 md:w-12 text-cyan-500 mx-auto mb-2 md:mb-3" />
                  <h3 className="font-semibold text-gray-800 mb-1 md:mb-2 text-sm md:text-base">Discover Island Wonders</h3>
                  <p className="text-xs md:text-sm text-gray-600 mb-3 md:mb-4">Let Pulau Pal guide you to hidden gems</p>
                </div>
                
                <div className="grid gap-1.5 md:gap-2">
                  {QUICK_REPLIES.map((reply, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setActiveTab('chat');
                        handleQuickAction(reply.action);
                      }}
                      className="flex items-center p-2.5 md:p-3 text-left bg-gradient-to-r from-cyan-50 to-blue-50 hover:from-cyan-100 hover:to-blue-100 rounded-xl border border-cyan-200 hover:border-cyan-300 transition-colors"
                    >
                      <reply.icon className="h-4 w-4 md:h-5 md:w-5 text-cyan-600 mr-2 md:mr-3 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-gray-800 text-xs md:text-sm">{reply.label}</div>
                        <div className="text-xs text-gray-600">{reply.action.substring(0, 30)}...</div>
                      </div>
                    </button>
                  ))}
                </div>
              </TabsContent>

              {/* Enhanced Plan Trip Tab - Mobile responsive */}
              <TabsContent value="plan" className="flex-1 p-3 md:p-4 space-y-2 md:space-y-3 overflow-y-auto">
                <div className="text-center">
                  <Flag className="h-10 w-10 md:h-12 md:w-12 text-cyan-500 mx-auto mb-2 md:mb-3" />
                  <h3 className="font-semibold text-gray-800 mb-1 md:mb-2 text-sm md:text-base">Plan Your Island Journey</h3>
                  <p className="text-xs md:text-sm text-gray-600 mb-3 md:mb-4">Customize your perfect island experience</p>
                </div>
                
                <div className="space-y-2 md:space-y-3">
                  <button
                    onClick={() => {
                      setActiveTab('chat');
                      handleQuickAction("Help me plan a 3-day island adventure");
                    }}
                    className="w-full p-2.5 md:p-3 text-left bg-gradient-to-r from-green-50 to-teal-50 hover:from-green-100 hover:to-teal-100 rounded-xl border border-green-200 hover:border-green-300 transition-colors"
                  >
                    <div className="font-medium text-gray-800 text-xs md:text-sm">🌅 3-Day Island Adventure</div>
                    <div className="text-xs text-gray-600">Complete itinerary with activities & stays</div>
                  </button>
                  
                  <button
                    onClick={() => {
                      setActiveTab('chat');
                      handleQuickAction("Show me budget-friendly island options");
                    }}
                    className="w-full p-2.5 md:p-3 text-left bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 rounded-xl border border-purple-200 hover:border-purple-300 transition-colors"
                  >
                    <div className="font-medium text-gray-800 text-xs md:text-sm">💰 Budget Island Escape</div>
                    <div className="text-xs text-gray-600">Affordable accommodations & activities</div>
                  </button>
                  
                  <button
                    onClick={() => {
                      setActiveTab('chat');
                      handleQuickAction("I want a luxury island experience");
                    }}
                    className="w-full p-2.5 md:p-3 text-left bg-gradient-to-r from-yellow-50 to-orange-50 hover:from-yellow-100 hover:to-orange-100 rounded-xl border border-yellow-200 hover:border-yellow-300 transition-colors"
                  >
                    <div className="font-medium text-gray-800 text-xs md:text-sm">✨ Luxury Island Retreat</div>
                    <div className="text-xs text-gray-600">Premium experiences & accommodations</div>
                  </button>
                  
                  <div className="mt-3 md:mt-4 p-2.5 md:p-3 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl border border-cyan-200">
                    <div className="text-xs md:text-sm font-medium text-gray-800 mb-2">🎯 Current Page Analysis</div>
                    <button
                      onClick={handleScanPage}
                      disabled={isLoading || !currentPage}
                      className="w-full px-2.5 md:px-3 py-1.5 md:py-2 text-xs md:text-sm bg-white hover:bg-cyan-50 text-cyan-600 rounded-lg border border-cyan-200 hover:border-cyan-300 transition-colors disabled:opacity-50"
                    >
                      {isLoading ? (
                        <><Loader2 className="h-3 w-3 md:h-4 md:w-4 mr-1.5 md:mr-2 animate-spin inline" />Analyzing...</>
                      ) : (
                        <><Search className="h-3 w-3 md:h-4 md:w-4 mr-1.5 md:mr-2 inline" />Analyze This Page</>
                      )}
                    </button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced Custom Scrollbar Styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .scrollbar-thin {
          scrollbar-width: thin;
        }
        .scrollbar-thumb-gray-300::-webkit-scrollbar-thumb {
          background-color: rgb(209 213 219);
          border-radius: 9999px;
        }
        .scrollbar-track-transparent::-webkit-scrollbar-track {
          background-color: transparent;
        }
        .scrollbar-none {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background: rgb(209 213 219);
          border-radius: 9999px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: rgb(156 163 175);
        }
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 4s linear infinite;
        }
        `
      }} />
    </div>
  );
};

export default ChatBot;

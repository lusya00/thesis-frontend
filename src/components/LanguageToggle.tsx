import React from 'react';
import { motion } from 'framer-motion';
import { Globe, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation, Language } from '@/hooks/useTranslation';

interface LanguageToggleProps {
  variant?: 'default' | 'navbar' | 'floating';
  className?: string;
}

const LanguageToggle: React.FC<LanguageToggleProps> = ({ 
  variant = 'default',
  className = ''
}) => {
  const { language, setLanguage } = useTranslation();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'id' : 'en');
  };

  const getLanguageInfo = (lang: Language) => {
    return {
      en: { code: 'EN', name: 'English', flag: '🇺🇸' },
      id: { code: 'ID', name: 'Bahasa Indonesia', flag: '🇮🇩' }
    }[lang];
  };

  const currentLang = getLanguageInfo(language);
  const nextLang = getLanguageInfo(language === 'en' ? 'id' : 'en');

  // Base styles for better visibility
  const baseStyles = "relative inline-flex items-center gap-2 font-medium transition-all duration-200 shadow-lg hover:shadow-xl";

  if (variant === 'navbar') {
    return (
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`${className}`}
      >
        <Button
          onClick={toggleLanguage}
          variant="ghost"
          size="sm"
          className={`${baseStyles} bg-white/90 backdrop-blur-md text-ocean-dark hover:bg-white border border-white/50 px-3 py-2 rounded-full`}
        >
          <Globe className="h-4 w-4" />
          <span className="text-sm font-semibold">{currentLang.code}</span>
          <span className="hidden sm:inline text-xs opacity-75">
            {currentLang.name}
          </span>
        </Button>
      </motion.div>
    );
  }

  if (variant === 'floating') {
    return (
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`${className}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Button
          onClick={toggleLanguage}
          className={`${baseStyles} bg-gradient-to-r from-ocean to-ocean-dark hover:from-ocean-dark hover:to-cyan-800 text-white border-2 border-white/20 px-4 py-3 rounded-2xl group min-w-[120px]`}
        >
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5 group-hover:rotate-12 transition-transform duration-200" />
            <div className="flex flex-col items-start">
              <span className="text-sm font-bold">{currentLang.flag} {currentLang.code}</span>
              <span className="text-xs opacity-90 leading-none">
                Switch to {nextLang.code}
              </span>
            </div>
            <ChevronDown className="h-4 w-4 opacity-75 group-hover:translate-y-0.5 transition-transform duration-200" />
          </div>
        </Button>
      </motion.div>
    );
  }

  // Default variant - enhanced visibility
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`${className}`}
    >
      <Button
        onClick={toggleLanguage}
        variant="outline"
        className={`${baseStyles} bg-white/95 backdrop-blur-md text-ocean-dark hover:bg-ocean hover:text-white border-2 border-ocean/30 hover:border-ocean px-4 py-2 rounded-xl`}
      >
        <Globe className="h-4 w-4" />
        <div className="flex items-center gap-2">
          <span className="font-semibold">{currentLang.flag} {currentLang.code}</span>
          <span className="text-xs opacity-75">→ {nextLang.flag} {nextLang.code}</span>
        </div>
      </Button>
    </motion.div>
  );
};

export default LanguageToggle; 
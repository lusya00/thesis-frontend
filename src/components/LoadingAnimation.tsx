import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Anchor, Waves, Sun } from 'lucide-react';

interface LoadingAnimationProps {
  isLoading: boolean;
  onComplete?: () => void;
  minLoadTime?: number;
}

const LoadingAnimation: React.FC<LoadingAnimationProps> = ({
  isLoading,
  onComplete,
  minLoadTime = 2000
}) => {
  const [progress, setProgress] = useState(0);
  const [showContent, setShowContent] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      // Start fade out animation
      const timer = setTimeout(() => {
        setShowContent(false);
        onComplete?.();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isLoading, onComplete]);

  useEffect(() => {
    if (isLoading) {
      setShowContent(true);
      setProgress(0);
      
      // Simulate loading progress
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + Math.random() * 15;
        });
      }, 150);

      return () => clearInterval(interval);
    }
  }, [isLoading]);

  if (!showContent) return null;

  return (
    <AnimatePresence mode="wait">
      {showContent && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-ocean-dark via-ocean to-tropical-dark"
        >
          {/* Animated background waves */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              animate={{
                x: [-100, 0],
                y: [0, -20, 0],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute -inset-10 opacity-20"
            >
              <Waves className="w-full h-full text-white/30" />
            </motion.div>
            
            {/* Floating particles */}
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-white/20 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [-20, 20],
                  opacity: [0.2, 0.8, 0.2],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>

          {/* Main content */}
          <div className="relative text-center text-white">
            {/* Logo with animation */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                duration: 1,
                type: "spring",
                stiffness: 200,
                damping: 20
              }}
              className="relative mb-8"
            >
              <div className="relative inline-flex items-center justify-center">
                {/* Rotating ring */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  className="absolute inset-0 w-32 h-32 border-4 border-transparent border-t-sand-light border-r-sand-light rounded-full"
                />
                
                {/* Pulsing ring */}
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    opacity: [0.6, 1, 0.6]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute inset-2 w-28 h-28 border-2 border-white/30 rounded-full"
                />
                
                {/* Logo container */}
                <div className="relative z-10 bg-white/10 backdrop-blur-sm p-6 rounded-full border border-white/20">
                  <div className="relative">
                    <Anchor className="w-10 h-10 text-white" />
                    <motion.div
                      animate={{ 
                        scale: [1, 1.2, 1],
                        rotate: [0, 15, -15, 0]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        delay: 0.5
                      }}
                    >
                      <Sun className="w-4 h-4 text-sand-light absolute -top-2 -right-2" />
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Brand name with stagger animation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="mb-2"
            >
              <motion.h1 
                className="text-4xl md:text-5xl font-bold font-playfair tracking-wider"
                initial={{ letterSpacing: '0.5em', opacity: 0 }}
                animate={{ letterSpacing: '0.1em', opacity: 1 }}
                transition={{ delay: 0.8, duration: 1 }}
              >
                UNTUNG JAWA
              </motion.h1>
              <motion.p 
                className="text-sand-light text-lg font-medium tracking-widest"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
              >
                Island Paradise
              </motion.p>
            </motion.div>

            {/* Loading text */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="text-white/80 mb-8 text-lg"
            >
              Preparing your island experience...
            </motion.p>

            {/* Progress bar */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.8 }}
              className="w-64 mx-auto"
            >
              <div className="relative h-2 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
                <motion.div
                  className="h-full bg-gradient-to-r from-sand-light via-tropical-light to-white rounded-full relative"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Shimmer effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    animate={{ x: [-100, 200] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                </motion.div>
              </div>
              
              {/* Progress percentage */}
              <motion.div
                className="text-center mt-3 text-white/70 font-medium"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                {Math.round(progress)}%
              </motion.div>
            </motion.div>

            {/* Subtitle with wave animation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.2 }}
              className="mt-8"
            >
              <motion.p
                className="text-sm text-white/60 tracking-wide"
                animate={{ 
                  opacity: [0.6, 1, 0.6],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                Building a better future with quality island experiences
              </motion.p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingAnimation; 
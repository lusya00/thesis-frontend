import React from "react";
import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const RecommendationWidget = () => {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence mode="wait">
        <motion.div
          key="widget"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          className="relative group cursor-pointer"
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

          {/* Enhanced widget with sophisticated styling - mobile responsive */}
          <motion.div
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
            <Link
              to="/recommendations"
              className="relative z-10 text-white flex items-center justify-center w-full h-full"
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
                <Sparkles className="h-6 w-6 md:h-7 md:w-7 drop-shadow-lg filter brightness-110" />
              </motion.div>
            </Link>
          </motion.div>

          {/* Enhanced Tooltip - Mobile responsive */}
          <motion.div
            className="absolute bottom-full right-0 mb-3 px-3 py-2 md:px-4 md:py-3 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white text-xs md:text-sm rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap shadow-xl border border-white/20 backdrop-blur-sm pointer-events-none"
            initial={{ y: 10, opacity: 0 }}
            whileHover={{ y: 0, opacity: 1 }}
          >
            <span className="flex items-center gap-2">
              <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-yellow-300" />
              <span className="bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent font-medium">
                Homestay Recommendations
              </span>
              <span className="text-yellow-300 animate-pulse">✨</span>
            </span>
            <div className="absolute top-full right-4 w-2 h-2 bg-gray-900 rotate-45 -mt-1" />
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default RecommendationWidget;

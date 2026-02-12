import React, { useEffect, useState } from "react";
import EnhancedNavbar from "../components/EnhancedNavbar";
import EnhancedHeroSection from "../components/EnhancedHeroSection";
import EnhancedAboutSection from "../components/EnhancedAboutSection";
import HomestaySection from "../components/HomestaySection";
import Footer from "../components/Footer";
import LoadingAnimation from "../components/LoadingAnimation";

import { ArrowUp } from "lucide-react";
import { motion } from "framer-motion";

const Index = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [contentLoaded, setContentLoaded] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 500) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    // Simulate loading time and preload critical resources
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
      // Small delay before showing content for smooth transition
      setTimeout(() => setContentLoaded(true), 300);
    }, 1500); // Reduced from 3000 to 1500ms for better UX

    // Fallback: ensure content loads even if something goes wrong
    const fallbackTimer = setTimeout(() => {
      setIsLoading(false);
      setContentLoaded(true);
    }, 3000); // Maximum 3 seconds before forcing content to show

    // Ensure page starts at the top
    window.scrollTo(0, 0);

    return () => {
      clearTimeout(loadingTimer);
      clearTimeout(fallbackTimer);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {/* Loading Animation */}
      <LoadingAnimation 
        isLoading={isLoading} 
        onComplete={() => setContentLoaded(true)}
      />
      
      {/* Main Content */}
      <motion.div 
        className="min-h-screen bg-white font-poppins motion-safe-fallback"
        initial={{ opacity: 0 }}
        animate={{ opacity: contentLoaded ? 1 : 0 }}
        transition={{ duration: 0.5 }}
        style={{ 
          // Fallback: ensure content is visible even if animation fails
          opacity: contentLoaded ? 1 : 0.3,
          minHeight: '100vh'
        }}
      >
        <EnhancedNavbar />
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: contentLoaded ? 1 : 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <EnhancedHeroSection />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ 
            opacity: contentLoaded ? 1 : 0,
            y: contentLoaded ? 0 : 50
          }}
          transition={{ duration: 0.8, delay: 0.4 }}
          id="about"
        >
          <EnhancedAboutSection />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ 
            opacity: contentLoaded ? 1 : 0,
            y: contentLoaded ? 0 : 50
          }}
          transition={{ duration: 0.8, delay: 0.6 }}
          id="homestays"
        >
          <HomestaySection />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ 
            opacity: contentLoaded ? 1 : 0,
            y: contentLoaded ? 0 : 50
          }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <Footer />
        </motion.div>
        
        {/* Enhanced Scroll to top button */}
        <motion.button
          onClick={scrollToTop}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: showScrollTop && contentLoaded ? 1 : 0,
            scale: showScrollTop && contentLoaded ? 1 : 0,
            y: showScrollTop ? 0 : 20
          }}
          transition={{ 
            type: "spring", 
            stiffness: 400, 
            damping: 30 
          }}
          whileHover={{ 
            scale: 1.1, 
            backgroundColor: "rgba(13, 148, 136, 0.9)" 
          }}
          whileTap={{ scale: 0.9 }}
          className="fixed right-6 bottom-6 bg-gradient-to-r from-ocean to-ocean-dark text-white p-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all z-50 backdrop-blur-sm border border-white/20 group"
        >
          <ArrowUp className="h-5 w-5 group-hover:-translate-y-1 transition-transform duration-300" />
          
          {/* Subtle glow effect */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-ocean to-ocean-dark opacity-0 group-hover:opacity-50 blur-md transition-opacity duration-300" />
        </motion.button>

        {/* Floating elements for visual appeal */}
        {contentLoaded && (
          <div className="fixed inset-0 pointer-events-none overflow-hidden z-10">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-ocean/10 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -100, 0],
                  opacity: [0, 0.3, 0],
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: 8 + Math.random() * 4,
                  repeat: Infinity,
                  delay: Math.random() * 5,
                }}
              />
            ))}
          </div>
        )}
      </motion.div>
    </>
  );
};

export default Index;

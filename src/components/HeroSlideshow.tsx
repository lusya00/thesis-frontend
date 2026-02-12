import React, { useState, useEffect, useCallback, useMemo } from "react";
import { ChevronLeft, ChevronRight, Map, MapPin, PlayCircle, PauseCircle, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const HeroSlideshow = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [autoplay, setAutoplay] = useState(true);
  const [isHovering, setIsHovering] = useState(false);

  const images = useMemo(() => [
    {
      id: 1,
      title: "Paradise Found on Untung Jawa Island",
      description: "Crystal clear waters just 90 minutes from Jakarta's heart",
      url: "/untung.jpeg",
    },
    {
      id: 2,
      title: "Pristine Island Paradise",
      description: "Discover untouched natural beauty",
      url: "/island-optimized.webp",
    },
    {
      id: 3,
      title: "Cultural Experiences",
      description: "Immerse in local traditions",
      url: "/dancing-optimized.webp",
    },
    {
      id: 4,
      title: "Authentic Homestays",
      description: "Stay with local families",
      url: "/stayhome-optimized.webp",
    },
  ], []);

  useEffect(() => {
    // Optimized image preloading
    const preloadImages = async () => {
      try {
        await Promise.all(
          images.map((image) => {
            return new Promise((resolve, reject) => {
              const img = new Image();
              img.src = image.url;
              img.onload = resolve;
              img.onerror = reject;
            });
          })
        );
        setImagesLoaded(true);
      } catch (error) {
        console.error("Error preloading images:", error);
        setImagesLoaded(true);
      }
    };

    preloadImages();
  }, [images]);

  const goToNextSlide = useCallback(() => {
    if (animating) return;
    setAnimating(true);
    setCurrentSlide((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [animating, images.length]);

  const goToPrevSlide = useCallback(() => {
    if (animating) return;
    setAnimating(true);
    setCurrentSlide((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [animating, images.length]);

  // Optimized autoplay
  useEffect(() => {
    let timer: number | undefined;
    
    if (autoplay && !isHovering && imagesLoaded) {
      timer = window.setTimeout(() => {
        goToNextSlide();
      }, 5000);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [currentSlide, autoplay, isHovering, goToNextSlide, imagesLoaded]);

  // Optimized keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        goToPrevSlide();
      } else if (e.key === "ArrowRight") {
        goToNextSlide();
      } else if (e.key === " ") {
        setAutoplay(prev => !prev);
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [goToNextSlide, goToPrevSlide]);

  const toggleAutoplay = useCallback(() => {
    setAutoplay(prev => !prev);
  }, []);

  // Optimized loading state
  if (!imagesLoaded) {
    return (
      <div className="h-screen w-full bg-gradient-to-br from-blue-900 to-cyan-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg text-white font-medium">Loading paradise...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="relative h-screen w-full overflow-hidden flex"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Optimized Video Section */}
      <div className="w-1/2 h-full relative">
        {!videoError ? (
          <video
            className="h-full w-full object-cover"
            autoPlay
            loop
            muted
            playsInline
            onError={() => setVideoError(true)}
          >
            <source src="/untung-jawa.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <img
            src="/untung.jpeg"
            alt="Untung Jawa Island"
            className="h-full w-full object-cover"
          />
        )}
        {/* Simplified gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-transparent" />
        
        {/* Video overlay content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
            >
              <h3 className="text-white font-playfair text-2xl font-bold mb-3">
                Experience the Magic
              </h3>
              <p className="text-white/90 mb-4">
                Watch our island come alive through the eyes of our guests
              </p>
              <div className="flex items-center justify-center space-x-2 text-white/80">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="font-semibold">4.9</span>
                <span>(200+ Reviews)</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Optimized Slideshow Section */}
      <div className="w-1/2 h-full relative">
        <AnimatePresence mode="wait">
          {images.map((image, index) => (
            index === currentSlide && (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 1, ease: "easeInOut" }}
                className="absolute inset-0"
                onAnimationComplete={() => setAnimating(false)}
              >
                <img
                  src={image.url}
                  alt={`Slide ${index + 1}`}
                  className="h-full w-full object-cover"
                  loading="eager"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement!.style.background = 'linear-gradient(135deg, #0c4a6e 0%, #0e7490 30%, #0f766e 60%, #065f46 100%)';
                  }}
                />
                {/* Simplified overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-black/30 to-black/60" />
              </motion.div>
            )
          ))}
        </AnimatePresence>

        {/* Optimized Navigation Controls */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <motion.button
            onClick={toggleAutoplay}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 transition-all duration-200"
            title={autoplay ? "Pause slideshow" : "Play slideshow"}
          >
            {autoplay ? (
              <PauseCircle className="h-5 w-5 text-white" />
            ) : (
              <PlayCircle className="h-5 w-5 text-white" />
            )}
          </motion.button>
          <motion.button
            onClick={goToPrevSlide}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 transition-all duration-200"
            title="Previous slide"
          >
            <ChevronLeft className="h-5 w-5 text-white" />
          </motion.button>
          <motion.button
            onClick={goToNextSlide}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 transition-all duration-200"
            title="Next slide"
          >
            <ChevronRight className="h-5 w-5 text-white" />
          </motion.button>
        </div>

        {/* Optimized Content Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="container mx-auto px-6 text-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6 }}
              >
                {/* Title */}
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-playfair text-white mb-6 leading-tight">
                  {images[currentSlide].title}
                </h1>
                
                {/* Description */}
                <p className="text-xl md:text-2xl text-white/95 mb-8 max-w-2xl mx-auto leading-relaxed">
                  {images[currentSlide].description}
                </p>
                
                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <motion.a 
                    href="#homestays" 
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="btn-primary shadow-xl flex items-center justify-center gap-2 group bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 px-6 py-3 text-lg font-semibold"
                  >
                    <span>Explore Homestays</span>
                    <MapPin className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </motion.a>
                  
                  <motion.a 
                    href="#about" 
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="btn-secondary flex items-center justify-center gap-2 group bg-white/15 hover:bg-white/25 backdrop-blur-sm border border-white/30 hover:border-white/50 px-6 py-3 text-lg font-semibold"
                  >
                    <span>Discover the Island</span>
                    <Map className="h-5 w-5 group-hover:rotate-6 transition-transform duration-300" />
                  </motion.a>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Optimized slide indicators */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
          <div className="flex space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-2 border border-white/20">
            {images.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => setCurrentSlide(index)}
                whileHover={{ scale: 1.1 }}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide 
                    ? 'bg-white shadow-md' 
                    : 'bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Simplified progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
          <motion.div
            className="h-full bg-gradient-to-r from-cyan-400 to-blue-500"
            initial={{ width: "0%" }}
            animate={{ width: autoplay && !isHovering ? "100%" : "0%" }}
            transition={{ duration: 5, ease: "linear" }}
            key={currentSlide}
          />
        </div>
      </div>
    </div>
  );
};

export default HeroSlideshow;

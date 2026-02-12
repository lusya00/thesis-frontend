import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useTranslation } from "@/hooks/useTranslation";
import { authService } from '@/lib/services/authService';
import { motion, useScroll, useTransform } from "framer-motion";
import { Anchor, Calendar, CheckCircle, ChevronDown, Clock, Heart, MapPin, PlayCircle, Shield, Star, Sun, Users, Waves, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const EnhancedHeroSection = () => {
  const { t } = useTranslation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Optimized parallax transforms with reduced range
  const yBg = useTransform(scrollY, [0, 800], [0, 150]);
  const yContent = useTransform(scrollY, [0, 800], [0, 80]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);

  const slides = useMemo(() => [
    {
      titleKey: "hero.slide3.title",
      subtitleKey: "hero.slide3.subtitle",
      descriptionKey: "hero.slide3.description",
      featureKey: "hero.slide3.feature",
      image: "/dancing-optimized.webp",
      fallback: "/dancing.png",
      rating: "4.9",
      reviews: "180+"
    },
    {
      titleKey: "hero.slide1.title",
      subtitleKey: "hero.slide1.subtitle",
      descriptionKey: "hero.slide1.description",
      featureKey: "hero.slide1.feature",
      image: "/untung-optimized.webp",
      fallback: "/untung.jpeg",
      rating: "4.9",
      reviews: "200+"
    },
    {
      titleKey: "hero.slide2.title",
      subtitleKey: "hero.slide2.subtitle",
      descriptionKey: "hero.slide2.description",
      featureKey: "hero.slide2.feature",
      image: "/island-optimized.webp",
      fallback: "/island.jpeg",
      rating: "4.8", 
      reviews: "150+"
    }
  ], []);

  // Preload images for better performance
  useEffect(() => {
    const preloadImages = async () => {
      try {
        await Promise.all(
          slides.map((slide) => {
            return new Promise((resolve, reject) => {
              const img = new Image();
              img.src = slide.image;
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
  }, [slides]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 2000); // Even shorter: 2 seconds
    return () => clearInterval(interval);
  }, [slides.length]);

  useEffect(() => {
    setIsAuthenticated(authService.isAuthenticated());
  }, []);

  const scrollToContent = () => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Loading state
  if (!imagesLoaded) {
    return (
      <div className="h-screen w-full bg-gradient-to-br from-blue-900 to-cyan-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg text-white font-medium">{t('hero.loading_paradise')}</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={heroRef} className="relative h-[80vh] overflow-hidden">
      {/* Direct Image Crossfade - No Background Colors */}
      <motion.div 
        style={{ y: yBg }}
        className="absolute inset-0 z-0"
      >
        {slides.map((slide, index) => (
          <motion.div
            key={index}
            initial={false}
            animate={{ 
              opacity: index === currentSlide ? 1 : 0,
              zIndex: index === currentSlide ? 2 : 1
            }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <picture>
              <source srcSet={slide.image} type="image/webp" />
              <img 
                src={slide.fallback}
                alt={t(slide.titleKey)}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </picture>
            <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/70" />
          </motion.div>
        ))}
      </motion.div>

      {/* Main Content - Mobile Responsive */}
      <motion.div 
        style={{ y: yContent, opacity }}
        className="relative z-10 h-[80vh] flex items-center py-8 sm:py-12 lg:py-0"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-12 items-center">
            
            {/* Main Hero Content - Mobile First Design */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="lg:col-span-2 relative text-center lg:text-left space-y-4 lg:space-y-6"
            >
              {/* Brand section - Mobile Optimized */}
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="flex items-center justify-center lg:justify-start mb-2 lg:mb-3 group"
              >
                <div className="relative mr-3 lg:mr-4">
                  <div className="p-2 lg:p-4 bg-white/15 backdrop-blur-sm rounded-xl lg:rounded-2xl border border-white/30">
                    <Anchor className="w-6 h-6 lg:w-10 lg:h-10 text-white group-hover:text-cyan-300 transition-colors duration-300" />
                  </div>
                  <Sun className="w-4 h-4 lg:w-6 lg:h-6 text-yellow-300 absolute -top-1 -right-1 lg:-top-2 lg:-right-2" />
                </div>
                <div>
                  <h3 className="text-white font-playfair text-lg lg:text-2xl font-bold tracking-wider mb-1">
                    UNTUNG JAWA
                  </h3>
                  <p className="text-cyan-200 text-xs lg:text-sm tracking-widest uppercase">{t('hero.brand_tagline')}</p>
                </div>
              </motion.div>

              {/* Dynamic content - Static Text, Dynamic Images */}
              <div>
                {/* Static Typography */}
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold font-playfair text-white mb-3 lg:mb-6 leading-tight">
                  {t('hero.slide1.title')}
                </h1>
                
                <div className="mb-4 lg:mb-6">
                  <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-cyan-100 font-medium mb-2 lg:mb-3">
                    {t('hero.slide1.subtitle')}
                  </h2>
                  <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-white/90 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                    {t('hero.slide1.description')}
                  </p>
                </div>

                {/* Static Stats Display */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 lg:gap-6 mb-6 lg:mb-8">
                  <div className="flex items-center space-x-1 lg:space-x-2 bg-white/10 backdrop-blur-sm px-2 lg:px-4 py-1 lg:py-2 rounded-full border border-white/20">
                    <Star className="w-3 h-3 lg:w-5 lg:h-5 text-yellow-400 fill-yellow-400" />
                    <span className="text-white font-bold text-sm lg:text-lg">4.9</span>
                    <span className="text-white/80 text-xs lg:text-base">(200+)</span>
                  </div>
                  <div className="flex items-center space-x-1 lg:space-x-2 bg-white/10 backdrop-blur-sm px-2 lg:px-4 py-1 lg:py-2 rounded-full border border-white/20">
                    <Heart className="w-3 h-3 lg:w-5 lg:h-5 text-red-400 fill-red-400" />
                    <span className="text-white/80 text-xs lg:text-base">{t('hero.bookings_stat')}</span>
                  </div>
                  <div className="hidden sm:flex items-center space-x-1 lg:space-x-2 bg-white/10 backdrop-blur-sm px-2 lg:px-4 py-1 lg:py-2 rounded-full border border-white/20">
                    <CheckCircle className="w-3 h-3 lg:w-5 lg:h-5 text-green-400 fill-green-400" />
                    <span className="text-white/80 text-xs lg:text-base">{t('hero.satisfaction_stat')}</span>
                  </div>
                </div>
              </div>

              {/* Mobile Responsive CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 mb-6 lg:mb-8 max-w-md mx-auto lg:mx-0">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button 
                    size="lg"
                    onClick={() => navigate('/homestays')}
                    className="w-full group relative overflow-hidden bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white border-none shadow-2xl transition-all duration-300 text-sm lg:text-lg px-4 lg:px-8 py-3 lg:py-4"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2 lg:gap-3">
                      <MapPin className="w-4 h-4 lg:w-6 lg:h-6 group-hover:translate-x-1 transition-transform duration-300" />
                      <span className="font-semibold">{t('hero.explore_homestays')}</span>
                    </span>
                  </Button>
                </motion.div>

                <Dialog open={showVideoModal} onOpenChange={setShowVideoModal}>
                  <DialogTrigger asChild>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button 
                        size="lg"
                        variant="outline"
                        className="w-full group bg-white/15 backdrop-blur-sm border-white/40 text-white hover:bg-white/25 transition-all duration-300 text-sm lg:text-lg px-4 lg:px-8 py-3 lg:py-4"
                      >
                        <PlayCircle className="w-4 h-4 lg:w-6 lg:h-6 mr-2 lg:mr-3 group-hover:scale-110 transition-transform duration-300" />
                        <span className="font-semibold">{t('hero.watch_video')}</span>
                      </Button>
                    </motion.div>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl bg-black/95 border-none p-0">
                    <div className="relative aspect-video">
                      <button
                        onClick={() => setShowVideoModal(false)}
                        className="absolute top-4 right-4 z-50 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
                      >
                        <X className="w-6 h-6" />
                      </button>
                      <video
                        className="w-full h-full object-cover rounded-lg"
                        autoPlay
                        controls
                        playsInline
                      >
                        <source src="/untung-jawa.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Mobile Responsive Slide indicators */}
              <div className="flex space-x-2 lg:space-x-4 justify-center lg:justify-start">
                {slides.map((slide, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    whileHover={{ scale: 1.1 }}
                    className={`relative transition-all duration-300 ${
                      index === currentSlide 
                        ? 'w-8 lg:w-16 h-1.5 lg:h-2 bg-white shadow-lg' 
                        : 'w-4 lg:w-8 h-1.5 lg:h-2 bg-white/40 hover:bg-white/70'
                    } rounded-full`}
                  />
                ))}
              </div>
            </motion.div>
            
            {/* Streamlined Sidebar - Mobile Hidden, Desktop Visible */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="hidden lg:block lg:col-span-1 relative space-y-6"
            >
              {/* Single consolidated booking/info card */}
              <motion.div
                whileHover={{ scale: 1.02, y: -5 }}
                className="bg-white/15 backdrop-blur-sm rounded-3xl p-6 border border-white/30 shadow-xl"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-bold text-lg">{t('hero.quick_booking')}</h3>
                  <Waves className="w-6 h-6 text-cyan-300" />
                </div>
                <p className="text-white/90 text-sm mb-4">
                  {t('hero.find_escape')}
                </p>
                
                {/* Quick info */}
                <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                  <div className="flex items-center space-x-2 text-white/80">
                    <Users className="w-4 h-4" />
                    <span>{t('hero.guests_range')}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-white/80">
                    <Shield className="w-4 h-4" />
                    <span>{t('hero.verified')}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-white/80">
                    <Clock className="w-4 h-4" />
                    <span>{t('hero.trip_time')}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-white/80">
                    <Calendar className="w-4 h-4" />
                    <span>{t('hero.book_now')}</span>
                  </div>
                </div>

                {/* Auth integration or main CTA */}
                {!isAuthenticated ? (
                  <div className="space-y-3">
                    <div className="text-center mb-3">
                      <p className="text-white/80 text-xs mb-2">{t('hero.join_experience')}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        size="sm"
                        onClick={() => navigate('/login')}
                        className="flex-1 bg-white/20 hover:bg-white/30 text-white border border-white/30 text-xs py-2"
                      >
                        {t('hero.sign_in')}
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => navigate('/signup')}
                        className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs py-2"
                      >
                        {t('hero.sign_up')}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button 
                    onClick={() => navigate('/homestays')}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold"
                  >
                    {t('hero.find_homestays')}
                  </Button>
                )}
              </motion.div>

              {/* Simplified experience highlights */}
              <motion.div
                whileHover={{ scale: 1.02, y: -3 }}
                className="bg-gradient-to-br from-orange-500/20 to-pink-600/20 backdrop-blur-sm rounded-3xl p-6 border border-orange-300/30 shadow-xl"
              >
                <h3 className="text-white font-bold text-lg mb-4">{t('hero.island_experiences')}</h3>
                <div className="space-y-3">
                  {[
                    { icon: "🏖️", textKey: "hero.pristine_beaches", color: "text-blue-200" },
                    { icon: "🏡", textKey: "hero.family_homestays", color: "text-green-200" },
                    { icon: "🎣", textKey: "hero.fishing_adventures", color: "text-yellow-200" },
                    { icon: "🍽️", textKey: "hero.fresh_seafood", color: "text-orange-200" },
                  ].map((item, index) => (
                    <div key={index} className={`flex items-center space-x-3 ${item.color}`}>
                      <span className="text-lg">{item.icon}</span>
                      <span className="text-sm font-medium">{t(item.textKey)}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Scroll indicator - Desktop Only */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 hidden lg:block"
      >
        <motion.button
          onClick={scrollToContent}
          className="flex flex-col items-center space-y-2 group"
          whileHover={{ y: -5 }}
        >
          <span className="text-white/80 text-sm font-medium">Discover Paradise</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="p-3 rounded-full bg-white/15 backdrop-blur-sm border border-white/30 group-hover:bg-white/25 transition-colors duration-300"
          >
            <ChevronDown className="w-5 h-5 text-white" />
          </motion.div>
        </motion.button>
      </motion.div>

      {/* Mobile Scroll Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20 lg:hidden">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentSlide ? 'bg-white' : 'bg-white/40'
            }`}
          />
        ))}
      </div>

      {/* Minimal floating particles - reduced for performance */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-5 hidden lg:block">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -150, 0],
              opacity: [0, 0.6, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 10 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 8,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default EnhancedHeroSection; 
import React, { useEffect, useState } from "react";
import { ArrowRight, MapPin } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

const HeroVideo = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  const handleVideoError = () => {
    console.log("Video failed to load, showing fallback image");
    setVideoError(true);
  };

  return (
    <div className="relative w-full h-[90vh] overflow-hidden">
      {/* Split screen container */}
      <div className="flex flex-col md:flex-row h-full">
        {/* Content section - 40% on desktop, hidden on mobile */}
        <div className={`hidden md:flex w-[40%] bg-gradient-to-r from-ocean-dark/90 to-ocean-dark items-center justify-center px-10 
          ${isLoaded ? "animate-slideUp opacity-100" : "opacity-0"}`}
        >
          <div className="max-w-md">
            <div className="flex items-center mb-3">
              <MapPin className="h-5 w-5 text-sand" />
              <span className="ml-2 text-sand text-sm font-medium">Jakarta's Hidden Gem</span>
            </div>
            
            <h1 className="text-5xl font-bold text-white font-playfair mb-4 leading-tight">
              Discover the Beauty of <span className="text-sand-light">Untung Jawa</span>
            </h1>
            
            <p className="text-white/80 mb-8 text-lg">
              Experience pristine beaches, local culture, and authentic homestays just a short boat ride from Jakarta.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild className="bg-sand hover:bg-sand-dark text-ocean-dark">
                <Link to="/homestays">
                  Explore Homestays <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-white/30 text-white hover:bg-white/10">
                <Link to="/activities">
                  Discover Activities
                </Link>
              </Button>
            </div>
            
            <div className="mt-10 flex items-center">
              <div className="w-10 h-10 rounded-full bg-ocean flex items-center justify-center">
                <span className="text-white text-xs">24°C</span>
              </div>
              <div className="ml-3">
                <p className="text-sand-light text-sm">Perfect weather</p>
                <p className="text-white/70 text-xs">Year-round tropical climate</p>
              </div>
            </div>
          </div>
        </div>

        {/* Video section - takes 60% on desktop, full on mobile */}
        <div className="relative w-full md:w-[60%] h-full overflow-hidden">
          {/* Video overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/30 z-10"></div>
          
          {/* Video background */}
          <video 
            autoPlay 
            muted 
            loop 
            playsInline
            className="object-cover h-full w-full"
            poster="/island-optimized.webp" 
            onError={handleVideoError}
          >
            {!videoError && (
              <>
                <source src="https://cdn.lovable.dev/untung-jawa/island-aerial.mp4" type="video/mp4" />
                <source src="https://cdn.lovable.dev/untung-jawa/island-aerial.webm" type="video/webm" />
              </>
            )}
            Your browser does not support the video tag.
          </video>
          
          {/* Mobile overlay content - only visible on small screens */}
          <div className="absolute inset-0 flex items-center justify-center z-20 md:hidden">
            <div className="text-center px-4">
              <h1 className="text-4xl font-bold text-white font-playfair mb-2 drop-shadow-lg">
                Untung Jawa Island
              </h1>
              <p className="text-white/90 mb-6 max-w-sm mx-auto drop-shadow-md">
                Jakarta's island paradise awaits
              </p>
              <Button asChild className="bg-ocean hover:bg-ocean-dark">
                <Link to="/homestays">
                  Explore Homestays <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Wave overlay at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-wave-pattern bg-no-repeat bg-bottom bg-cover z-20"></div>
    </div>
  );
};

export default HeroVideo;

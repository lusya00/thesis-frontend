import React from "react";
import { MapPin, Anchor, Fish, Users, Sun, TreePalm, Camera, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";

const AboutSection = () => {
  const features = [
    {
      icon: <MapPin className="h-8 w-8 text-ocean" />,
      title: "Prime Location",
      description: "Just 15 km from Jakarta's coast, easily accessible by boat"
    },
    {
      icon: <Anchor className="h-8 w-8 text-ocean" />,
      title: "Marine Adventures", 
      description: "Snorkeling, diving, and fishing in pristine waters"
    },
    {
      icon: <Fish className="h-8 w-8 text-ocean" />,
      title: "Rich Biodiversity",
      description: "Home to diverse marine life and coastal ecosystems"
    },
    {
      icon: <Users className="h-8 w-8 text-ocean" />,
      title: "Local Culture",
      description: "Experience authentic island community living"
    }
  ];

  const islands = [
    {
      name: "Cipir Island",
      type: "Cultural & Historical",
      image: "/island-optimized.webp",
    },
    {
      name: "Onrust Island",
      type: "Cultural/Historical",
      image: "/dancing-optimized.webp",
    },
    {
      name: "Bidari Islands",
      type: "Resort",
      image: "/stayhome-optimized.webp",
    },
  ];

  // Additional images of Untung Jawa Island
  const galleryImages = [
    {
      url: "/untung.jpeg",
      caption: "Beach view of Untung Jawa"
    },
    {
      url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
      caption: "Coastal waters around the island"
    },
    {
      url: "https://images.unsplash.com/photo-1517022812141-23620dba5c23",
      caption: "Island wildlife and scenery"
    },
    {
      url: "https://images.unsplash.com/photo-1501854140801-50d01698950b",
      caption: "Aerial view of the island"
    },
    {
      url: "https://images.unsplash.com/photo-1472396961693-142e6e269027",
      caption: "Natural beauty of Untung Jawa"
    }
  ];

  return (
    <section id="about" className="py-16 md:py-24 bg-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-ocean/5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-sand/10 rounded-full translate-x-1/3 translate-y-1/3"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center mb-3">
            <Sun className="text-ocean h-6 w-6 mr-2 animate-pulse" />
            <Badge variant="outline" className="bg-ocean/10 text-ocean border-ocean/20 font-medium px-3 py-1">
              Paradise Awaits
            </Badge>
            <Sun className="text-ocean h-6 w-6 ml-2 animate-pulse" />
          </div>
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-ocean-dark mb-4 relative">
            About Untung Jawa
            <div className="w-24 h-1 bg-ocean mx-auto mt-2"></div>
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            A serene island paradise just off the coast of Jakarta, offering an
            escape from city life with pristine beaches, clear waters, and
            authentic local experiences.
          </p>
        </div>

        {/* Main showcase image with overlay text */}
        <div className="relative rounded-2xl overflow-hidden mb-16 shadow-xl">
          <img 
            src="https://images.unsplash.com/photo-1506744038136-46273834b3fb" 
            alt="Untung Jawa Island Panorama"
            className="w-full h-[60vh] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
            <div className="p-8 text-white max-w-2xl">
              <h3 className="text-3xl font-bold mb-3 font-playfair">Discover Paradise</h3>
              <p className="text-white/90">
                Untung Jawa Island is a hidden gem in Jakarta's Thousand Islands archipelago, 
                offering a perfect blend of natural beauty, cultural heritage, and sustainable tourism.
              </p>
            </div>
          </div>
        </div>

        {/* Image Gallery Carousel */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-ocean-dark font-playfair flex items-center">
              <Camera className="h-6 w-6 mr-2 text-ocean" />
              Island Gallery
            </h3>
            <Badge variant="outline" className="bg-ocean/5 text-ocean">
              Swipe to explore
            </Badge>
          </div>
          
          <Carousel className="w-full">
            <CarouselContent>
              {galleryImages.map((image, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-1">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Card className="overflow-hidden cursor-pointer group">
                          <CardContent className="p-0 relative">
                            <div className="overflow-hidden">
                              <img 
                                src={image.url} 
                                alt={image.caption}
                                className="h-64 w-full object-cover transition-all duration-300 group-hover:scale-105" 
                              />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                              <p className="p-4 text-white text-sm">{image.caption}</p>
                            </div>
                          </CardContent>
                        </Card>
                      </DialogTrigger>
                                            <DialogContent className="max-w-4xl p-0 overflow-hidden">                        <DialogTitle className="sr-only">{image.caption}</DialogTitle>                        <img                           src={image.url}                           alt={image.caption}                          className="w-full h-auto"                         />                        <div className="p-4 bg-white">                          <p className="text-lg font-medium">{image.caption}</p>                        </div>                      </DialogContent>
                    </Dialog>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </Carousel>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {islands.map((island, index) => (
            <div key={index} className="group cursor-pointer transform transition-all duration-500 hover:-translate-y-2">
              <div className="relative overflow-hidden rounded-2xl shadow-lg">
                <img
                  src={island.image}
                  alt={island.name}
                  className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                  <div className="absolute bottom-0 left-0 right-0 p-5 text-white transform transition-all duration-500 translate-y-0 group-hover:translate-y-[-5px]">
                    <h3 className="text-xl font-bold mb-1 flex items-center">
                      <TreePalm className="h-5 w-5 mr-2 text-sand" />
                      {island.name}
                    </h3>
                    <div className="text-sm text-sand flex items-center">
                      <Badge variant="outline" className="bg-white/10 border-white/20">
                        {island.type}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-ocean-dark font-playfair flex items-center">
            <Info className="h-6 w-6 mr-2 text-ocean" />
            A Hidden Gem in Jakarta's Thousand Islands
          </h3>
          <p className="text-gray-700">
            Untung Jawa Island is located in the Province of Jakarta.
            It is an archipelago of 8 islands namely the Kelond Island, Onrust island, Cipir island, Rambut island, Bidari Island, Ayer island, Damar Island and Untung Jawa island all of which are places of attractions for different reasons.
          </p>
          <p className="text-gray-700">
            The island spans approximately 40 hectares and is home to a small
            community that warmly welcomes visitors. With its well-maintained
            facilities, it's perfect for day trips or longer stays at our
            locally-run homestays.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-10">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center p-6 bg-gradient-to-br from-white to-gray-50 rounded-2xl hover:shadow-xl transition-all duration-500 hover:-translate-y-1 border border-gray-100"
              >
                <div className="p-3 bg-ocean/10 rounded-full mb-3">
                  {feature.icon}
                </div>
                <h4 className="font-bold text-ocean-dark text-lg mb-2">
                  {feature.title}
                </h4>
                <p className="text-sm text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;

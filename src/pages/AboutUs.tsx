import React from "react";
import EnhancedNavbar from "../components/EnhancedNavbar";
import Footer from "../components/Footer";
import { Badge } from "@/components/ui/badge";
import { Anchor, Fish, MapPin, Shell, Sun, TreePalm, Users, Camera, Award, Heart, Globe, Star, Waves, Activity } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { motion, AnimatePresence } from "framer-motion";

const AboutUs = () => {
  const features = [
    {
      icon: <MapPin className="h-8 w-8 text-ocean" />,
      title: "Prime Location",
      description: "Just 15 km from Jakarta's coast, easily accessible by boat",
      color: "bg-blue-50",
      gradient: "from-blue-50 to-cyan-50"
    },
    {
      icon: <Anchor className="h-8 w-8 text-ocean" />,
      title: "Marine Adventures", 
      description: "Snorkeling, diving, and fishing in pristine waters",
      color: "bg-cyan-50",
      gradient: "from-cyan-50 to-teal-50"
    },
    {
      icon: <Fish className="h-8 w-8 text-ocean" />,
      title: "Rich Biodiversity",
      description: "Home to diverse marine life and coastal ecosystems",
      color: "bg-teal-50",
      gradient: "from-teal-50 to-emerald-50"
    },
    {
      icon: <Users className="h-8 w-8 text-ocean" />,
      title: "Local Culture",
      description: "Experience authentic island community living",
      color: "bg-emerald-50",
      gradient: "from-emerald-50 to-green-50"
    }
  ];

  const teamMembers = [
    {
      name: "Dewi Surya",
      role: "Island Manager",
      bio: "Born and raised on Untung Jawa, Dewi has been managing tourism initiatives for over 15 years.",
      photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
      achievements: ["15+ Years Experience", "Community Leader"],
      rating: 4.9
    },
    {
      name: "Agus Santoso",
      role: "Conservation Specialist",
      bio: "With a degree in marine biology, Agus leads our conservation and sustainability programs.",
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
      achievements: ["Marine Biology Degree", "Conservation Expert"],
      rating: 4.8
    },
    {
      name: "Siti Rahayu",
      role: "Homestay Coordinator",
      bio: "Siti works directly with local families to ensure visitors have authentic and comfortable stays.",
      photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=688&q=80",
      achievements: ["Hospitality Expert", "Cultural Ambassador"],
      rating: 4.9
    },
    {
      name: "Budi Pratama",
      role: "Tour Guide",
      bio: "A passionate storyteller who knows every corner of the island and its surrounding waters.",
      photo: "https://images.unsplash.com/photo-1500048993953-d23a436266cf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1469&q=80",
      achievements: ["Island Expert", "Storyteller"],
      rating: 4.7
    }
  ];

  const timelineEvents = [
    {
      year: "1970s",
      title: "Early Tourism Development",
      description: "First visitors began exploring Untung Jawa's natural beauty",
      icon: <Sun className="h-5 w-5" />,
      color: "from-yellow-400 to-orange-400"
    },
    {
      year: "1992",
      title: "Conservation Status",
      description: "Island designated as protected marine area by Jakarta government",
      icon: <Shell className="h-5 w-5" />,
      color: "from-blue-400 to-cyan-400"
    },
    {
      year: "2005",
      title: "Community-Led Tourism",
      description: "Local residents established the first homestay accommodations",
      icon: <Users className="h-5 w-5" />,
      color: "from-green-400 to-emerald-400"
    },
    {
      year: "2015",
      title: "Sustainability Initiatives",
      description: "Launch of plastic-free island campaign and coral restoration projects",
      icon: <TreePalm className="h-5 w-5" />,
      color: "from-emerald-400 to-teal-400"
    },
    {
      year: "2023",
      title: "Digital Transformation",
      description: "Online booking platform launched to connect tourists with local experiences",
      icon: <Globe className="h-5 w-5" />,
      color: "from-purple-400 to-pink-400"
    }
  ];

  const galleryImages = [
    {
      url: "/untung.jpeg",
      caption: "Beautiful coastline of Untung Jawa Island",
      category: "Landscape"
    },
    {
      url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
      caption: "Crystal clear waters surrounding the island",
      category: "Waters"
    },
    {
      url: "https://images.unsplash.com/photo-1517022812141-23620dba5c23",
      caption: "Vibrant marine life and coral reefs",
      category: "Marine Life"
    },
    {
      url: "https://images.unsplash.com/photo-1501854140801-50d01698950b",
      caption: "Aerial view showcasing the island's beauty",
      category: "Aerial"
    },
    {
      url: "https://images.unsplash.com/photo-1472396961693-142e6e269027",
      caption: "Pristine beaches and tropical paradise",
      category: "Beaches"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-sand-light/20 to-ocean/5 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.1, 1],
          }}
          transition={{
            rotate: { duration: 50, repeat: Infinity, ease: "linear" },
            scale: { duration: 8, repeat: Infinity, ease: "easeInOut" }
          }}
          className="absolute -top-32 -right-32 w-64 h-64 bg-gradient-to-br from-ocean/10 to-tropical/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            rotate: -360,
            scale: [1, 1.2, 1],
          }}
          transition={{
            rotate: { duration: 60, repeat: Infinity, ease: "linear" },
            scale: { duration: 10, repeat: Infinity, ease: "easeInOut" }
          }}
          className="absolute top-1/2 -left-32 w-96 h-96 bg-gradient-to-br from-sand-light/15 to-sand-dark/15 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            y: [0, -20, 0],
            x: [0, 20, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-32 right-16 w-48 h-48 bg-gradient-to-br from-tropical/10 to-ocean/10 rounded-full blur-2xl"
        />
      </div>

      <EnhancedNavbar />
      
      {/* Enhanced Hero Section with Parallax Effect */}
      <motion.div 
        className="relative h-screen md:h-[75vh] overflow-hidden mt-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-ocean via-ocean-dark to-cyan-900">
          <motion.img 
            src="https://images.unsplash.com/photo-1506929562872-bb421503ef21?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1568&q=80" 
            alt="Untung Jawa Island Panorama"
            className="w-full h-full object-cover mix-blend-overlay opacity-80"
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 8, ease: "easeOut" }}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent">
          <div className="container mx-auto px-4 h-full flex items-center justify-center py-8 md:py-0">
            <motion.div 
              className="text-center text-white max-w-5xl"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div 
                className="inline-flex items-center justify-center mb-8"
                variants={itemVariants}
              >
                <motion.div 
                  className="p-4 bg-white/10 backdrop-blur-sm rounded-full border border-white/20"
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <Anchor className="h-10 w-10 text-white" />
                </motion.div>
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <Badge variant="outline" className="bg-white/10 border-white/30 text-white font-medium px-6 py-3 mb-8 text-base backdrop-blur-md">
                  <Star className="h-4 w-4 mr-2" />
                  Discover Our Story
                </Badge>
              </motion.div>
              
              <motion.h1 
                className="text-6xl md:text-7xl lg:text-8xl font-bold font-playfair mb-8 leading-tight"
                variants={itemVariants}
              >
                About{" "}
                <motion.span 
                  className="bg-gradient-to-r from-sand-light via-white to-sand-light bg-clip-text text-transparent"
                  animate={{ 
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] 
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                >
                  Untung Jawa
                </motion.span>
              </motion.h1>
              
              <motion.p 
                className="text-xl md:text-2xl text-white/90 max-w-4xl mx-auto leading-relaxed mb-8"
                variants={itemVariants}
              >
                Where pristine nature meets authentic Indonesian hospitality in Jakarta's hidden island paradise
              </motion.p>

              <motion.div 
                className="flex flex-col sm:flex-row flex-wrap justify-center gap-4"
                variants={itemVariants}
              >
                <motion.a 
                  href="/homestays" 
                  className="bg-white/90 backdrop-blur-sm text-ocean px-6 md:px-8 py-3 md:py-4 rounded-full hover:bg-white transition-all duration-300 font-semibold shadow-lg hover:shadow-xl inline-flex items-center justify-center gap-2 text-sm md:text-base"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Users className="h-4 w-4 md:h-5 md:w-5" />
                  Explore Homestays
                </motion.a>
                <motion.a 
                  href="/activities" 
                  className="bg-white/10 backdrop-blur-sm text-white px-6 md:px-8 py-3 md:py-4 rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300 font-semibold inline-flex items-center justify-center gap-2 text-sm md:text-base"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Activity className="h-4 w-4 md:h-5 md:w-5" />
                  View Activities
                </motion.a>
              </motion.div>
            </motion.div>
          </div>
        </div>
        
        {/* Enhanced floating elements */}
        <motion.div 
          className="absolute top-20 left-10"
          animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="p-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
            <Fish className="h-6 w-6 text-white" />
          </div>
        </motion.div>
        
        <motion.div 
          className="absolute bottom-32 right-16"
          animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="p-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
            <Shell className="h-6 w-6 text-white" />
          </div>
        </motion.div>
        
        <motion.div 
          className="absolute top-1/2 right-20"
          animate={{ x: [0, 10, 0], y: [0, -10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="p-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
            <Waves className="h-5 w-5 text-white" />
          </div>
        </motion.div>
      </motion.div>

      {/* Enhanced Stats Section */}
      <motion.div 
        className="relative mt-8 mb-20 z-10"
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { number: "50+", label: "Years of History", icon: <Sun className="h-6 w-6" />, color: "from-yellow-400 to-orange-400" },
              { number: "1000+", label: "Happy Visitors", icon: <Users className="h-6 w-6" />, color: "from-green-400 to-emerald-400" },
              { number: "40", label: "Hectares of Paradise", icon: <TreePalm className="h-6 w-6" />, color: "from-emerald-400 to-teal-400" },
              { number: "24/7", label: "Island Experience", icon: <Heart className="h-6 w-6" />, color: "from-pink-400 to-red-400" }
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: idx * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <Card className="text-center bg-white/90 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group">
                  <CardContent className="pt-6 pb-4 relative">
                    <motion.div 
                      className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                    />
                    <motion.div 
                      className="flex justify-center mb-3"
                      whileHover={{ scale: 1.2, rotate: 10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className={`p-3 rounded-full bg-gradient-to-br ${stat.color} text-white shadow-lg`}>
                        {stat.icon}
                      </div>
                    </motion.div>
                    <motion.div 
                      className="text-3xl font-bold text-ocean-dark mb-1"
                      initial={{ scale: 0.5 }}
                      whileInView={{ scale: 1 }}
                      transition={{ delay: idx * 0.1 + 0.3, duration: 0.5, type: "spring" }}
                      viewport={{ once: true }}
                    >
                      {stat.number}
                    </motion.div>
                    <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        
        {/* Enhanced Introduction Section */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, staggerChildren: 0.2 }}
          viewport={{ once: true }}
        >
          <motion.div 
            className="space-y-6"
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.div 
              className="inline-flex items-center gap-2 bg-ocean/10 text-ocean px-4 py-2 rounded-full"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <Globe className="h-4 w-4" />
              <span className="font-medium">Our Island Paradise</span>
            </motion.div>
            <motion.h2 
              className="text-4xl lg:text-5xl font-bold text-ocean-dark font-playfair leading-tight"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              viewport={{ once: true }}
            >
              A Hidden Gem in Jakarta's Thousand Islands
            </motion.h2>
            <motion.div 
              className="space-y-4 text-gray-700 text-lg leading-relaxed"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              viewport={{ once: true }}
            >
              <p>
                Untung Jawa Island stands as one of the most accessible and beautifully preserved islands in Jakarta's renowned Thousand Islands archipelago. Located just 15 kilometers from North Jakarta's bustling coast, our 40-hectare sanctuary offers an extraordinary escape from urban life.
              </p>
              <p>
                The name "Untung Jawa" translates to "Java's Fortune," perfectly capturing the island's precious natural wealth and strategic significance. Today, we proudly share this fortune with visitors while maintaining our commitment to environmental preservation and community empowerment.
              </p>
              <p>
                Our community-based tourism model ensures that every visit directly benefits local families while supporting critical conservation efforts that protect our irreplaceable marine ecosystems for future generations.
              </p>
            </motion.div>
            
            <motion.div 
              className="flex flex-wrap gap-3"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              viewport={{ once: true }}
            >
              {["Sustainable Tourism", "Marine Conservation", "Cultural Heritage"].map((tag, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.05, y: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  <Badge variant="outline" className="bg-ocean/5 text-ocean border-ocean/20 px-3 py-1 hover:bg-ocean/10 transition-colors duration-200">
                    {tag}
                  </Badge>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="relative"
            initial={{ x: 50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.div 
              className="relative rounded-2xl overflow-hidden shadow-2xl group"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.4 }}
            >
              <img 
                src="/untung.jpeg" 
                alt="Beautiful view of Untung Jawa Island"
                className="w-full h-[500px] object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
              <motion.div 
                className="absolute bottom-6 left-6 right-6"
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <motion.div 
                  className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20"
                  whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.15)" }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center gap-3 text-white">
                    <Award className="h-6 w-6 text-yellow-400" />
                    <div>
                      <div className="font-semibold">Protected Marine Area</div>
                      <div className="text-sm opacity-90">Designated since 1992</div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
            
            {/* Enhanced floating decorative elements */}
            <motion.div 
              className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-ocean to-ocean-dark rounded-full flex items-center justify-center shadow-lg"
              animate={{ rotate: 360, scale: [1, 1.1, 1] }}
              transition={{ rotate: { duration: 8, repeat: Infinity, ease: "linear" }, scale: { duration: 2, repeat: Infinity } }}
              whileHover={{ scale: 1.2 }}
            >
              <Shell className="h-8 w-8 text-white" />
            </motion.div>
            <motion.div 
              className="absolute -bottom-4 -left-4 w-12 h-12 bg-gradient-to-br from-sand to-sand-dark rounded-full flex items-center justify-center shadow-lg"
              animate={{ y: [0, -10, 0], rotate: [0, 180, 360] }}
              transition={{ y: { duration: 3, repeat: Infinity }, rotate: { duration: 6, repeat: Infinity, ease: "linear" } }}
              whileHover={{ scale: 1.2 }}
            >
              <Fish className="h-6 w-6 text-ocean" />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Enhanced Features Grid */}
        <motion.div 
          className="mb-20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.div 
            className="text-center mb-12"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Badge variant="outline" className="bg-ocean/5 text-ocean border-ocean/20 mb-4">
              Island Highlights
            </Badge>
            <h3 className="text-4xl font-bold text-ocean-dark mb-4 font-playfair">Why Choose Untung Jawa</h3>
            <p className="text-gray-700 max-w-2xl mx-auto text-lg">
              Discover what makes our island paradise the perfect destination for adventure, relaxation, and cultural immersion.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ y: 40, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                whileHover={{ y: -8, scale: 1.02 }}
              >
                <Card
                  className={`group hover:shadow-xl transition-all duration-500 border-0 backdrop-blur-sm bg-gradient-to-br ${feature.gradient} relative overflow-hidden`}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-ocean/5 to-tropical/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  />
                  <CardContent className="p-6 text-center relative z-10">
                    <motion.div 
                      className="mb-4 transform group-hover:scale-110 transition-transform duration-300"
                      whileHover={{ rotate: 10 }}
                    >
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                        {feature.icon}
                      </div>
                    </motion.div>
                    <h4 className="font-bold text-ocean-dark text-lg mb-3 group-hover:text-ocean transition-colors duration-300">
                      {feature.title}
                    </h4>
                    <p className="text-gray-600 text-sm leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Enhanced Gallery Section */}
        <motion.div 
          className="mb-20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.div 
            className="text-center mb-10"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <motion.div 
              className="inline-flex items-center gap-2 bg-ocean/10 text-ocean px-4 py-2 rounded-full mb-4"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <Camera className="h-4 w-4" />
              <span className="font-medium">Visual Journey</span>
            </motion.div>
            <h3 className="text-4xl font-bold text-ocean-dark font-playfair mb-4">Island Gallery</h3>
            <p className="text-gray-700 max-w-2xl mx-auto">
              Explore the breathtaking beauty of Untung Jawa through our curated collection of stunning imagery.
            </p>
          </motion.div>
          
          <Carousel className="w-full">
            <CarouselContent>
              {galleryImages.map((image, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <motion.div 
                    className="p-2"
                    initial={{ scale: 0.9, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    viewport={{ once: true }}
                  >
                    <Dialog>
                      <DialogTrigger asChild>
                        <motion.div
                          whileHover={{ y: -5 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Card className="overflow-hidden cursor-pointer group hover:shadow-xl transition-all duration-300 border-0">
                            <CardContent className="p-0 relative">
                              <div className="overflow-hidden aspect-[4/3] relative">
                                <img 
                                  src={image.url} 
                                  alt={image.caption}
                                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110" 
                                />
                                <motion.div 
                                  className="absolute top-2 right-2 bg-ocean/20 backdrop-blur-sm rounded-full px-2 py-1 text-xs text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                  initial={{ scale: 0 }}
                                  whileHover={{ scale: 1 }}
                                >
                                  {image.category}
                                </motion.div>
                              </div>
                              <motion.div 
                                className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end"
                                initial={{ opacity: 0 }}
                                whileHover={{ opacity: 1 }}
                              >
                                <div className="p-4 text-white">
                                  <p className="text-sm font-medium">{image.caption}</p>
                                </div>
                              </motion.div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl p-0 overflow-hidden">
                        <DialogTitle className="sr-only">{image.caption}</DialogTitle>
                        <motion.img
                          src={image.url}
                          alt={image.caption}
                          className="w-full h-auto"
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        />
                        <div className="p-6 bg-white">
                          <div className="flex items-center justify-between">
                            <p className="text-lg font-medium">{image.caption}</p>
                            <Badge variant="outline" className="bg-ocean/5 text-ocean border-ocean/20">
                              {image.category}
                            </Badge>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </Carousel>
        </motion.div>
        
        {/* Enhanced Tabbed Content */}
        <motion.div 
          className="mb-20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Tabs defaultValue="mission" className="w-full">
            <div className="flex justify-center mb-10">
              <TabsList className="grid w-full max-w-lg grid-cols-3 h-12 bg-ocean/5 backdrop-blur-sm">
                <TabsTrigger value="mission" className="data-[state=active]:bg-ocean data-[state=active]:text-white font-medium transition-all duration-300">Our Mission</TabsTrigger>
                <TabsTrigger value="history" className="data-[state=active]:bg-ocean data-[state=active]:text-white font-medium transition-all duration-300">History</TabsTrigger>
                <TabsTrigger value="team" className="data-[state=active]:bg-ocean data-[state=active]:text-white font-medium transition-all duration-300">Our Team</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="mission" className="space-y-8">
              <motion.div 
                className="max-w-3xl mx-auto text-center"
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <motion.div 
                  className="w-20 h-20 bg-gradient-to-br from-ocean to-ocean-dark rounded-full flex items-center justify-center mx-auto mb-6"
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  transition={{ duration: 0.3 }}
                >
                  <TreePalm className="h-10 w-10 text-white" />
                </motion.div>
                <h4 className="text-3xl font-bold text-ocean-dark mb-6 font-playfair">Sustainable Paradise</h4>
                <p className="text-gray-700 mb-8 text-lg leading-relaxed">
                  Our mission is to showcase Untung Jawa's natural splendor while preserving its delicate ecosystem through responsible, community-driven tourism practices.
                </p>
              </motion.div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {[
                  {
                    title: "Protect Marine Life",
                    description: "Through coral restoration projects, marine protected areas, and comprehensive education programs for visitors and locals alike.",
                    icon: <Fish className="h-8 w-8 text-ocean" />
                  },
                  {
                    title: "Support Local Community",
                    description: "Ensuring tourism benefits flow directly to island residents through homestays, guided tours, and authentic cultural experiences.",
                    icon: <Users className="h-8 w-8 text-ocean" />
                  },
                  {
                    title: "Minimize Environmental Impact",
                    description: "Through innovative waste reduction initiatives, renewable energy projects, and sustainable water management practices.",
                    icon: <Globe className="h-8 w-8 text-ocean" />
                  }
                ].map((mission, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ y: 40, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ delay: idx * 0.2, duration: 0.6 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -5, scale: 1.02 }}
                  >
                    <Card className="hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
                      <CardHeader className="text-center">
                        <motion.div 
                          className="w-16 h-16 bg-ocean/10 rounded-full flex items-center justify-center mx-auto mb-4"
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ duration: 0.3 }}
                        >
                          {mission.icon}
                        </motion.div>
                        <CardTitle className="text-ocean-dark">{mission.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 text-center leading-relaxed">{mission.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="history">
              <div className="max-w-4xl mx-auto">
                <div className="relative">
                  {timelineEvents.map((event, idx) => (
                    <motion.div 
                      key={idx} 
                      className="flex gap-6 mb-12 group"
                      initial={{ x: -50, opacity: 0 }}
                      whileInView={{ x: 0, opacity: 1 }}
                      transition={{ delay: idx * 0.1, duration: 0.6 }}
                      viewport={{ once: true }}
                    >
                      <div className="flex flex-col items-center">
                        <motion.div 
                          className={`w-16 h-16 bg-gradient-to-br ${event.color} rounded-full flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}
                          whileHover={{ scale: 1.2, rotate: 10 }}
                        >
                          {event.icon}
                        </motion.div>
                        {idx < timelineEvents.length - 1 && (
                          <motion.div 
                            className={`w-0.5 h-16 bg-gradient-to-b ${event.color} mt-4 opacity-30`}
                            initial={{ scaleY: 0 }}
                            whileInView={{ scaleY: 1 }}
                            transition={{ delay: idx * 0.1 + 0.3, duration: 0.5 }}
                            viewport={{ once: true }}
                          />
                        )}
                      </div>
                      <motion.div 
                        className="flex-1 pb-8"
                        whileHover={{ x: 5 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1 border border-gray-100">
                          <div className="flex items-center gap-3 mb-3">
                            <Badge variant="outline" className="bg-ocean/5 text-ocean border-ocean/20 font-bold">
                              {event.year}
                            </Badge>
                          </div>
                          <h4 className="text-xl font-bold text-ocean-dark mb-2">{event.title}</h4>
                          <p className="text-gray-700 leading-relaxed">{event.description}</p>
                        </div>
                      </motion.div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="team">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
                {teamMembers.map((member, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ y: 40, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ delay: idx * 0.1, duration: 0.6 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -8, scale: 1.02 }}
                  >
                    <Card className="group hover:shadow-xl transition-all duration-500 overflow-hidden border-0 bg-white/90 backdrop-blur-sm">
                      <div className="relative overflow-hidden aspect-[4/5]">
                        <img 
                          src={member.photo} 
                          alt={member.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <motion.div 
                          className="absolute top-4 right-4 bg-white/10 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          initial={{ scale: 0 }}
                          whileHover={{ scale: 1 }}
                        >
                          <Star className="h-3 w-3 text-yellow-400 fill-current" />
                          <span className="text-xs text-white font-medium">{member.rating}</span>
                        </motion.div>
                        <motion.div 
                          className="absolute bottom-4 left-4 right-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"
                          initial={{ y: 20, opacity: 0 }}
                          whileHover={{ y: 0, opacity: 1 }}
                        >
                          <div className="space-y-2">
                            {member.achievements.map((achievement, achievementIdx) => (
                              <Badge key={achievementIdx} variant="outline" className="bg-white/10 border-white/30 text-white text-xs backdrop-blur-sm">
                                {achievement}
                              </Badge>
                            ))}
                          </div>
                        </motion.div>
                      </div>
                      <CardContent className="p-6">
                        <h4 className="font-bold text-ocean-dark text-lg mb-1">{member.name}</h4>
                        <p className="text-ocean font-medium text-sm mb-3">{member.role}</p>
                        <p className="text-gray-600 text-sm leading-relaxed">{member.bio}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
        
        {/* Enhanced Call to Action */}
        <motion.div 
          className="relative"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-ocean via-ocean-dark to-cyan-900 rounded-3xl"></div>
          <motion.div 
            className="relative bg-white/5 backdrop-blur-sm rounded-3xl p-12 text-center border border-white/10 overflow-hidden"
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.3 }}
          >
            {/* Animated background pattern */}
            <div className="absolute inset-0 overflow-hidden">
              <motion.div
                className="absolute -top-10 -right-10 w-32 h-32 bg-white/5 rounded-full"
                animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="absolute -bottom-10 -left-10 w-24 h-24 bg-white/5 rounded-full"
                animate={{ rotate: -360, scale: [1, 1.3, 1] }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              />
            </div>
            
            <div className="max-w-4xl mx-auto relative z-10">
              <motion.div 
                className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-8"
                whileHover={{ scale: 1.1, rotate: 10 }}
                transition={{ duration: 0.3 }}
              >
                <Heart className="h-12 w-12 text-white" />
              </motion.div>
              <motion.h3 
                className="text-3xl md:text-4xl font-bold text-white mb-6 font-playfair"
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                viewport={{ once: true }}
              >
                Experience Untung Jawa For Yourself
              </motion.h3>
              <motion.p 
                className="text-white/90 mb-8 max-w-2xl mx-auto text-lg leading-relaxed"
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                viewport={{ once: true }}
              >
                Whether you're seeking a weekend escape or an extended retreat, our island paradise promises pristine beaches, 
                authentic experiences, and memories that will last a lifetime.
              </motion.p>
              <motion.div 
                className="flex flex-wrap gap-4 justify-center"
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <motion.a 
                  href="/homestays" 
                  className="bg-white text-ocean px-8 py-4 rounded-full hover:bg-sand-light transition-colors duration-300 font-semibold shadow-lg hover:shadow-xl inline-flex items-center gap-2"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Users className="h-5 w-5" />
                  Book Your Adventure
                </motion.a>
                <motion.a 
                  href="/activities" 
                  className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-full border border-white/20 hover:bg-white/20 transition-colors duration-300 font-semibold inline-flex items-center gap-2"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Camera className="h-5 w-5" />
                  Explore Activities
                </motion.a>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
      
      <Footer />
    </div>
  );
};

export default AboutUs;

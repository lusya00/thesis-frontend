import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslation } from "@/hooks/useTranslation";
import { adaptHomestayForDisplay, homestayService } from "@/lib/services/homestayService";
import { AnimatePresence, motion } from "framer-motion";
import { Bed, DollarSign, Filter, Home, MapPin, Search, Star, TreePalm, UserCheck, Users, Waves, X } from "lucide-react";
import { useEffect, useState } from "react";
import EnhancedNavbar from "../components/EnhancedNavbar";
import HomestayGrid from "../components/accommodation/HomestayGrid";
import type { Homestay } from "../components/accommodation/types";

const AccommodationPage = () => {
  const { language, setLanguage, t } = useTranslation();
  const [homestays, setHomestays] = useState<Homestay[]>([]);
  const [filteredHomestays, setFilteredHomestays] = useState<Homestay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState("all");
  const [guestCapacity, setGuestCapacity] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchHomestays = async () => {
      try {
        setLoading(true);
        const data = await homestayService.getAllHomestays(language);
        
        // Map backend homestay data to the frontend Homestay type
        const adaptedHomestays = data.map(adaptHomestayForDisplay);
        setHomestays(adaptedHomestays);
        setFilteredHomestays(adaptedHomestays);
      } catch (error) {
        console.error("Error fetching homestays:", error);
        setError("Failed to load homestays. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchHomestays();
  }, [language]);

  // Filter effect
  useEffect(() => {
    let filtered = [...homestays];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(homestay =>
        homestay.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        homestay.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Price filter
    if (priceRange !== "all") {
      filtered = filtered.filter(homestay => {
        const price = parseFloat(homestay.price.replace(/[^0-9]/g, ''));
        switch (priceRange) {
          case "budget":
            return price <= 300000;
          case "mid":
            return price > 300000 && price <= 600000;
          case "luxury":
            return price > 600000;
          default:
            return true;
        }
      });
    }

    // Guest capacity filter
    if (guestCapacity !== "all") {
      filtered = filtered.filter(homestay => {
        const capacity = parseInt(homestay.capacity.replace(/[^0-9]/g, ''));
        switch (guestCapacity) {
          case "1-2":
            return capacity <= 2;
          case "3-4":
            return capacity >= 3 && capacity <= 4;
          case "5+":
            return capacity >= 5;
          default:
            return true;
        }
      });
    }

    setFilteredHomestays(filtered);
  }, [searchQuery, priceRange, guestCapacity, homestays]);

  const clearFilters = () => {
    setSearchQuery("");
    setPriceRange("all");
    setGuestCapacity("all");
    setFilteredHomestays(homestays);
  };

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
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-ocean-light/20 via-sand-light/30 to-tropical-light/20 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.1, 1],
          }}
          transition={{
            rotate: { duration: 70, repeat: Infinity, ease: "linear" },
            scale: { duration: 8, repeat: Infinity, ease: "easeInOut" }
          }}
          className="absolute -top-96 -right-96 w-[900px] h-[900px] bg-gradient-to-br from-ocean/10 to-tropical/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            rotate: -360,
            scale: [1, 1.2, 1],
          }}
          transition={{
            rotate: { duration: 55, repeat: Infinity, ease: "linear" },
            scale: { duration: 6, repeat: Infinity, ease: "easeInOut" }
          }}
          className="absolute -bottom-96 -left-96 w-[1100px] h-[1100px] bg-gradient-to-br from-sand-light/15 to-sand-dark/15 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            rotate: 180,
            scale: [1, 1.05, 1],
          }}
          transition={{
            rotate: { duration: 45, repeat: Infinity, ease: "linear" },
            scale: { duration: 10, repeat: Infinity, ease: "easeInOut" }
          }}
          className="absolute top-1/4 left-1/2 w-[500px] h-[500px] bg-gradient-to-br from-tropical/5 to-ocean/5 rounded-full blur-3xl"
        />
      </div>

      <EnhancedNavbar />
      

      
      {/* Enhanced Hero Section */}
      <section className="relative py-32 text-white overflow-hidden">
        <div className="absolute inset-0">
          <motion.img 
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.8 }}
            transition={{ duration: 1.5 }}
            src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2080&q=80" 
            alt="Beautiful homestays" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-ocean-dark/95 via-ocean/80 to-tropical/90"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            className="text-center max-w-6xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold font-playfair mb-8 leading-tight">
              Island 
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-sand to-sand-light">
                {t('accommodation.title')}
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-sand-light/90 max-w-4xl mx-auto leading-relaxed mb-10">
              {t('accommodation.subtitle')}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-sand to-sand-light hover:from-sand-light hover:to-sand text-ocean-dark font-semibold rounded-2xl px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Home className="mr-2 h-5 w-5" />
                  {t('hero.find_perfect_stay')}
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  size="lg"
                  onClick={() => {
                    // Scroll to homestays section
                    const homestaysSection = document.querySelector('[data-homestays-section]');
                    if (homestaysSection) {
                      homestaysSection.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="bg-gradient-to-r from-ocean to-tropical hover:from-tropical hover:to-ocean text-white rounded-2xl px-8 py-4 font-semibold transition-all duration-300 shadow-lg"
                >
                  <Star className="mr-2 h-5 w-5" />
                  {t('hero.view_featured')}
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-32 relative z-10">
        {/* Enhanced Header Section */}
        <motion.section 
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-12">
            <div className="inline-flex items-center mb-6">
              <TreePalm className="text-ocean h-8 w-8 mr-3" />
              <span className="text-ocean font-semibold uppercase tracking-wider">{t('accommodation.island_homestays')}</span>
              <Waves className="text-ocean h-8 w-8 ml-3" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-ocean-dark mb-6 font-playfair">
              {t('accommodation.perfect_home')}
            </h2>
            <p className="text-xl text-ocean/70 max-w-3xl mx-auto leading-relaxed">
              {t('accommodation.family_experience')}
            </p>
          </div>

          {/* Enhanced Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { icon: <Home className="h-8 w-8 text-ocean" />, number: "15+", label: t('stats.family_homestays') },
              { icon: <Bed className="h-8 w-8 text-ocean" />, number: "50+", label: t('stats.comfortable_rooms') },
              { icon: <Users className="h-8 w-8 text-ocean" />, number: "1000+", label: t('stats.happy_guests') },
              { icon: <Star className="h-8 w-8 text-ocean" />, number: "4.8", label: t('stats.average_rating') }
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="text-center p-6 bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-ocean/10 to-tropical/10 rounded-2xl mb-4">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-ocean-dark mb-2">{stat.number}</div>
                <div className="text-ocean/70 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.section>
        
        {/* Enhanced Content */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              className="flex flex-col items-center justify-center py-32"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-20 h-20 border-4 border-ocean/20 border-t-ocean rounded-full"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Home className="h-8 w-8 text-ocean" />
                </div>
              </div>
              <p className="text-2xl text-ocean-dark font-medium mt-8 mb-2">{t('general.loading_homestays')}</p>
              <p className="text-ocean/70">{t('general.finding_accommodation')}</p>
            </motion.div>
          ) : error ? (
            <motion.div 
              className="max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl p-12 border border-white/50 shadow-2xl text-center overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-500/10 to-orange-500/10 rounded-full -translate-y-16 translate-x-16"></div>
                
                <div className="relative z-10">
                  <div className="inline-flex items-center justify-center p-4 bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-2xl mb-6">
                    <Home className="h-12 w-12 text-red-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-ocean-dark mb-4 font-playfair">{t('general.unable_load')}</h3>
                  <p className="text-ocean/70 mb-8">{error}</p>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button 
                      onClick={() => window.location.reload()}
                      className="bg-gradient-to-r from-ocean to-tropical hover:from-tropical hover:to-ocean text-white font-medium rounded-2xl px-8 py-3"
                    >
                      {t('general.try_again')}
                    </Button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ) : homestays.length === 0 ? (
            <motion.div 
              className="max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl p-12 border border-white/50 shadow-2xl text-center overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-ocean/10 to-tropical/10 rounded-full -translate-y-16 translate-x-16"></div>
                
                <div className="relative z-10">
                  <motion.div
                    animate={{
                      y: [0, -10, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="inline-flex items-center justify-center p-4 bg-gradient-to-r from-ocean/10 to-tropical/10 rounded-2xl mb-6"
                  >
                    <Home className="h-12 w-12 text-ocean" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-ocean-dark mb-4 font-playfair">{t('general.no_homestays')}</h3>
                  <p className="text-ocean/70 mb-2">{t('general.updating_listings')}</p>
                  <p className="text-ocean/70">{t('general.check_back')}</p>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-12"
            >
              {/* Filter Section */}
              <Card className="p-6 bg-white/95 backdrop-blur-xl border-white/50 shadow-xl">
                <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="relative flex-1 max-w-md">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder={t('accommodation.search_placeholder')}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-white/90 border-ocean/20 focus:border-ocean"
                      />
                    </div>
                    
                    <Button
                      variant="outline"
                      onClick={() => setShowFilters(!showFilters)}
                      className="flex items-center gap-2 border-ocean/20 text-ocean hover:bg-ocean/10"
                    >
                      <Filter className="h-4 w-4" />
                      {t('accommodation.filters')}
                      {(priceRange !== "all" || guestCapacity !== "all") && (
                        <Badge variant="secondary" className="ml-1 bg-ocean text-white">
                          {[priceRange !== "all" ? 1 : 0, guestCapacity !== "all" ? 1 : 0].reduce((a, b) => a + b, 0)}
                        </Badge>
                      )}
                    </Button>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">
                      {filteredHomestays.length} of {homestays.length} {t('accommodation.results')}
                    </span>
                    {(searchQuery || priceRange !== "all" || guestCapacity !== "all") && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="text-ocean hover:bg-ocean/10"
                      >
                        <X className="h-4 w-4 mr-1" />
                        {t('accommodation.clear_filters')}
                      </Button>
                    )}
                  </div>
                </div>

                <AnimatePresence>
                  {showFilters && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-6 mt-6 border-t border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              <DollarSign className="inline h-4 w-4 mr-1" />
                              {t('accommodation.price_range')}
                            </label>
                            <Select value={priceRange} onValueChange={setPriceRange}>
                              <SelectTrigger className="bg-white/90 border-ocean/20">
                                <SelectValue placeholder={t('filter.select_price')} />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">{t('price.all')}</SelectItem>
                                <SelectItem value="budget">{t('price.budget')}</SelectItem>
                                <SelectItem value="mid">{t('price.mid')}</SelectItem>
                                <SelectItem value="luxury">{t('price.luxury')}</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              <UserCheck className="inline h-4 w-4 mr-1" />
                              {t('accommodation.guest_capacity')}
                            </label>
                            <Select value={guestCapacity} onValueChange={setGuestCapacity}>
                              <SelectTrigger className="bg-white/90 border-ocean/20">
                                <SelectValue placeholder={t('filter.select_capacity')} />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">{t('capacity.all')}</SelectItem>
                                <SelectItem value="1-2">{t('capacity.1-2')}</SelectItem>
                                <SelectItem value="3-4">{t('capacity.3-4')}</SelectItem>
                                <SelectItem value="5+">{t('capacity.5+')}</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="flex items-end">
                            <Button
                              onClick={clearFilters}
                              variant="outline"
                              className="w-full border-gray-300 text-gray-600 hover:bg-gray-50"
                            >
                              {t('accommodation.reset_filters')}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>

              {/* Enhanced Homestay Grid */}
              <div data-homestays-section className="relative bg-white/90 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-white/50 shadow-2xl overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-ocean/10 to-tropical/10 rounded-full -translate-y-20 translate-x-20"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-br from-sand-light/20 to-sand-dark/20 rounded-full translate-y-20 -translate-x-20"></div>
                
                <div className="relative z-10">
                  <HomestayGrid homestays={filteredHomestays} />
                </div>
              </div>

              {/* Call to Action */}
              <motion.div 
                className="text-center"
                variants={itemVariants}
              >
                <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl p-12 border border-white/50 shadow-2xl overflow-hidden">
                  {/* Decorative elements */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-ocean/10 to-tropical/10 rounded-full -translate-y-16 translate-x-16"></div>
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-br from-sand-light/20 to-sand-dark/20 rounded-full translate-y-16 -translate-x-16"></div>
                  
                  <div className="relative z-10">
                    <h3 className="text-3xl md:text-4xl font-bold text-ocean-dark mb-6 font-playfair">
                      {t('cta.cant_find')}
                    </h3>
                    <p className="text-xl text-ocean/70 mb-8 max-w-2xl mx-auto">
                      {t('cta.contact_description')}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button 
                          size="lg"
                          className="bg-gradient-to-r from-ocean to-tropical hover:from-tropical hover:to-ocean text-white font-semibold rounded-2xl px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          <MapPin className="mr-2 h-5 w-5" />
                          {t('cta.contact_team')}
                        </Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button 
                          variant="outline"
                          size="lg"
                          className="border-ocean/30 text-ocean hover:bg-ocean/10 rounded-2xl px-8 py-4 font-semibold"
                        >
                          <Waves className="mr-2 h-5 w-5" />
                          {t('cta.explore_activities')}
                        </Button>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <Footer />
    </div>
  );
};

export default AccommodationPage;

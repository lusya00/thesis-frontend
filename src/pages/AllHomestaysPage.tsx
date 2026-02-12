import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import EnhancedNavbar from "../components/EnhancedNavbar";
import HomestayGrid from "../components/accommodation/HomestayGrid";
import { Loader2, Home, Waves, Star, TreePalm, MapPin, Users, Bed, Filter, Search, X, DollarSign, UserCheck, Languages, ArrowLeft } from "lucide-react";
import { homestayService, adaptHomestayForDisplay } from "@/lib/services/homestayService";
import type { Homestay } from "../components/accommodation/types";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/hooks/useTranslation";

const AllHomestaysPage = () => {
  const { language, setLanguage, t } = useTranslation();
  const [searchParams] = useSearchParams();
  const [homestays, setHomestays] = useState<Homestay[]>([]);
  const [filteredHomestays, setFilteredHomestays] = useState<Homestay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState("all");
  const [guestCapacity, setGuestCapacity] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  // Get filter from URL params
  const filterParam = searchParams.get('filter');

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

    // Apply URL filter first
    if (filterParam) {
      switch (filterParam) {
        case 'popular':
          // Filter for popular homestays (high rating)
          filtered = filtered.filter(homestay => homestay.rating >= 4.5);
          break;
        case 'discount':
          // Filter for budget-friendly homestays (lower price)
          filtered = filtered.filter(homestay => {
            const price = parseFloat(homestay.price.replace(/[^0-9]/g, ''));
            return price <= 400000; // Consider as discounted/budget
          });
          break;
        case 'nearby':
          // Filter for homestays with "near" or "close" in description
          filtered = filtered.filter(homestay =>
            homestay.description.toLowerCase().includes('near') ||
            homestay.description.toLowerCase().includes('close') ||
            homestay.description.toLowerCase().includes('central')
          );
          break;
        case 'family':
          // Filter for family-friendly homestays
          filtered = filtered.filter(homestay => parseInt(homestay.capacity.replace(/[^0-9]/g, '')) >= 4);
          break;
        default:
          break;
      }
    }

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
  }, [searchQuery, priceRange, guestCapacity, homestays, filterParam]);

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

      <div className="container mx-auto px-4 py-32 relative z-10">
        {/* Header Section */}
        <motion.section
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center justify-between mb-8">
            <Link to="/homestays">
              <Button variant="outline" className="flex items-center gap-2 border-ocean/20 text-ocean hover:bg-ocean/10">
                <ArrowLeft className="h-4 w-4" />
                Back to Accommodation
              </Button>
            </Link>
            <div className="text-center">
              <div className="inline-flex items-center mb-6">
                <TreePalm className="text-ocean h-8 w-8 mr-3" />
                <span className="text-ocean font-semibold uppercase tracking-wider">All Homestays</span>
                <Waves className="text-ocean h-8 w-8 ml-3" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-ocean-dark mb-6 font-playfair">
                Discover All Our Homestays
              </h2>
              <p className="text-xl text-ocean/70 max-w-3xl mx-auto leading-relaxed">
                Explore our complete collection of island homestays, each offering unique experiences and authentic hospitality.
              </p>
            </div>
            <div></div> {/* Spacer for centering */}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { icon: <Home className="h-8 w-8 text-ocean" />, number: homestays.length.toString(), label: "Total Homestays" },
              { icon: <Bed className="h-8 w-8 text-ocean" />, number: "50+", label: "Comfortable Rooms" },
              { icon: <Users className="h-8 w-8 text-ocean" />, number: "1000+", label: "Happy Guests" },
              { icon: <Star className="h-8 w-8 text-ocean" />, number: "4.8", label: "Average Rating" }
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

        {/* Content */}
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
              <p className="text-2xl text-ocean-dark font-medium mt-8 mb-2">Loading all homestays...</p>
              <p className="text-ocean/70">Finding the perfect stays for you</p>
            </motion.div>
          ) : error ? (
            <motion.div
              className="max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl p-12 border border-white/50 shadow-2xl text-center overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-500/10 to-orange-500/10 rounded-full -translate-y-16 translate-x-16"></div>

                <div className="relative z-10">
                  <div className="inline-flex items-center justify-center p-4 bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-2xl mb-6">
                    <Home className="h-12 w-12 text-red-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-ocean-dark mb-4 font-playfair">Unable to load homestays</h3>
                  <p className="text-ocean/70 mb-8">{error}</p>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      onClick={() => window.location.reload()}
                      className="bg-gradient-to-r from-ocean to-tropical hover:from-tropical hover:to-ocean text-white font-medium rounded-2xl px-8 py-3"
                    >
                      Try Again
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
                  <h3 className="text-2xl font-bold text-ocean-dark mb-4 font-playfair">No homestays available</h3>
                  <p className="text-ocean/70 mb-2">We're updating our listings</p>
                  <p className="text-ocean/70">Check back soon for new accommodations</p>
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
                        placeholder="Search homestays..."
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
                      Filters
                      {(priceRange !== "all" || guestCapacity !== "all") && (
                        <Badge variant="secondary" className="ml-1 bg-ocean text-white">
                          {[priceRange !== "all" ? 1 : 0, guestCapacity !== "all" ? 1 : 0].reduce((a, b) => a + b, 0)}
                        </Badge>
                      )}
                    </Button>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">
                      {filteredHomestays.length} of {homestays.length} results
                    </span>
                    {(searchQuery || priceRange !== "all" || guestCapacity !== "all") && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="text-ocean hover:bg-ocean/10"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Clear filters
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
                              Price Range
                            </label>
                            <Select value={priceRange} onValueChange={setPriceRange}>
                              <SelectTrigger className="bg-white/90 border-ocean/20">
                                <SelectValue placeholder="Select price" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="budget">Budget</SelectItem>
                                <SelectItem value="mid">Mid-range</SelectItem>
                                <SelectItem value="luxury">Luxury</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              <UserCheck className="inline h-4 w-4 mr-1" />
                              Guest Capacity
                            </label>
                            <Select value={guestCapacity} onValueChange={setGuestCapacity}>
                              <SelectTrigger className="bg-white/90 border-ocean/20">
                                <SelectValue placeholder="Select capacity" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="1-2">1-2 guests</SelectItem>
                                <SelectItem value="3-4">3-4 guests</SelectItem>
                                <SelectItem value="5+">5+ guests</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="flex items-end">
                            <Button
                              onClick={clearFilters}
                              variant="outline"
                              className="w-full border-gray-300 text-gray-600 hover:bg-gray-50"
                            >
                              Reset Filters
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>

              {/* Homestay Grid */}
              <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-white/50 shadow-2xl overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-ocean/10 to-tropical/10 rounded-full -translate-y-20 translate-x-20"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-br from-sand-light/20 to-sand-dark/20 rounded-full translate-y-20 -translate-x-20"></div>

                <div className="relative z-10">
                  <HomestayGrid homestays={filteredHomestays} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Footer />
    </div>
  );
};

export default AllHomestaysPage;

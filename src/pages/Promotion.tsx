import { motion } from "framer-motion";
import { ArrowUp, Car, ChevronRight, Gift, MapPin, Star, Users, Utensils, Wifi } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import EnhancedNavbar from "../components/EnhancedNavbar";
import Footer from "../components/Footer";
import LoadingAnimation from "../components/LoadingAnimation";
import HomestayCard from "../components/accommodation/HomestayCard";
import { Homestay } from "../components/accommodation/types";

const Promotion = () => {
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
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
      setTimeout(() => setContentLoaded(true), 300);
    }, 1000);

    const fallbackTimer = setTimeout(() => {
      setIsLoading(false);
      setContentLoaded(true);
    }, 2000);

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

  // Mock homestay data for demonstration
  const mockHomestays: Homestay[] = [
    {
      id: 1,
      name: "Villa Sunset Paradise",
      description: "Beautiful villa with ocean views and modern amenities",
      price: "Rp 1,500,000",
      rating: 4.8,
      image: "/placeholder.svg",
      capacity: "4 guests",
      amenities: [
        { icon: Wifi, name: "WiFi", translationKey: "amenities.wifi" },
        { icon: Car, name: "Parking", translationKey: "amenities.parking" },
        { icon: Utensils, name: "Kitchen", translationKey: "amenities.kitchen" },
      ],
    },
    {
      id: 2,
      name: "Beachfront Cottage",
      description: "Cozy cottage right on the beach with private access",
      price: "Rp 1,200,000",
      rating: 4.6,
      image: "/placeholder.svg",
      capacity: "2 guests",
      amenities: [
        { icon: Wifi, name: "WiFi", translationKey: "amenities.wifi" },
        { icon: Utensils, name: "Kitchen", translationKey: "amenities.kitchen" },
      ],
    },
    {
      id: 3,
      name: "Family Resort Villa",
      description: "Spacious villa perfect for families with kids",
      price: "Rp 2,500,000",
      rating: 4.9,
      image: "/placeholder.svg",
      capacity: "8 guests",
      amenities: [
        { icon: Wifi, name: "WiFi", translationKey: "amenities.wifi" },
        { icon: Car, name: "Parking", translationKey: "amenities.parking" },
        { icon: Utensils, name: "Kitchen", translationKey: "amenities.kitchen" },
      ],
    },
    {
      id: 4,
      name: "Budget Beach Stay",
      description: "Affordable accommodation with basic amenities",
      price: "Rp 800,000",
      rating: 4.2,
      image: "/placeholder.svg",
      capacity: "2 guests",
      amenities: [
        { icon: Wifi, name: "WiFi", translationKey: "amenities.wifi" },
      ],
    },
  ];

  const promotionSections = [
    {
      id: 1,
      title: "Rekomendasi Terbaik Minggu Ini",
      description: "Menampilkan homestay paling populer atau paling banyak dibooking minggu ini.",
      icon: <Star className="h-8 w-8 text-ocean" />,
      homestays: mockHomestays.slice(0, 3), // Top 3 popular
      route: "/accommodation?filter=popular",
    },
    {
      id: 2,
      title: "Liburan Hemat Spesial",
      description: "Homestay dengan diskon besar atau harga promo.",
      icon: <Gift className="h-8 w-8 text-ocean" />,
      homestays: mockHomestays.slice(1, 4), // Discounted ones
      route: "/accommodation?filter=discounted",
    },
    {
      id: 3,
      title: "Homestay Favorit di Sekitar Kamu",
      description: "Berbasis lokasi pengguna (nearby recommendation).",
      icon: <MapPin className="h-8 w-8 text-ocean" />,
      homestays: mockHomestays.slice(0, 2), // Nearby ones
      route: "/accommodation?filter=nearby",
    },
    {
      id: 4,
      title: "Penginapan Pilihan Keluarga",
      description: "Khusus homestay yang nyaman untuk keluarga / grup.",
      icon: <Users className="h-8 w-8 text-ocean" />,
      homestays: [mockHomestays[2]], // Family-friendly
      route: "/accommodation?filter=family",
    },
  ];

  return (
    <>
      <LoadingAnimation
        isLoading={isLoading}
        onComplete={() => setContentLoaded(true)}
      />

      <motion.div
        className="min-h-screen bg-white font-poppins"
        initial={{ opacity: 0 }}
        animate={{ opacity: contentLoaded ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      >
        <EnhancedNavbar />

        {/* Hero Section */}
        <motion.section
          className="relative bg-gradient-to-br from-ocean via-ocean-light to-teal-100 py-20 px-4"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: contentLoaded ? 1 : 0, y: contentLoaded ? 0 : 50 }}
          transition={{ duration: 0.8 }}
        >
          <div className="max-w-6xl mx-auto text-center">
            <motion.h1
              className="text-4xl md:text-6xl font-bold text-white mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: contentLoaded ? 1 : 0, y: contentLoaded ? 0 : 30 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Special Promotions
            </motion.h1>
            <motion.p
              className="text-xl text-white/90 mb-8 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: contentLoaded ? 1 : 0, y: contentLoaded ? 0 : 30 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Discover exclusive deals and special offers to make your stay at Untung Jawa Escapes unforgettable.
            </motion.p>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl" />
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
        </motion.section>

        {/* Promotion Sections */}
        {promotionSections.map((section, sectionIndex) => (
          <motion.section
            key={section.id}
            className={`py-16 px-4 ${sectionIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: contentLoaded ? 1 : 0, y: contentLoaded ? 0 : 50 }}
            transition={{ duration: 0.8, delay: 0.6 + sectionIndex * 0.2 }}
          >
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-ocean/10 rounded-full">
                    {section.icon}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      {section.title}
                    </h2>
                    <p className="text-gray-600">
                      {section.description}
                    </p>
                  </div>
                </div>
                <Link
                  to={`/homestays/all?filter=${section.route.split('?filter=')[1]}`}
                  className="flex items-center gap-2 text-ocean hover:text-ocean-dark transition-colors group"
                >
                  <span className="font-medium">View All</span>
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {section.homestays.map((homestay, index) => (
                  <motion.div
                    key={homestay.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: contentLoaded ? 1 : 0, y: contentLoaded ? 0 : 30 }}
                    transition={{ duration: 0.6, delay: 0.8 + sectionIndex * 0.2 + index * 0.1 }}
                  >
                    <HomestayCard homestay={homestay} />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>
        ))}

        {/* Call to Action */}
        <motion.section
          className="py-16 px-4 bg-gradient-to-r from-ocean to-ocean-dark text-white"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: contentLoaded ? 1 : 0, y: contentLoaded ? 0 : 50 }}
          transition={{ duration: 0.8, delay: 1.0 }}
        >
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">
              Ready to Save on Your Next Adventure?
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Don't miss out on these limited-time offers. Book now and create memories that last a lifetime.
            </p>
            <motion.button
              className="bg-white text-ocean px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Book Now
            </motion.button>
          </div>
        </motion.section>

        <Footer />

        {/* Scroll to top button */}
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
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-ocean to-ocean-dark opacity-0 group-hover:opacity-50 blur-md transition-opacity duration-300" />
        </motion.button>
      </motion.div>
    </>
  );
};

export default Promotion;

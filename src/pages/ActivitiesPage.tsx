 import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/hooks/useTranslation";
import { motion } from "framer-motion";
import {
  Anchor,
  Bird,
  Camera,
  Clock,
  Coffee,
  Compass,
  Heart,
  Leaf,
  Star,
  TreePalm,
  Users,
  Waves
} from "lucide-react";
import { useEffect, useState } from "react";
import EnhancedNavbar from "../components/EnhancedNavbar";
import Footer from "../components/Footer";

const iconMap = {
  nature: <Bird className="h-6 w-6 text-ocean" />,
  conservation: <Leaf className="h-6 w-6 text-ocean" />,
  nightlife: <Star className="h-6 w-6 text-ocean" />,
  adventure: <Anchor className="h-6 w-6 text-ocean" />,
  water: <Waves className="h-6 w-6 text-ocean" />,
  cultural: <TreePalm className="h-6 w-6 text-ocean" />,
  dining: <Heart className="h-6 w-6 text-ocean" />,
  photography: <Camera className="h-6 w-6 text-ocean" />,
  coffee: <Coffee className="h-6 w-6 text-ocean" />,
  // add more as needesssssd
};

const ActivitiesPage = () => {
  const { t } = useTranslation();

  // State for fetched activities
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Featured activity state
  const [featuredActivity, setFeaturedActivity] = useState(0);

  // Fetch activities from API
  useEffect(() => {
    fetch("https://untung-jawa-admin-dashboard.vercel.app/api/public/activities")
       .then(res => {
         if (!res.ok) throw new Error("Failed to fetch activities");
         return res.json();
       })
       .then(data => {
         console.log(data);
         if (data.success && data.data) {
           // Transform API data to match frontend expectations
           const transformedActivities = data.data.map(activity => ({
             id: activity.id,
             title: activity.title,
             description: activity.description || activity.short_description || '',
             category: activity.category,
             difficulty: activity.difficulty_level,
             duration: activity.duration_minutes ? `${activity.duration_minutes} minutes` : 'Duration not specified',
             participants: `${activity.min_participants}-${activity.max_participants} people`,
             price: `IDR ${activity.price.toLocaleString()}`,
             image: activity.activity_images?.find(img => img.is_primary)?.img_url ||
                    activity.activity_images?.[0]?.img_url ||
                    "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
           }));
           setActivities(transformedActivities);
         } else {
           throw new Error("Invalid API response format");
         }
         setLoading(false);
       })
       .catch(err => {
         setError(err.message || "Failed to fetch activities");
         setLoading(false);
       });
  }, []);

  // Get featured activities (first 3)
  const featuredActivities = activities.slice(0, 3);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };
  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100, damping: 12 }
    }
  };

  // Filter categories and create a unique list
  const categories = [...new Set(activities.map(activity => activity.category))];

  // Function to filter activities by category
  const [selectedCategory, setSelectedCategory] = useState(null);
  const filteredActivities = selectedCategory
    ? activities.filter(activity => activity.category === selectedCategory)
    : activities;

  // Loading and error states
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-ocean-light/20 via-sand-light/30 to-tropical-light/20">
        <span>Loading activities...</span>
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-ocean-light/20 via-sand-light/30 to-tropical-light/20">
        <span className="text-red-500">{error}</span>
      </div>
    );
  }
  if (!activities.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-ocean-light/20 via-sand-light/30 to-tropical-light/20">
        <span>No activities found.</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-ocean-light/20 via-sand-light/30 to-tropical-light/20 relative overflow-hidden">
      {/* ... (rest of your decorative and layout code) ... */}

      <EnhancedNavbar />

      <main className="pt-24 relative z-10">
        {/* ... (rest of your hero/featured section code, using featuredActivities) ... */}

        {/* Enhanced Activities Grid */}
        <section className="py-32 relative">
          <div className="container mx-auto px-4 relative z-10">
            {/* ... (section header and filter code) ... */}

            {/* Activities Grid */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              {filteredActivities.map((activity, index) => (
                <motion.div
                  key={activity.id || index}
                  variants={itemVariants}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="group"
                >
                  <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border border-white/50">
                    {/* Image Container */}
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={activity.image || "https://placehold.co/800x400"}
                        alt={activity.title}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      {/* Category Badge */}
                      <div className="absolute top-4 right-4">
                        <Badge className="backdrop-blur-md px-3 py-1 capitalize font-medium rounded-full shadow-lg">
                          {activity.category}
                        </Badge>
                      </div>
                      {/* Difficulty Badge */}
                      <div className="absolute top-4 left-4">
                        <Badge className="text-white backdrop-blur-md px-3 py-1 capitalize font-medium rounded-full shadow-lg">
                          {activity.difficulty}
                        </Badge>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    </div>
                    {/* Content */}
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-gradient-to-r from-ocean/10 to-tropical/10 rounded-full">
                          {iconMap[activity.category] || <Compass className="h-6 w-6 text-ocean" />}
                        </div>
                        <h3 className="text-xl font-bold text-ocean-dark font-playfair">{activity.title}</h3>
                      </div>
                      <p className="text-ocean/70 mb-6 leading-relaxed">{activity.description}</p>
                      {/* Activity Details */}
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="flex items-center gap-2 text-sm text-ocean/60">
                          <Clock className="h-4 w-4 text-ocean" />
                          <span>{activity.duration}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-ocean/60">
                          <Users className="h-4 w-4 text-ocean" />
                          <span>{activity.participants}</span>
                        </div>
                      </div>
                      {/* Price and Book Button */}
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-ocean/60 mb-1">{t('booking.starting_from')}</p>
                          <p className="text-2xl font-bold text-ocean-dark">{activity.price}</p>
                        </div>
                        {/* <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button
                            size="sm"
                            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium rounded-2xl px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300 border-0">
                            Book Now
                            <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                       </motion.div> */}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
            {/* ... (rest of your call to action and footer code) ... */}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ActivitiesPage;